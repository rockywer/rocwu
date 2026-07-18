// 板块技能：地方产业规划中心
import { BOARDS } from '../knowledge.js';

export const description = '地方产业规划中心：为政府/园区提供“规划+资本+招商+运营”一体化解决方案，助力浙商返乡投资。';
export const trigger = '产业规划 / 招商 / 园区 / 飞地 / 返乡投资';
export const tools = ['board.localplan'];

const board = BOARDS.find((b) => b.id === 'localplan');

export function handler(ctx) {
  const { action, tier = 'VIP' } = ctx;
  if (action === 'services') {
    return (
      `🏙️ 地方产业规划服务：\n` +
      `· 区域产业诊断、定位规划、产业链图谱设计\n` +
      `· 产业基金搭建、精准招商、项目落地全流程\n` +
      `· 园区规划、政策定制、产城融合、飞地经济合作`
    );
  }
  const right = tier === 'SVIP' ? board.svip : board.vip;
  return `🏗️ ${board.name}\n定位：${board.position}\n您的权益（${tier}）：${right}`;
}
