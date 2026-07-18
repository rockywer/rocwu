// 板块技能：产业与资本研究院 + 家族传承
import { BOARDS } from '../knowledge.js';

export const description = '产业与资本研究院 + 家族传承与遗嘱保护中心：产融结合与财富保全。';
export const trigger = '资本 / 融资 / 上市 / 并购 / 传承 / 遗嘱 / 信托';
export const tools = ['board.capital'];

const capital = BOARDS.find((b) => b.id === 'capital');
const inheritance = BOARDS.find((b) => b.id === 'inheritance');

export function handler(ctx) {
  const { action, which = 'capital', tier = 'VIP' } = ctx;
  const b = which === 'inheritance' ? inheritance : capital;
  if (action === 'services') {
    return which === 'inheritance'
      ? '⚖️ 家族传承服务：家族宪章、股权传承、资产隔离、税务筹划、合法遗嘱订立与保管执行、接班人培养。'
      : '💹 产业与资本服务：产业研究/白皮书、融资对接、IPO 辅导、并购重组、政企对接、项目路演。';
  }
  const right = tier === 'SVIP' ? b.svip : b.vip;
  return `💼 ${b.name}\n定位：${b.position}\n您的权益（${tier}）：${right}`;
}
