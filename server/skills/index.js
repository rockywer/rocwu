import * as aiLeader from './ai-leader.js';
import * as aiCompliance from './ai-compliance.js';
import * as aiProduct from './ai-product.js';
import * as aiContent from './ai-content.js';
import * as aiAds from './ai-ads.js';
import * as aiShop from './ai-shop.js';
import * as aiData from './ai-data.js';
import * as aiExpand from './ai-expand.js';

export const SKILLS = {
  'ai.leader': aiLeader,
  'ai.compliance': aiCompliance,
  'ai.product': aiProduct,
  'ai.content': aiContent,
  'ai.ads': aiAds,
  'ai.shop': aiShop,
  'ai.data': aiData,
  'ai.expand': aiExpand,
};

export function runSkill(slug, ctx) {
  const skill = SKILLS[slug];
  if (!skill || !skill.handler) {
    return `⚠️ 技能 ${slug} 未注册或暂不可用。`;
  }
  try {
    return skill.handler(ctx || {});
  } catch (e) {
    return `⚠️ 技能执行异常：${e.message}`;
  }
}

export function listSkills() {
  return Object.entries(SKILLS).map(([slug, s]) => ({
    slug,
    description: s.description,
    trigger: s.trigger,
  }));
}
