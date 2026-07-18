// 板块技能：全板块通用详情（18 大核心板块）
// 按板块 id 渲染定位 / 核心服务 / 板块专属落地活动 / 会员权益
import { BOARDS } from '../knowledge.js';

export const description = '全板块通用详情：企业家学院、运动联赛、非遗、康养、国学、家族传承、产业与资本研究院、科研院所、农文旅、地方产业规划、专精特新培育、跨境出海、新生代、品牌IP、私行财富、低空经济、人工智能数字化赋能等 18 大板块的定位/服务/活动/权益。';
export const trigger = '板块 / 中心 / 研究院 / 学院 / 联赛 / 赋能 / 培育';
export const tools = ['board.detail'];

const byId = (id) => BOARDS.find((b) => b.id === id || b.slug === id || b.name === id);

export function handler(ctx) {
  const { action = 'info', which = '', boardId = '', tier = 'VIP' } = ctx;
  const id = which || boardId;

  if (action === 'list') {
    return (
      `🗂️ 俱乐部 18 大核心服务板块：\n` +
      BOARDS.map((b, i) => `${i + 1}. ${b.name}`).join('\n') +
      `\n\n每位会员须自主选定 1-2 个板块深度参与，板块内活动不得无故缺席。`
    );
  }

  const b = byId(id) || BOARDS.find((b) => (ctx.question || '').includes(b.name));
  if (!b) {
    return (
      `🗂️ 俱乐部 18 大核心服务板块：\n` +
      BOARDS.map((b, i) => `${i + 1}. ${b.name}`).join('\n') +
      `\n\n请告诉我您想了解哪个板块（如「人工智能数字化赋能中心有哪些活动」）。`
    );
  }

  if (action === 'services') {
    return `🔧【${b.name}】核心服务内容：\n` + b.services.map((s) => '· ' + s).join('\n');
  }
  if (action === 'activities') {
    return `📅【${b.name}】板块专属落地活动：\n` + b.activities.map((a) => '· ' + a).join('\n');
  }
  if (action === 'rights') {
    const right = tier === 'SVIP' ? b.svip : b.vip;
    return `🎫【${b.name}】· ${tier} 会员权益：\n${right}\n\n出勤要求：板块内活动不得无故缺席。`;
  }

  // info：定位 + 权益摘要
  const right = tier === 'SVIP' ? b.svip : b.vip;
  return (
    `🏛️ ${b.name}\n` +
    `定位：${b.position}\n\n` +
    `核心服务：\n` + b.services.map((s) => '· ' + s).join('\n') + `\n\n` +
    `专属落地活动：\n` + b.activities.map((a) => '· ' + a).join('\n') + `\n\n` +
    `您的权益（${tier}）：${right}\n` +
    `出勤要求：板块内活动不得无故缺席（选定 1-2 个板块深度参与）。`
  );
}
