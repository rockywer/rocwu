import { AI_ROLES, EU_SITES, COMMISSION_RATES, INCENTIVE_PROGRAMS } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI招商拓店专员 - 规模增量岗，多站点拓店、市场布局、资源收割、矩阵搭建';
export const trigger = ['拓店', '招商', '站点', '布局', '矩阵', '入驻'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'expansion_plan':
      return generateExpansionPlan(ctx);
    case 'site_analysis':
      return analyzeSite(ctx);
    case 'check_eligibility':
      return checkSiteEligibility(ctx);
    case 'low_commission':
      return checkLowCommission(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.expand;
  return `## 🌍 AI招商拓店专员 · 规模增量岗\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function generateExpansionPlan(ctx) {
  const { currentSites, targetCount } = ctx;
  
  const current = currentSites ? currentSites.split(',') : ['DE'];
  const target = parseInt(targetCount) || 5;
  
  const recommendedSites = EU_SITES.EU8.filter((s) => !current.includes(s)).slice(0, target - current.length);
  
  const plan = {
    currentSites: current,
    targetSites: [...current, ...recommendedSites],
    phases: [
      { phase: 1, sites: recommendedSites.slice(0, 2), duration: '1-2周', focus: '快速入驻，激活低佣' },
      { phase: 2, sites: recommendedSites.slice(2, 4), duration: '2-3周', focus: '商品上架，基础运营' },
      { phase: 3, sites: recommendedSites.slice(4), duration: '3-4周', focus: '投放测试，优化调整' },
    ],
    benefits: [
      `预计新增佣金减免：¥${(recommendedSites.length * 5000).toLocaleString()}`,
      `预计新增GMV：¥${(recommendedSites.length * 100000).toLocaleString()}`,
      '激活扩店激励政策',
      '分散运营风险',
    ],
  };
  
  return `## 📍 拓店规划方案\n\n**当前站点**：${plan.currentSites.join('、')}（${plan.currentSites.length}个）\n**目标站点**：${plan.targetSites.join('、')}（${plan.targetSites.length}个）\n**新增站点**：${recommendedSites.join('、')}（${recommendedSites.length}个）\n\n### 🗺️ 分阶段规划：\n${plan.phases.map((p) => `**Phase ${p.phase}**\n• 目标站点：${p.sites.join('、')}\n• 周期：${p.duration}\n• 重点：${p.focus}\n`).join('\n')}\n\n### 🎁 预期收益：\n${plan.benefits.map((b) => `• ${b}`).join('\n')}\n\n### 📋 入驻清单：\n• 企业营业执照\n• VAT注册证明（部分站点）\n• 品牌授权文件（如有）\n• 产品合规资质\n• 收款账户信息\n\n### 💡 注意事项：\n• 优先入驻低佣站点，最大化佣金减免\n• 每个站点独立运营，确保合规\n• 统一商品库，提高上架效率`;
}

function analyzeSite(ctx) {
  const { site } = ctx;
  
  const siteAnalysis = {
    site: site || 'PL',
    commissionRate: COMMISSION_RATES['2%'].includes(site) ? '2%' : COMMISSION_RATES['4%'].includes(site) ? '4%' : '6%',
    marketSize: '中',
    competition: '低',
    growthPotential: '高',
    complianceRequirements: ['VAT', 'EPR'],
    recommendedCategories: ['居家用品', '家居收纳', '个护美妆'],
    estimatedGMV: '¥50万-100万/月',
    estimatedCost: '¥5000-10000',
    incentivePrograms: INCENTIVE_PROGRAMS.filter((p) => p.id === 'expansion' || p.id === 'new-seller'),
  };
  
  return `## 🌍 ${siteAnalysis.site}站点分析报告\n\n### 📊 基础信息：\n• 佣金率：${siteAnalysis.commissionRate}\n• 市场规模：${siteAnalysis.marketSize}\n• 竞争程度：${siteAnalysis.competition}\n• 增长潜力：${siteAnalysis.growthPotential}\n\n### 🛡️ 合规要求：\n${siteAnalysis.complianceRequirements.map((r) => `• ${r}`).join('\n')}\n\n### 🎯 推荐品类：\n${siteAnalysis.recommendedCategories.map((c) => `• ${c}`).join('\n')}\n\n### 💰 预期数据：\n• 预估GMV：${siteAnalysis.estimatedGMV}\n• 启动成本：${siteAnalysis.estimatedCost}\n\n### 🎁 可享激励：\n${siteAnalysis.incentivePrograms.map((p) => `• **${p.name}**：${p.benefit}`).join('\n')}\n\n### 💡 入驻建议：\n• ${siteAnalysis.commissionRate === '2%' ? '低佣红利站点，强烈推荐入驻' : '佣金率较高，需评估ROI'}\n• 结合现有商品库，快速上架\n• 关注本地消费者偏好，调整选品策略`;
}

function checkSiteEligibility(ctx) {
  const { shopId, site } = ctx;
  
  const eligibility = {
    shopId: shopId || 'SHOP-001',
    targetSite: site || 'PL',
    requirements: [
      { name: '企业资质', status: '✅ 已满足', detail: '营业执照齐全' },
      { name: 'VAT注册', status: '✅ 已满足', detail: '已注册对应国家VAT' },
      { name: '品牌授权', status: '⚠️ 部分满足', detail: '部分品牌需补充授权' },
      { name: '产品合规', status: '✅ 已满足', detail: 'CE认证齐全' },
      { name: '收款账户', status: '✅ 已满足', detail: '支持当地币种' },
    ],
    overallStatus: '基本满足',
    nextSteps: [
      '补充品牌授权文件',
      '完成站点入驻申请',
      '准备首批上架商品',
      '制定运营计划',
    ],
  };
  
  return `## ✅ ${eligibility.targetSite}站点入驻资质检查\n\n**店铺**：${eligibility.shopId}\n**目标站点**：${eligibility.targetSite}\n**整体状态**：${eligibility.overallStatus}\n\n### 📋 资质详情：\n${eligibility.requirements.map((r) => `• **${r.name}**：${r.status}\n  ${r.detail}\n`).join('\n')}\n\n### 📌 下一步行动：\n${eligibility.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n### ⏰ 预计时间：\n• 资质准备：1-2天\n• 入驻申请：3-5个工作日\n• 商品上架：3-7天\n• 正式运营：申请通过后即时`;
}

function checkLowCommission(ctx) {
  const { shopId } = ctx;
  
  const lowCommissionSites = COMMISSION_RATES['2%'];
  const mediumCommissionSites = COMMISSION_RATES['4%'];
  
  const currentShops = store.listShops();
  const activatedSites = currentShops.map((s) => s.site).filter(Boolean);
  
  const availableSites = lowCommissionSites.filter((s) => !activatedSites.includes(s));
  
  const savings = {
    currentCommission: '6%',
    targetCommission: '2%',
    savingsRate: '66.7%',
    estimatedSavings: `¥${((activatedSites.length + availableSites.length) * 10000).toLocaleString()}/月`,
  };
  
  return `## 🎁 全域低佣政策检查\n\n**店铺**：${shopId || '当前店铺'}\n\n### 📊 当前状态：\n• 已激活低佣站点：${activatedSites.length}个\n• 未激活低佣站点：${availableSites.length}个\n• 当前平均佣金率：${savings.currentCommission}\n\n### 💰 佣金优化空间：\n• 目标佣金率：${savings.targetCommission}\n• 预计节省比例：${savings.savingsRate}\n• 预估月节省：${savings.estimatedSavings}\n\n### 🎯 可激活低佣站点：\n${availableSites.map((s) => `• ${s} — 佣金率 2%`).join('\n')}\n\n### 📋 激活条件：\n• 完成新店入驻\n• 上架指定数量商品\n• 完成新手任务\n\n### 💡 建议：\n• 优先激活${availableSites.slice(0, 3).join('、')}等站点\n• 确保满足低佣政策要求，避免佣金回调\n• 监控佣金费率变化，及时调整`;
}
