// 板块技能：高端运动联赛（高尔夫 + 网球）
import { BOARDS } from '../knowledge.js';

export const description = '高端运动联赛：企业家高尔夫球联赛 + 精英网球联赛，赛事运营与权益调度。';
export const trigger = '高尔夫 / 网球 / 联赛 / 赛事';
export const tools = ['board.sports'];

const golf = BOARDS.find((b) => b.id === 'golf');
const tennis = BOARDS.find((b) => b.id === 'tennis');

export function handler(ctx) {
  const { action, sport = 'golf', tier = 'VIP' } = ctx;
  const b = sport === 'tennis' ? tennis : golf;
  if (action === 'schedule') {
    return sport === 'tennis'
      ? '🎾 网球联赛：全年 4 场季度分站赛 + 年度总决赛，周末友谊对抗常态化。分组：理事至尊组/企业精英组/特邀嘉宾组。'
      : '⛳ 高尔夫联赛：全年 6 场分站赛 + 1 场年度总决赛，月度友谊赛灵活加开。18 洞净杆积分制。';
  }
  const right = tier === 'SVIP' ? b.svip : b.vip;
  return `🏆 ${b.name}\n${b.position}\n您的权益（${tier}）：${right}`;
}
