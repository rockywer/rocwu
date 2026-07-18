// 板块技能：文化板块群（非遗 / 国学 / 大健康康养 / 农文旅）
import { BOARDS } from '../knowledge.js';

export const description = '文化板块群：非遗传承、国学论道、大健康康养、农文旅融合 — 文化修身与身心疗愈。';
export const trigger = '非遗 / 国学 / 康养 / 农文旅 / 禅修 / 中医';
export const tools = ['board.culture'];

const MAP = {
  intangible: BOARDS.find((b) => b.id === 'intangible'),
  guoxue: BOARDS.find((b) => b.id === 'guoxue'),
  health: BOARDS.find((b) => b.id === 'health'),
  agritourism: BOARDS.find((b) => b.id === 'agritourism'),
};

export function handler(ctx) {
  const { action, which = 'health', tier = 'VIP' } = ctx;
  const b = MAP[which] || MAP.health;
  if (action === 'list') {
    return '🏮 文化板块：\n' + Object.values(MAP).map((x) => '· ' + x.name).join('\n');
  }
  const right = tier === 'SVIP' ? b.svip : b.vip;
  return `🧘 ${b.name}\n定位：${b.position}\n您的权益（${tier}）：${right}`;
}
