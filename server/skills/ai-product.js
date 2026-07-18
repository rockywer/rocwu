import { AI_ROLES, HOT_CATEGORIES, EU_SITES, COMMISSION_RATES, REGION_STYLES } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI选品爆品专员 - 增长核心岗，趋势挖掘、爆款筛选、竞品分析、测品规划';
export const trigger = ['选品', '爆品', '测品', '趋势', '爆款', '品类'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'daily_list':
      return generateDailyProductList(ctx);
    case 'trend_analysis':
      return analyzeTrends(ctx);
    case 'competitor_analysis':
      return analyzeCompetitor(ctx);
    case 'profit_calc':
      return calculateProfit(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.product;
  return `## 🔥 AI选品爆品专员 · 增长核心岗\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function generateDailyProductList(ctx) {
  const { count = 10, site } = ctx;
  
  const today = new Date().toISOString().slice(0, 10);
  const products = generateMockProducts(parseInt(count), site);
  
  products.forEach((product) => {
    store.addProduct({
      ...product,
      planDate: today,
    });
  });
  
  let output = `## 📦 ${today} 选品清单（${products.length}款）\n\n`;
  
  products.forEach((product, i) => {
    output += `### ${i + 1}. ${product.name}\n`;
    output += `• 品类：${product.category}\n`;
    output += `• 适配站点：${product.sites.join('、')}\n`;
    output += `• 预计成本：¥${product.cost}\n`;
    output += `• 建议售价：€${product.price}\n`;
    output += `• 预估利润：¥${product.profit}（${product.profitMargin}%）\n`;
    output += `• 佣金率：${product.commissionRate}\n`;
    output += `• 卖点：${product.sellingPoints.join('、')}\n`;
    output += `• 合规风险：${product.complianceRisk}\n\n`;
  });
  
  output += `### 选品策略说明：\n• 优先推荐${COMMISSION_RATES['2%'].slice(0, 3).join('、')}等低佣站点\n• 聚焦${HOT_CATEGORIES.slice(0, 3).map((c) => c.name).join('、')}刚需品类\n• 轻小件、高利润、低合规门槛产品优先`;
  
  return output;
}

function generateMockProducts(count, site) {
  const mockProducts = [
    { name: '智能保温杯', category: '居家用品', cost: 68, price: 29.99, profit: 85, profitMargin: 28, commissionRate: '2%', sites: ['DE', 'FR', 'UK'], sellingPoints: ['12小时保温', '智能温度显示', '便携设计'], complianceRisk: '低' },
    { name: '便携式筋膜枪', category: '户外运动', cost: 158, price: 59.99, profit: 120, profitMargin: 23, commissionRate: '4%', sites: ['DE', 'FR', 'IT'], sellingPoints: ['6档调节', '超静音', 'USB充电'], complianceRisk: '中' },
    { name: '家用收纳盒套装', category: '家居收纳', cost: 35, price: 14.99, profit: 45, profitMargin: 25, commissionRate: '2%', sites: ['PL', 'ES', 'DE'], sellingPoints: ['多规格', '可堆叠', '环保材质'], complianceRisk: '低' },
    { name: '宠物自动喂食器', category: '宠物用品', cost: 188, price: 79.99, profit: 150, profitMargin: 22, commissionRate: '2%', sites: ['DE', 'FR', 'UK', 'ES'], sellingPoints: ['定时定量', 'APP控制', '大容量'], complianceRisk: '低' },
    { name: '无线蓝牙耳机', category: '3C数码', cost: 88, price: 39.99, profit: 65, profitMargin: 20, commissionRate: '4%', sites: ['DE', 'UK', 'PL'], sellingPoints: ['主动降噪', '30小时续航', 'IPX5防水'], complianceRisk: '中' },
    { name: '婴儿安抚奶嘴', category: '母婴用品', cost: 18, price: 8.99, profit: 20, profitMargin: 28, commissionRate: '2%', sites: ['DE', 'FR', 'UK'], sellingPoints: ['硅胶材质', '防胀气', '多尺寸'], complianceRisk: '中' },
    { name: '天然护肤精油', category: '个护美妆', cost: 45, price: 24.99, profit: 55, profitMargin: 30, commissionRate: '4%', sites: ['FR', 'DE', 'IT', 'ES'], sellingPoints: ['植物萃取', '无添加', '多种功效'], complianceRisk: '中' },
    { name: '折叠户外桌椅', category: '户外运动', cost: 128, price: 54.99, profit: 95, profitMargin: 22, commissionRate: '2%', sites: ['DE', 'FR', 'UK'], sellingPoints: ['超轻便', '快速折叠', '承重200kg'], complianceRisk: '低' },
    { name: 'LED护眼台灯', category: '居家用品', cost: 78, price: 34.99, profit: 70, profitMargin: 24, commissionRate: '2%', sites: ['DE', 'FR', 'PL'], sellingPoints: ['无频闪', '色温调节', '智能调光'], complianceRisk: '中' },
    { name: '厨房多功能切菜器', category: '居家用品', cost: 32, price: 12.99, profit: 40, profitMargin: 28, commissionRate: '2%', sites: ['PL', 'ES', 'DE', 'FR'], sellingPoints: ['10种功能', '安全设计', '易清洗'], complianceRisk: '低' },
  ];
  
  const filtered = site ? mockProducts.filter((p) => p.sites.includes(site)) : mockProducts;
  return filtered.slice(0, Math.min(count, filtered.length));
}

function analyzeTrends(ctx) {
  const { site, category } = ctx;
  
  const trends = HOT_CATEGORIES.map((cat) => {
    const siteMatch = !site || cat.sites.includes(site);
    const categoryMatch = !category || cat.name.includes(category);
    return {
      ...cat,
      matches: siteMatch && categoryMatch,
      trendScore: Math.floor(Math.random() * 40) + 60,
    };
  }).filter((t) => t.matches);
  
  return `## 📈 欧洲站点趋势分析\n\n**查询条件**：${site || '全部站点'} · ${category || '全品类'}\n\n### 热门类目排行：\n${trends.map((t, i) => `**${i + 1}. ${t.name}**\n• 热度评分：${t.trendScore}分\n• 适配站点：${t.sites.join('、')}\n• 佣金策略：${t.commission}\n• 利润率：${t.profitMargin}\n`).join('\n')}\n\n### 选品建议：\n• 优先关注热度评分80分以上的品类\n• 结合低佣站点红利最大化利润\n• 关注季节性需求变化`;
}

function analyzeCompetitor(ctx) {
  const { competitorShop } = ctx;
  
  const competitorAnalysis = {
    shop: competitorShop || '标杆店铺A',
    topProducts: [
      { name: '智能手表', gmv: '50万€/月', price: 89.99, reviewCount: 12000 },
      { name: '无线充电器', gmv: '30万€/月', price: 24.99, reviewCount: 8500 },
      { name: '手机壳套装', gmv: '25万€/月', price: 14.99, reviewCount: 15000 },
    ],
    strengths: ['供应链优势', '品牌认知度', '内容营销出色'],
    weaknesses: ['新品迭代慢', '客单价偏高', '客服响应慢'],
    opportunities: ['差异化定位', '细分品类切入', '本土达人合作'],
  };
  
  return `## 🔍 竞品分析报告\n\n**分析对象**：${competitorAnalysis.shop}\n\n### 爆款产品：\n${competitorAnalysis.topProducts.map((p) => `• **${p.name}**：月GMV ${p.gmv}，售价 €${p.price}，评价 ${p.reviewCount} 条\n`).join('')}\n\n### 竞品优势：\n${competitorAnalysis.strengths.map((s) => `• ${s}`).join('\n')}\n\n### 竞品劣势：\n${competitorAnalysis.weaknesses.map((w) => `• ${w}`).join('\n')}\n\n### 切入机会：\n${competitorAnalysis.opportunities.map((o) => `• ${o}`).join('\n')}`;
}

function calculateProfit(ctx) {
  const { cost, price, commissionRate, shipping } = ctx;
  
  if (!cost || !price) {
    return '❌ 请提供成本和售价进行利润核算。\n\n格式：profit_calc cost=100 price=49.99 commissionRate=2% shipping=15';
  }
  
  const commission = parseFloat(price) * (parseFloat(commissionRate) / 100);
  const shippingCost = parseFloat(shipping) || 15;
  const profit = parseFloat(price) * 7.8 - parseFloat(cost) - shippingCost - commission * 7.8;
  const profitMargin = ((profit / (parseFloat(cost) + shippingCost)) * 100).toFixed(1);
  
  return `## 💰 利润核算结果\n\n### 基础参数：\n• 采购成本：¥${cost}\n• 售价：€${price}（约¥${(parseFloat(price) * 7.8).toFixed(0)}）\n• 佣金率：${commissionRate}\n• 运费：¥${shippingCost}\n\n### 成本拆解：\n• 佣金成本：€${commission.toFixed(2)}（约¥${(commission * 7.8).toFixed(0)}）\n• 总可变成本：¥${(parseFloat(cost) + shippingCost + commission * 7.8).toFixed(0)}\n\n### 利润计算：\n• 单品净利润：¥${profit.toFixed(0)}\n• 净利润率：${profitMargin}%\n\n### 建议：\n${parseFloat(profitMargin) >= 10 ? '✅ 利润率达标，可进入测品阶段' : '⚠️ 利润率偏低，建议优化成本或调整售价'}`;
}
