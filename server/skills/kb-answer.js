// 技能：运营方案知识库答疑
import { CLUB, MEMBER_TIERS, BOARDS, JOIN_FLOW, RIGHTS_OVERVIEW, AGENT_CAPABILITIES } from '../knowledge.js';

export const description = '运营方案知识库答疑：7x24 解答权益、活动、入会、政策等问题。';
export const trigger = '是什么 / 怎么办 / 权益 / 介绍 / 问答';
export const tools = ['kb.answer'];

const FAQ = [
  { kw: ['定位', '简介', '是什么', '理念'], ans: () => `🏛️ ${CLUB.name}\n${CLUB.slogan}\n定位：${CLUB.positioning}` },
  { kw: ['vip', '基础会员', '19999'], ans: () => tierText('VIP') },
  { kw: ['svip', '理事', '39999'], ans: () => tierText('SVIP') },
  { kw: ['入会', '加入', '申请', '流程'], ans: () => '📋 入会六步：\n' + JOIN_FLOW.map((s, i) => `${i + 1}. ${s}`).join('\n') },
  { kw: ['板块', '服务', '有哪些'], ans: () => '🗂️ 11 大板块：\n' + BOARDS.map((b) => '· ' + b.name).join('\n') },
  { kw: ['权益', '区别', '总览'], ans: () => '🎫 权益总览：\nVIP：\n' + RIGHTS_OVERVIEW.VIP.map((r) => '  · ' + r).join('\n') + '\nSVIP：\n' + RIGHTS_OVERVIEW.SVIP.map((r) => '  · ' + r).join('\n') },
  { kw: ['龙虾', '智能体', 'ai', '能力'], ans: () => '🦞 龙虾智能体六大能力：\n' + AGENT_CAPABILITIES.map((c) => '· ' + c).join('\n') },
  { kw: ['请假', '缺席', '出勤'], ans: () => '⚠️ 会员须自主选定 1-2 个板块深度参与，板块内活动无特殊紧急情况不得无故缺席，积极维护圈层氛围。' },
  { kw: ['隐私', '安全', '保密'], ans: () => '🔒 俱乐部严格保护会员隐私与商业信息，打造安全、纯粹的高端精英圈层；龙虾对会员数据加密存储、全程留痕可追溯。' },
];

function tierText(t) {
  const t0 = MEMBER_TIERS[t];
  return `💎 ${t0.name}\n年费：¥${t0.fee}/年\n准入：${t0.audience}\n审核：${t0.review}`;
}

export function handler(ctx) {
  const { question } = ctx;
  const q = (question || '').toLowerCase();
  if (!q) return '请描述您想了解的问题（如：VIP 会员权益、如何入会、有哪些板块）。';
  for (const item of FAQ) {
    if (item.kw.some((k) => q.includes(k.toLowerCase()))) {
      return item.ans();
    }
  }
  return (
    '🦞 我已记录您的问题，正在为您检索。可尝试问：\n' +
    '· 俱乐部定位是什么？\n· VIP / SVIP 会员区别？\n· 如何入会？\n· 有哪些服务板块？\n· 龙虾智能体有什么能力？'
  );
}
