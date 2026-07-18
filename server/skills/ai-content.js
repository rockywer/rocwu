import { AI_ROLES, REGION_STYLES, HOT_CATEGORIES } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI内容达人专员 - 种草转化岗，本土化内容创作、达人匹配、素材迭代、种草引流';
export const trigger = ['内容', '短视频', '直播', '达人', '脚本', '文案'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'generate_script':
      return generateVideoScript(ctx);
    case 'generate_copy':
      return generateProductCopy(ctx);
    case 'match_influencer':
      return matchInfluencers(ctx);
    case 'sample_plan':
      return generateSamplePlan(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.content;
  return `## 🎬 AI内容达人专员 · 种草转化岗\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function generateVideoScript(ctx) {
  const { product, region, style } = ctx;
  
  if (!product) return '❌ 请提供商品名称生成脚本。';
  
  const regionInfo = REGION_STYLES[region] || REGION_STYLES.DE;
  const script = generateRegionScript(product, regionInfo, style);
  
  store.addTask({
    role: 'content',
    action: '生成视频脚本',
    description: `${product} - ${regionInfo.name}${style || regionInfo.style}风格`,
    status: 'completed',
  }, 'daily');
  
  return script;
}

function generateRegionScript(product, region, style) {
  const templates = {
    '硬核测评': {
      intro: '大家好，今天给大家带来一款非常实用的产品测评。',
      hook: `这款${product}到底怎么样？值不值得买？看完你就知道了！`,
      body: '首先我们来看它的核心功能...\n然后测试一下实际使用效果...\n最后总结一下优缺点...',
      cta: '如果你也觉得这款产品不错，点击下方链接购买吧！',
      keywords: region.keywords,
    },
    '质感氛围感': {
      intro: 'Bonjour！今天给大家分享一款我最近发现的宝藏单品。',
      hook: `这款${product}真的太美了，用了之后整个人的气质都提升了！`,
      body: '让我来展示一下它的设计细节...\n在日常生活中是这样使用的...\n搭配起来真的很有感觉...',
      cta: '喜欢的话不要犹豫，赶紧入手吧！',
      keywords: region.keywords,
    },
    '生活化场景': {
      intro: '¡Hola! 今天来跟大家分享一个超实用的居家好物。',
      hook: `有了这款${product}，我的生活变得太方便了！`,
      body: '平时我是这样使用的...\n家人也很喜欢用...\n真的是居家必备...',
      cta: '想要提升生活品质的朋友们，赶紧下单吧！',
      keywords: region.keywords,
    },
    '性价比种草': {
      intro: '大家好！今天给大家推荐一款性价比超高的产品。',
      hook: `这款${product}价格亲民但品质一流，太划算了！`,
      body: '看看它的做工...\n对比一下价格...\n真的物超所值...',
      cta: '这么便宜又好用的产品，赶紧抢购吧！',
      keywords: region.keywords,
    },
    '简约实用': {
      intro: 'Hi everyone! Today I want to share a great product with you.',
      hook: `This ${product} is simple but incredibly useful!`,
      body: 'Let me show you how it works...\nIt fits perfectly in any home...\nQuality you can trust...',
      cta: 'Click the link below to get yours today!',
      keywords: region.keywords,
    },
    '时尚设计': {
      intro: 'Ciao! Oggi voglio condividere con voi un prodotto fantastico.',
      hook: `Questo ${product} è incredibilmente elegante!`,
      body: 'Guarda il design...\nCome si abbina...\nStile italiano...',
      cta: 'Acquista subito e fai un upgrade al tuo stile!',
      keywords: region.keywords,
    },
  };
  
  const template = templates[style] || templates[region.style];
  
  return `## 📝 ${region.name} · ${style || region.style}风格脚本\n\n**商品**：${product}\n\n### 🎬 脚本内容：\n\n**【开场】**\n${template.intro}\n\n**【钩子】**\n${template.hook}\n\n**【主体】**\n${template.body}\n\n**【结尾】**\n${template.cta}\n\n### ✨ 关键词建议：\n${template.keywords.map((k) => `• ${k}`).join('\n')}\n\n### 🎥 拍摄建议：\n• 时长：15-30秒\n• 场景：${region.style === '质感氛围感' ? '室内精致场景' : '日常生活场景'}\n• 节奏：${region.style === '硬核测评' ? '紧凑专业' : '轻松自然'}`;
}

function generateProductCopy(ctx) {
  const { product, category, region } = ctx;
  
  if (!product) return '❌ 请提供商品名称生成文案。';
  
  const regionInfo = REGION_STYLES[region] || REGION_STYLES.DE;
  const copy = generateRegionCopy(product, category, regionInfo);
  
  return copy;
}

function generateRegionCopy(product, category, region) {
  const copyTemplates = {
    '居家用品': {
      title: `【${region.name}热销】${product} 品质生活必备`,
      description: `来自${region.name}的品质之选！${product}采用优质材料制作，${region.keywords[0]}、${region.keywords[1]}，让您的居家生活更加舒适便捷。`,
      bulletPoints: ['优质材质，耐用可靠', '人性化设计，使用方便', '品质保证，售后无忧'],
    },
    '个护美妆': {
      title: `【${region.name}爆款】${product} 焕发自然光彩`,
      description: `${region.name}热销美妆好物！${product}专为亚洲肤质设计，${region.keywords[0]}配方，${region.keywords[1]}效果，让您绽放迷人光彩。`,
      bulletPoints: ['天然成分，温和不刺激', '专业配方，效果显著', '精致包装，送礼首选'],
    },
    '3C数码': {
      title: `【${region.name}精选】${product} 科技改变生活`,
      description: `${region.name}数码爱好者首选！${product}搭载最新技术，${region.keywords[0]}性能，${region.keywords[1]}体验，为您的生活增添科技感。`,
      bulletPoints: ['强劲性能，流畅体验', '时尚设计，质感出众', '超长续航，使用无忧'],
    },
  };
  
  const template = copyTemplates[category] || copyTemplates['居家用品'];
  
  return `## 📄 ${region.name}商品文案\n\n**商品**：${product}\n\n### 📝 标题：\n${template.title}\n\n### 📖 详情描述：\n${template.description}\n\n### ✅ 卖点清单：\n${template.bulletPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n### 🔑 SEO关键词：\n${region.keywords.map((k) => `• ${k} ${product}`).join('\n')}`;
}

function matchInfluencers(ctx) {
  const { category, region, budget } = ctx;
  
  const influencers = generateMockInfluencers(category, region);
  
  return `## 👥 达人匹配推荐\n\n**品类**：${category || '全品类'}\n**区域**：${region || '全区域'}\n**预算**：${budget || '未指定'}\n\n### 推荐达人：\n${influencers.map((inf, i) => `**${i + 1}. ${inf.name}**\n• 粉丝量：${inf.followers}\n• 领域：${inf.niche}\n• 风格：${inf.style}\n• 报价：€${inf.rate}/条\n• 平均互动率：${inf.engagementRate}%\n• 推荐理由：${inf.reason}\n`).join('\n')}\n\n### 📋 寄样建议：\n• 优先选择互动率高的达人\n• 提供完整产品资料包\n• 制定寄样激励方案`;
}

function generateMockInfluencers(category, region) {
  const regionInfo = REGION_STYLES[region] || REGION_STYLES.DE;
  
  return [
    { name: `Lisa_${regionInfo.name}`, followers: '50万', niche: category || '生活方式', style: regionInfo.style, rate: 500, engagementRate: 8.5, reason: '本土达人，粉丝粘性高' },
    { name: `TechPro_${regionInfo.name}`, followers: '30万', niche: '科技数码', style: '专业测评', rate: 350, engagementRate: 12.3, reason: '垂直领域精准' },
    { name: `BeautyGuru_${regionInfo.name}`, followers: '80万', niche: '美妆护肤', style: '教程分享', rate: 800, engagementRate: 6.2, reason: '影响力大，曝光强' },
    { name: `HomeStyle_${regionInfo.name}`, followers: '40万', niche: '家居生活', style: '日常分享', rate: 400, engagementRate: 10.1, reason: '内容真实，转化率高' },
  ];
}

function generateSamplePlan(ctx) {
  const { product, influencers } = ctx;
  
  const plan = {
    product: product || '智能保温杯',
    targetInfluencers: influencers || 3,
    timeline: [
      { day: 1, action: '筛选达人并发送邀请' },
      { day: 3, action: '确认寄样地址' },
      { day: 5, action: '寄出样品' },
      { day: 10, action: '追踪达人发布进度' },
      { day: 15, action: '收集数据并复盘' },
    ],
    budget: {
      sampleCost: 200,
      shipping: 150,
      incentive: 300,
      total: 650,
    },
  };
  
  return `## 📦 寄样计划\n\n**商品**：${plan.product}\n**目标达人**：${plan.targetInfluencers}位\n\n### 📅 时间安排：\n${plan.timeline.map((t) => `• Day${t.day}：${t.action}`).join('\n')}\n\n### 💰 预算预估：\n• 样品成本：¥${plan.budget.sampleCost}\n• 国际运费：¥${plan.budget.shipping}\n• 寄样激励：¥${plan.budget.incentive}\n• **总计：¥${plan.budget.total}**\n\n### 🎯 预期效果：\n• 预计曝光量：50万-100万\n• 预计转化率：3-5%\n• 平台寄样激励返还：最高¥200`;
}
