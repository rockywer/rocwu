// 技能：运营数据智能复盘
import { store } from '../store.js';

export const description = '运营数据智能复盘：统计活动参与、会员活跃度、服务满意度、资源对接成效，生成运营报告。';
export const trigger = '复盘 / 报告 / 统计 / 数据';
export const tools = ['report.daily'];

export function handler(ctx) {
  const { action } = ctx;
  const ops = store.getOps();
  const members = store.listMembers();
  const active = members.filter((m) => m.status === 'active').length;
  const pending = members.filter((m) => m.status === 'pending' || m.status === 'reviewing').length;

  const report =
    `📊 浙商创新俱乐部 · 运营复盘报告\n` +
    `生成时间：${new Date().toLocaleString('zh-CN')}\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `👥 会员总数：${members.length}（已激活 ${active} / 审核中 ${pending}）\n` +
    `📝 入会流程事件：${ops.joins.length} 笔\n` +
    `🔄 续费提醒：${ops.renewals.length} 次\n` +
    `🔗 资源对接：${ops.matches.length} 次\n` +
    `🎯 板块活动报名：${ops.activities.length} 次\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `建议：对「审核中」会员加快终审；对近 30 天无活跃会员推送专属权益提醒。`;

  if (action === 'save') {
    store.log('INFO', '运营复盘已生成', { members: members.length, matches: ops.matches.length });
  }
  return report;
}
