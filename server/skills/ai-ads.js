import { AI_ROLES, INCENTIVE_PROGRAMS, COMMISSION_RATES, EU_SITES } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI投放运营专员 - 盈利提效岗，广告投放、预算管控、ROI优化、流量承接、活动落地';
export const trigger = ['投放', '广告', 'ROI', '预算', '活动', '大促'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'create_campaign':
      return createCampaign(ctx);
    case 'optimize_roi':
      return optimizeRoi(ctx);
    case 'check_bonus':
      return checkAdBonus(ctx);
    case 'promotion_plan':
      return generatePromotionPlan(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.ads;
  return `## 🚀 AI投放运营专员 · 盈利提效岗\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function createCampaign(ctx) {
  const { product, budget, targetSite, duration } = ctx;
  
  if (!product || !budget) {
    return '❌ 请提供商品名称和预算创建投放计划。\n\n格式：create_campaign product=智能保温杯 budget=1000 targetSite=DE duration=7';
  }
  
  const campaign = {
    id: 'ADS-' + Date.now(),
    product,
    budget: parseFloat(budget),
    targetSite: targetSite || 'DE',
    duration: parseInt(duration) || 7,
    status: 'active',
    roiTarget: 2.5,
    dailyBudget: parseFloat(budget) / (parseInt(duration) || 7),
  };
  
  store.addAdsRecord({
    campaign: campaign.id,
    product,
    budget: campaign.budget,
    targetSite: campaign.targetSite,
    status: 'active',
    createdAt: new Date().toISOString(),
  });
  
  return `## 🎯 投放计划已创建\n\n**商品**：${campaign.product}\n**预算**：¥${campaign.budget}\n**目标站点**：${campaign.targetSite}\n**投放周期**：${campaign.duration}天\n**日均预算**：¥${campaign.dailyBudget.toFixed(0)}\n**目标ROI**：${campaign.roiTarget}:1\n\n### 📊 投放策略：\n• 初始阶段：测试素材，优化人群定向\n• 中期阶段：放大优质素材，调整出价\n• 后期阶段：监控ROI，及时止损或扩量\n\n### 🎁 可用补贴：\n${INCENTIVE_PROGRAMS.filter((p) => p.id === 'ad-bonus').map((p) => `• **${p.name}**：${p.benefit}`).join('\n')}`;
}

function optimizeRoi(ctx) {
  const { campaignId, currentRoi, suggestions } = ctx;
  
  const optimization = {
    campaign: campaignId || 'ADS-001',
    currentRoi: currentRoi || 1.8,
    targetRoi: 2.5,
    gap: ((currentRoi || 1.8) - 2.5).toFixed(2),
    suggestions: suggestions || generateRoiSuggestions(currentRoi),
    expectedImprovement: '+39%',
  };
  
  return `## 📈 ROI优化建议\n\n**投放计划**：${optimization.campaign}\n**当前ROI**：${optimization.currentRoi}:1\n**目标ROI**：${optimization.targetRoi}:1\n**差距**：${optimization.gap}\n\n### 🔧 优化方案：\n${optimization.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n### 🎯 预期效果：\n• ROI提升至：${optimization.targetRoi}:1\n• 预计改善幅度：${optimization.expectedImprovement}\n• 建议观察周期：3-7天`;
}

function generateRoiSuggestions(currentRoi) {
  const roi = parseFloat(currentRoi) || 1.8;
  
  if (roi < 1.5) {
    return [
      '立即暂停低转化素材，保留Top 20%优质素材',
      '调整出价策略，降低CPC目标',
      '优化人群定向，缩小投放范围',
      '检查落地页转化路径，优化商品详情',
    ];
  } else if (roi < 2.0) {
    return [
      '筛选高ROI素材进行扩量',
      '测试新的人群包，寻找增量',
      '调整投放时段，聚焦高峰时段',
      '优化创意文案，提升点击率',
    ];
  } else {
    return [
      '保持当前投放策略，持续监控',
      '逐步增加预算，扩大投放规模',
      '测试新素材，保持素材多样性',
      '关注竞品动态，及时调整策略',
    ];
  }
}

function checkAdBonus(ctx) {
  const { shopId } = ctx;
  
  const bonusStatus = INCENTIVE_PROGRAMS.filter((p) => ['ad-bonus', 'new-seller', 'expansion'].includes(p.id)).map((p) => ({
    ...p,
    status: Math.random() > 0.3 ? 'available' : 'claimed',
    amount: p.id === 'ad-bonus' ? Math.floor(Math.random() * 500) + 500 : Math.floor(Math.random() * 300) + 200,
    deadline: '2026-08-31',
  }));
  
  return `## 🎁 广告金补贴查询\n\n**店铺**：${shopId || '当前店铺'}\n\n### 可用补贴：\n${bonusStatus.map((b) => {
    const status = b.status === 'available' ? '✅ 可申领' : '✅ 已领取';
    return `**${b.name}**\n• 状态：${status}\n• 金额：¥${b.amount}\n• 说明：${b.description}\n• 截止日期：${b.deadline}\n`;
  }).join('\n')}\n\n### 💡 申领建议：\n• 优先申领即将到期的补贴\n• 结合店铺阶段选择合适补贴\n• 确保满足补贴领取条件`;
}

function generatePromotionPlan(ctx) {
  const { promotionType, products, budget } = ctx;
  
  const promotions = {
    'new-seller': {
      name: '新商家成长计划',
      duration: '15天',
      tasks: [
        '完成5品上架',
        '完成新手任务',
        '激活低佣政策',
        '申领广告金',
      ],
      benefits: ['佣金减免至2%', '¥500广告金', '流量扶持'],
    },
    'expansion': {
      name: '扩店激励计划',
      duration: '30天',
      tasks: [
        '入驻3个EU8站点',
        '每个站点上架3款商品',
        '完成基础运营任务',
      ],
      benefits: ['额外¥1000广告金', '专属运营指导', '低佣政策延续'],
    },
    'promotion': {
      name: '大促预热计划',
      duration: '7天',
      tasks: [
        '预热素材准备',
        '优惠券设置',
        '达人种草',
        '投放预算加倍',
      ],
      benefits: ['平台流量加权', '大促专属标识', '额外曝光'],
    },
  };
  
  const plan = promotions[promotionType] || promotions['new-seller'];
  
  return `## 🎉 ${plan.name}\n\n**周期**：${plan.duration}\n\n### 📋 任务清单：\n${plan.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n### 🎁 预期权益：\n${plan.benefits.map((b) => `• ${b}`).join('\n')}\n\n### 📊 预算建议：\n• 总预算：¥${budget || 2000}\n• 投放占比：60%\n• 内容占比：25%\n• 其他占比：15%\n\n### ⚡ 执行建议：\n• 提前准备素材，避免临时突击\n• 关注任务进度，及时调整策略\n• 数据每日复盘，优化执行效果`;
}
