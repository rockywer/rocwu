// 板块技能：科研院所协同创新中心
import { BOARDS } from '../knowledge.js';

export const description = '科研院所协同创新中心：搭建浙商企业与顶尖科研院所桥梁，构建“科学家+企业家”协同创新生态。';
export const trigger = '科研 / 中科院 / 浙大 / 成果 / 中试 / 联合实验室';
export const tools = ['board.research'];

const board = BOARDS.find((b) => b.id === 'research');

export function handler(ctx) {
  const { action, tier = 'VIP' } = ctx;
  if (action === 'services') {
    return (
      `🔬 科研协同服务：\n` +
      `· 高端科研资源对接（浙大/中科院/之江实验室）\n` +
      `· 科研成果转化落地（路演/中试/产业化）\n` +
      `· 联合科研攻关（校企联合实验室）\n` +
      `· 科创人才引育（定向引进/订单培养）\n` +
      `· 科研政策与项目申报辅导\n` +
      `· 科研仪器设备/数据/实验室资源共享`
    );
  }
  const right = tier === 'SVIP' ? board.svip : board.vip;
  return `🧪 ${board.name}\n定位：${board.position}\n您的权益（${tier}）：${right}`;
}
