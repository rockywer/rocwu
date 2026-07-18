// 技能：会员全生命周期智能管理
import { store } from '../store.js';
import { MEMBER_TIERS, JOIN_FLOW } from '../knowledge.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FORM_FILE = path.join(__dirname, '..', '..', 'data', 'member-apply-form.json');

function loadApplyForm() {
  try {
    return JSON.parse(fs.readFileSync(FORM_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

export const description = '会员全生命周期智能管理：入会申请审核、年费提醒、资质建档、权限激活、续费推送，并可返回正式入会申请表字段。';
export const trigger = '入会 / 申请 / 审核 / 激活 / 续费 / 申请表';
export const tools = ['member.query', 'member.activate', 'member.renew'];

function formatForm(form) {
  if (!form) return '⚠️ 入会申请表模板暂不可用。';
  const lines = [`📝 ${form.title}`, '请按以下维度准备材料，秘书处将一对一协助填写：', ''];
  for (const sec of form.sections) {
    lines.push(`【${sec.title}】`);
    for (const f of sec.fields) {
      const opt = f.options ? `（可多选：${f.options.join('、')}）` : '';
      const unit = f.unit ? `（${f.unit}）` : '';
      const ro = f.readonly ? '' : '：____';
      lines.push(`· ${f.label}${unit}${opt}${ro}`);
    }
    lines.push('');
  }
  lines.push('提交后 3 个工作日内专人对接审核；审核通过后签协议、缴会费、激活权益。');
  return lines.join('\n');
}

export function handler(ctx) {
  const { action, payload } = ctx;
  switch (action) {
    case 'form':
      return formatForm(loadApplyForm());

    case 'flow':
      return (
        '📋 入会全流程（六步）：\n' +
        JOIN_FLOW.map((s, i) => `${i + 1}. ${s}`).join('\n')
      );

    case 'apply': {
      let { name, tier, phone, company } = payload || {};
      // 从自然语言对话中尝试抽取（对话式入口）
      const q = (ctx.question || '') + ' ' + ((ctx.text || ''));
      if (!tier) {
        if (/svip|理事/.test(q)) tier = 'SVIP';
        else if (/vip|基础/.test(q)) tier = 'VIP';
      }
      if (!name) {
        const explicit = q.match(/姓名([\u4e00-\u9fa5]{2,4})/);
        if (explicit) name = explicit[1];
        else {
          const m = q.match(/([\u4e00-\u9fa5]{2,4})(?:，|,|。|\s|$)/);
          const bad = ['我要', '申请', '理事', '会员', '企业', '联系', '姓名'];
          if (m && !bad.includes(m[1])) name = m[1];
        }
      }
      if (!company) {
        const c = q.match(/企业([\u4e00-\u9fa5A-Za-z0-9]{2,12})/);
        if (c) company = c[1];
      }
      if (!name || !tier || !MEMBER_TIERS[tier]) {
        return '请提供：姓名、会员等级(VIP/SVIP)、联系方式、企业名称，以便提交入会申请。\n示例：「申请 VIP，姓名张三，企业某某科技」';
      }
      const created = store.addMember({
        name,
        tier,
        phone: phone || '待补',
        company: company || '待补',
        boards: [],
      });
      store.pushOp('joins', { memberId: created.id, tier, name, stage: 'submitted' });
      store.log('INFO', '入会申请提交', { id: created.id, tier });
      const tierInfo = MEMBER_TIERS[tier];
      return (
        `✅ 已收到【${name}】的${tierInfo.name}入会申请（编号 ${created.id}）。\n` +
        `年费标准：¥${tierInfo.fee}/年\n` +
        `审核机制：${tierInfo.review}\n` +
        (tier === 'SVIP'
          ? '⚠️ SVIP 需组委会定向邀约与终审，秘书处将专属对接。\n'
          : '秘书处将在 3 个工作日内完成初审。\n') +
        `下一步：提交身份证、营业执照、任职证明、企业简介、征信证明等材料。`
      );
    }

    case 'review': {
      let { id } = payload || {};
      if (!id) {
        const mm = (ctx.question || '').match(/M\d{4}/);
        if (mm) id = mm[0];
      }
      if (!id) {
        const nm = (ctx.question || '').match(/([\u4e00-\u9fa5]{2,4})/);
        if (nm) { const f = store.getMemberByName(nm[1]); if (f) id = f.id; }
      }
      const m = id ? store.getMember(id) : null;
      if (!m) return '未找到该会员申请，请提供会员编号或姓名。';
      const updated = store.updateMember(m.id, { status: 'reviewing' });
      store.pushOp('joins', { memberId: m.id, stage: 'reviewing' });
      return `🔍 已进入资质审核流程：\n申请人：${m.name}（${m.tier}）\n企业：${m.company}\n当前：材料核验中。`;
    }

    case 'activate': {
      let { id } = payload || {};
      if (!id) {
        const mm = (ctx.question || '').match(/M\d{4}/);
        if (mm) id = mm[0];
      }
      if (!id) {
        const nm = (ctx.question || '').match(/([\u4e00-\u9fa5]{2,4})/);
        if (nm) { const f = store.getMemberByName(nm[1]); if (f) id = f.id; }
      }
      const m = id ? store.getMember(id) : null;
      if (!m) return '未找到该会员，请提供会员编号或姓名。';
      const updated = store.updateMember(m.id, {
        status: 'active',
        activatedAt: new Date().toISOString(),
      });
      store.pushOp('joins', { memberId: m.id, stage: 'activated' });
      store.log('INFO', '会员资质激活', { id: m.id });
      return (
        `🎉 会员【${m.name}】资质已激活！\n` +
        `专属权限已开通，会员档案已建立。\n` +
        `凭证将发放，对应等级社群邀请已发送。\n` +
        `专属客服将讲解全板块权益与资源通道。`
      );
    }

    case 'renew': {
      let { id } = payload || {};
      if (!id) {
        const mm = (ctx.question || '').match(/M\d{4}/);
        if (mm) id = mm[0];
      }
      if (!id) {
        const nm = (ctx.question || '').match(/([\u4e00-\u9fa5]{2,4})/);
        if (nm) { const f = store.getMemberByName(nm[1]); if (f) id = f.id; }
      }
      const m = id ? store.getMember(id) : null;
      if (!m) return '未找到该会员，请提供会员编号或姓名。';
      const fee = MEMBER_TIERS[m.tier]?.fee || 0;
      store.pushOp('renewals', { memberId: m.id, fee });
      store.log('INFO', '续费提醒推送', { id: m.id });
      return (
        `🔔 续费提醒 · ${m.name}（${m.tier}）\n` +
        `应缴年费：¥${fee}/年\n` +
        `缴费通道：对公转账（秘书处提供账号）\n` +
        `协议：续签《会员服务协议》明确双方权责。\n` +
        `缴费后 1 个工作日内自动延续权限。`
      );
    }

    default:
      return (
        '🦞 会员管理技能就绪。支持指令：\n' +
        '· form — 查看入会申请表字段\n' +
        '· flow — 查看入会流程\n' +
        '· apply — 提交入会申请\n' +
        '· review — 资质审核\n' +
        '· activate — 激活资质\n' +
        '· renew — 续费提醒'
      );
  }
}
