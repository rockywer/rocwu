import { AI_ROLES, COMPLIANCE_RULES, EU_SITES, COMMISSION_RATES, INCENTIVE_PROGRAMS } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI政策合规专员 - 风控底线岗，全链路合规审核、政策解读、资质管控、风险预警';
export const trigger = ['合规', '政策', 'VAT', 'EPR', 'GDPR', 'CE', '资质', '风险'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'check_product':
      return checkProductCompliance(ctx);
    case 'policy_update':
      return updatePolicyRules(ctx);
    case 'risk_scan':
      return scanShopRisk(ctx);
    case 'benefit_check':
      return checkBenefitEligibility(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.compliance;
  return `## 🛡️ AI政策合规专员 · 风控底线岗\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function checkProductCompliance(ctx) {
  const { productName, category, sites } = ctx;
  if (!productName) return '❌ 请提供商品名称进行合规检查。';
  
  const rules = Object.entries(COMPLIANCE_RULES).map(([code, rule]) => ({
    code,
    ...rule,
    applicable: isRuleApplicable(category, code),
  }));
  
  const result = {
    product: productName,
    category: category || '未指定',
    targetSites: sites || EU_SITES.ALL,
    compliance: rules,
    suggestions: generateComplianceSuggestions(rules),
  };
  
  store.addComplianceRecord({
    productName,
    category: category || '',
    sites: sites || [],
    status: rules.every((r) => !r.applicable || r.applicable) ? 'passed' : 'pending',
    rules: rules.map((r) => ({ code: r.code, applicable: r.applicable })),
  });
  
  let output = `## ✅ ${productName} 合规检查报告\n\n**商品类别**：${category || '未指定'}\n**目标站点**：${(sites || EU_SITES.ALL).join('、')}\n\n### 合规规则评估：\n`;
  
  rules.forEach((rule) => {
    const status = rule.applicable ? '⚠️ 需要关注' : '✅ 不适用';
    output += `**${rule.name} (${rule.code})**\n• 适用范围：${rule.scope}\n• 状态：${status}\n• 要求：${rule.requirements.join('、')}\n\n`;
  });
  
  output += `### 合规建议：\n${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  
  return output;
}

function isRuleApplicable(category, code) {
  const categoryRules = {
    '3C数码': ['CE', 'REACH'],
    '玩具': ['CE', 'REACH'],
    '医疗器械': ['CE', 'GDPR'],
    '化学品': ['REACH', 'GDPR'],
    '包装材料': ['EPR'],
    '电子产品': ['CE', 'EPR'],
  };
  
  if (code === 'VAT') return true;
  if (code === 'GDPR') return true;
  
  return categoryRules[category]?.includes(code) || false;
}

function generateComplianceSuggestions(rules) {
  const suggestions = [];
  const applicableRules = rules.filter((r) => r.applicable);
  
  if (applicableRules.some((r) => r.code === 'VAT')) {
    suggestions.push('建议提前注册目标国家VAT号，确保IOSS/OSS申报合规');
  }
  if (applicableRules.some((r) => r.code === 'EPR')) {
    suggestions.push('需注册EPR号码并按时申报年度回收量');
  }
  if (applicableRules.some((r) => r.code === 'CE')) {
    suggestions.push('需准备CE认证技术文件，确保产品符合欧盟安全标准');
  }
  if (applicableRules.some((r) => r.code === 'REACH')) {
    suggestions.push('需检测产品中SVHC物质含量，准备安全数据表');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('当前商品合规风险较低，可正常上架');
  }
  
  return suggestions;
}

function updatePolicyRules(ctx) {
  return `## 📢 合规政策更新\n\n### 欧盟最新合规规则：\n${Object.entries(COMPLIANCE_RULES).map(([code, rule]) => `**${rule.name} (${code})**\n• 适用范围：${rule.scope}\n• 核心要求：${rule.requirements.join('、')}\n`).join('\n')}\n\n### 佣金费率参考：\n${Object.entries(COMMISSION_RATES).map(([rate, sites]) => `• ${rate} 低佣站点：${sites.join('、')}`).join('\n')}`;
}

function scanShopRisk(ctx) {
  const shops = store.listShops();
  const complianceRecords = store.listComplianceRecords();
  
  const risks = [];
  const pendingCompliance = complianceRecords.filter((r) => r.status === 'pending');
  
  if (pendingCompliance.length > 0) {
    risks.push(`⚠️ ${pendingCompliance.length} 项合规审核待处理`);
  }
  
  const today = new Date().toISOString().slice(0, 10);
  const recentCompliance = complianceRecords.filter((r) => r.createdAt?.startsWith(today));
  const failedCount = recentCompliance.filter((r) => r.status === 'failed').length;
  
  if (failedCount > 0) {
    risks.push(`❌ ${failedCount} 项合规审核未通过`);
  }
  
  const result = {
    totalShops: shops.length,
    activeShops: shops.filter((s) => s.status === 'active').length,
    pendingCompliance: pendingCompliance.length,
    risks: risks.length > 0 ? risks : ['✅ 暂无风险预警'],
  };
  
  return `## 🔍 店铺风险扫描报告\n\n### 店铺概况：\n• 总店铺数：${result.totalShops}\n• 运营中店铺：${result.activeShops}\n\n### 合规状态：\n• 待审核项：${result.pendingCompliance}\n\n### 风险预警：\n${result.risks.map((r) => `${r}`).join('\n')}`;
}

function checkBenefitEligibility(ctx) {
  const { shopId, site } = ctx;
  
  const eligiblePrograms = INCENTIVE_PROGRAMS.map((p) => ({
    ...p,
    eligible: true,
    reason: getEligibilityReason(p, shopId, site),
  }));
  
  return `## 🎁 平台激励政策匹配\n\n### 可申领政策：\n${eligiblePrograms.map((p) => {
    const status = p.eligible ? '✅ 符合条件' : '❌ 暂不符合';
    return `**${p.name}**\n• 状态：${status}\n• 说明：${p.description}\n• 权益：${p.benefit}\n• ${p.reason}`;
  }).join('\n')}`;
}

function getEligibilityReason(program, shopId, site) {
  switch (program.id) {
    case 'new-seller':
      return '新店入驻前90天可申领';
    case 'expansion':
      return `入驻${site || 'EU8'}蓝海站点即可激活`;
    case 'ad-bonus':
      return '完成指定投放任务即可返还';
    case 'sample':
      return '给本土达人寄样可获运费补贴';
    default:
      return '请查看平台具体要求';
  }
}
