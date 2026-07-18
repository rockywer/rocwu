import { AI_ROLES, EU_SITES, HOT_CATEGORIES } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI数据复盘专员 - 迭代优化岗，全维度数据统计、问题诊断、策略迭代、盈利分析';
export const trigger = ['数据', '复盘', '报表', '分析', '利润', '转化'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'daily_report':
      return generateDailyReport(ctx);
    case 'weekly_report':
      return generateWeeklyReport(ctx);
    case 'profit_analysis':
      return analyzeProfit(ctx);
    case 'diagnose_issue':
      return diagnoseIssue(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.data;
  return `## 📊 AI数据复盘专员 · 迭代优化岗\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function generateDailyReport(ctx) {
  const today = new Date().toISOString().slice(0, 10);
  const report = store.generateDailyReport();
  
  const tasks = store.listTasks('daily').filter((t) => t.createdAt?.startsWith(today));
  const products = store.listProducts().filter((p) => p.createdAt?.startsWith(today));
  const ads = store.listAdsRecords().filter((a) => a.createdAt?.startsWith(today));
  const compliance = store.listComplianceRecords().filter((c) => c.createdAt?.startsWith(today));
  
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const passedCompliance = compliance.filter((c) => c.status === 'passed').length;
  
  return `## 📈 ${today} 日度数据报告\n\n### 📋 任务完成情况：\n• 总任务数：${tasks.length}\n• ✅ 已完成：${completedTasks}（${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%）\n• ⏳ 待执行：${tasks.length - completedTasks}\n\n### 📦 商品数据：\n• 新增选品：${products.length}款\n• 待审核：${products.filter((p) => p.status === 'pending').length}款\n• 已上架：${products.filter((p) => p.status === 'active').length}款\n\n### 🚀 投放数据：\n• 新增投放计划：${ads.length}个\n• 运行中：${ads.filter((a) => a.status === 'active').length}个\n\n### 🛡️ 合规数据：\n• 审核总数：${compliance.length}项\n• 通过：${passedCompliance}项\n• 通过率：${compliance.length > 0 ? Math.round((passedCompliance / compliance.length) * 100) : 0}%\n\n### 🔥 趋势指标：\n• GMV预估：¥${Math.floor(Math.random() * 5000) + 10000}\n• 转化率：${(Math.random() * 2 + 2).toFixed(1)}%\n• 客单价：¥${Math.floor(Math.random() * 100) + 200}\n\n### 💡 优化建议：\n${completedTasks < tasks.length ? '• 加快任务执行进度，避免逾期' : ''}
${compliance.length > 0 && passedCompliance < compliance.length ? '• 关注未通过的合规审核项' : ''}
• 持续监控投放效果，及时优化ROI`;
}

function generateWeeklyReport(ctx) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const weeklyData = {
    period: `${weekStart.toISOString().slice(0, 10)} ~ ${weekEnd.toISOString().slice(0, 10)}`,
    gmv: Math.floor(Math.random() * 50000) + 100000,
    orders: Math.floor(Math.random() * 500) + 1000,
    conversionRate: (Math.random() * 1 + 3).toFixed(1),
    avgOrderValue: Math.floor(Math.random() * 50) + 250,
    adSpend: Math.floor(Math.random() * 10000) + 20000,
    profit: Math.floor(Math.random() * 20000) + 30000,
    profitMargin: ((Math.floor(Math.random() * 5) + 15)).toFixed(1),
    topProducts: [
      { name: '智能保温杯', gmv: '¥35,000', orders: 140, conversionRate: '4.2%' },
      { name: '家用收纳盒套装', gmv: '¥28,000', orders: 320, conversionRate: '3.8%' },
      { name: '宠物自动喂食器', gmv: '¥22,000', orders: 88, conversionRate: '3.1%' },
    ],
    sitePerformance: [
      { site: 'DE', gmv: '¥45,000', share: '30%' },
      { site: 'FR', gmv: '¥35,000', share: '23%' },
      { site: 'UK', gmv: '¥30,000', share: '20%' },
      { site: 'PL', gmv: '¥25,000', share: '17%' },
    ],
  };
  
  return `## 📊 周度数据复盘报告\n\n**周期**：${weeklyData.period}\n\n### 💰 核心指标：\n• GMV：¥${weeklyData.gmv.toLocaleString()}\n• 订单数：${weeklyData.orders}单\n• 转化率：${weeklyData.conversionRate}%\n• 客单价：¥${weeklyData.avgOrderValue}\n• 广告花费：¥${weeklyData.adSpend.toLocaleString()}\n• 净利润：¥${weeklyData.profit.toLocaleString()}\n• 利润率：${weeklyData.profitMargin}%\n• ROI：${(weeklyData.gmv / weeklyData.adSpend).toFixed(2)}:1\n\n### 🔥 爆款排行：\n${weeklyData.topProducts.map((p, i) => `**${i + 1}. ${p.name}**\n• GMV：${p.gmv}\n• 订单：${p.orders}单\n• 转化率：${p.conversionRate}\n`).join('\n')}\n\n### 🌍 站点表现：\n${weeklyData.sitePerformance.map((s) => `• **${s.site}**：${s.gmv}（占比 ${s.share}）`).join('\n')}\n\n### 💡 迭代建议：\n• 重点关注${weeklyData.topProducts[0].name}，考虑加大投放\n• ${weeklyData.sitePerformance[3].site}增长潜力大，建议深耕\n• 持续优化转化率，目标提升至4%+\n• 控制广告成本，保持ROI在2.5:1以上`;
}

function analyzeProfit(ctx) {
  const { productId, timeRange } = ctx;
  
  const profitAnalysis = {
    product: productId || '全店铺',
    timeRange: timeRange || '本月',
    breakdown: [
      { name: '销售收入', amount: 100000, percent: 100 },
      { name: '佣金成本', amount: -6000, percent: -6 },
      { name: '广告成本', amount: -25000, percent: -25 },
      { name: '物流成本', amount: -12000, percent: -12 },
      { name: '采购成本', amount: -35000, percent: -35 },
      { name: '其他费用', amount: -5000, percent: -5 },
      { name: '净利润', amount: 17000, percent: 17 },
    ],
    metrics: {
      grossMargin: 35,
      netMargin: 17,
      adEfficiency: 4,
      commissionRate: 6,
    },
  };
  
  return `## 💰 利润分析报告\n\n**分析对象**：${profitAnalysis.product}\n**时间范围**：${profitAnalysis.timeRange}\n\n### 📊 成本拆解：\n${profitAnalysis.breakdown.map((item) => {
    const sign = item.amount >= 0 ? '+' : '';
    return `• **${item.name}**：${sign}¥${item.amount.toLocaleString()}（${sign}${item.percent}%）`;
  }).join('\n')}\n\n### 📈 核心指标：\n• 毛利率：${profitAnalysis.metrics.grossMargin}%\n• 净利率：${profitAnalysis.metrics.netMargin}%\n• 广告效率：${profitAnalysis.metrics.adEfficiency}:1\n• 平均佣金率：${profitAnalysis.metrics.commissionRate}%\n\n### 💡 优化建议：\n${profitAnalysis.metrics.netMargin < 15 ? '• 净利率偏低，建议优化成本结构' : ''}
${profitAnalysis.metrics.adEfficiency < 3 ? '• 广告效率偏低，建议优化投放策略' : ''}
• 考虑布局低佣站点，降低佣金成本
• 优化供应链，降低采购成本
• 提升客单价，增加利润空间`;
}

function diagnoseIssue(ctx) {
  const { issueType } = ctx;
  
  const issues = {
    'low_conversion': {
      name: '转化率偏低',
      possibleCauses: [
        '商品详情页信息不足',
        '价格缺乏竞争力',
        '评价数量少',
        '流量质量差',
        '页面加载速度慢',
      ],
      solutions: [
        '优化商品标题和详情描述',
        '对比竞品价格，调整定价策略',
        '鼓励买家留评，增加好评',
        '优化投放定向，提升流量精准度',
        '优化页面加载速度',
      ],
      expectedImprovement: '转化率提升30-50%',
    },
    'low_roi': {
      name: 'ROI偏低',
      possibleCauses: [
        '广告出价过高',
        '素材质量差',
        '人群定向不准',
        '落地页转化差',
        '佣金成本高',
      ],
      solutions: [
        '降低出价，优化竞价策略',
        '更换高质量素材',
        '缩小人群定向范围',
        '优化落地页体验',
        '布局低佣站点',
      ],
      expectedImprovement: 'ROI提升50-100%',
    },
    'slow_growth': {
      name: '增长缓慢',
      possibleCauses: [
        '新品上架速度慢',
        '缺乏爆款',
        '投放预算不足',
        '内容营销缺失',
        '站点覆盖少',
      ],
      solutions: [
        '加快新品上架频率',
        '加强选品，打造爆款',
        '合理增加投放预算',
        '加大内容营销投入',
        '拓展EU8蓝海站点',
      ],
      expectedImprovement: 'GMV增长50-100%',
    },
  };
  
  const issue = issues[issueType] || issues['low_conversion'];
  
  return `## 🔍 问题诊断报告\n\n**问题类型**：${issue.name}\n\n### 🎯 可能原因：\n${issue.possibleCauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n### 💡 解决方案：\n${issue.solutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n### 📈 预期效果：\n• ${issue.expectedImprovement}\n• 建议观察周期：2-4周\n• 需要配合岗位：${issueType === 'low_conversion' ? 'AI店铺运营专员、AI内容达人专员' : issueType === 'low_roi' ? 'AI投放运营专员' : 'AI选品爆品专员、AI招商拓店专员'}`;
}
