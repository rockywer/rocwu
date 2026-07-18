// 技能：产业与资本研究院（详尽规划 + 年度活动安排）
// 数据源：data/institute-plan.json（由《浙商创新俱乐部・产业与资本研究院详细规划》结构化而来）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLAN_FILE = path.join(__dirname, '..', '..', 'data', 'institute-plan.json');

function loadPlan() {
  try {
    return JSON.parse(fs.readFileSync(PLAN_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

export const description = '产业与资本研究院：产融结合智库、资本对接平台、上市培育基地。覆盖定位使命、组织架构、五大业务板块、2026 全年活动安排、会员权益矩阵。';
export const trigger = '研究院 / 产业研究 / 研报 / 白皮书 / 产融沙龙 / 路演 / 峰会 / 上市培育 / 投融资 / 资本运作 / 私董会 / 年度活动';
export const tools = ['institute.plan', 'institute.calendar'];

function fmtList(arr, prefix = '· ') {
  return arr.map((x) => prefix + x).join('\n');
}

export function handler(ctx) {
  const plan = loadPlan();
  if (!plan) return '⚠️ 研究院规划数据暂不可用。';
  const { action = 'overview', tier = 'VIP', which = '' } = ctx;
  const q = (ctx.question || '') + ' ' + (ctx.text || '');

  // —— 总览：定位 + 使命 + 五大板块 ——
  if (action === 'overview' || !action) {
    const blocks = [
      `🏛️ ${plan.title}`,
      ``,
      `【核心定位】\n${plan.positioning}`,
      ``,
      `【核心使命】\n${fmtList(plan.mission)}`,
      ``,
      `【五大业务板块】`,
      ...plan.business.map((b, i) => `${i + 1}. ${b.name}`),
      ``,
      `【2026 年度活动速览】\n· 月度固定活动 12 场（产融沙龙 + 项目路演日）\n· 季度重磅峰会 4 场（开年峰会 / 北交所论坛 / 并购峰会 / 资本年会）\n· SVIP 专属高端活动（私董会 / 机构闭门 / 标杆参访 / 政企闭门）\n· 专项训练营（IPO 培育营 / 股权融资工作坊 / 并购实操班）`,
      ``,
      `可继续问我：「研究院有哪些业务板块」「2026 年度活动怎么安排」「会员权益对比」「研究院服务流程」`,
    ];
    return blocks.join('\n');
  }

  // —— 业务板块 ——
  if (action === 'business') {
    const lines = [`📚 产业与资本研究院 · 核心业务板块（5 大）`, ''];
    plan.business.forEach((b, i) => {
      lines.push(`${i + 1}. ${b.name}`);
      b.items.forEach((it) => lines.push(`   - ${it}`));
      lines.push('');
    });
    return lines.join('\n');
  }

  // —— 年度活动安排 ——
  if (action === 'calendar' || action === 'activities') {
    const c = plan.calendar;
    const lines = [`📅 产业与资本研究院 · 2026 全年活动安排`, ''];
    lines.push('【月度固定活动（12 场）】');
    c.monthly.forEach((m) => lines.push(`· ${m.name}（${m.time}）：${m.detail}`));
    lines.push('');
    lines.push('【季度重磅活动（4 场）】');
    c.quarterly.forEach((m) => lines.push(`· ${m.name}（${m.time}）：${m.detail}`));
    lines.push('');
    lines.push('【SVIP 专属高端活动】');
    c.svip.forEach((m) => lines.push(`· ${m.name}（${m.time}）：${m.detail}`));
    lines.push('');
    lines.push('【专项训练营 / 工作坊】');
    c.camps.forEach((m) => lines.push(`· ${m.name}（${m.time}）：${m.detail}`));
    return lines.join('\n');
  }

  // —— 会员权益矩阵 ——
  if (action === 'rights' || action === 'matrix') {
    const t = (tier || 'VIP').toUpperCase() === 'SVIP' ? 'SVIP' : 'VIP';
    const lines = [`🎫 研究院会员权益对比（${t} 视角）`, ''];
    lines.push('服务项目'.padEnd(14, '　') + 'VIP 基础'.padEnd(14, '　') + 'SVIP 理事');
    plan.membershipMatrix.forEach((r) => {
      lines.push(`${r.service}`.padEnd(14, '　') + `${r.VIP}`.padEnd(14, '　') + `${r.SVIP}`);
    });
    lines.push('');
    lines.push(t === 'SVIP'
      ? '您作为 SVIP 理事会员，享一对一资本诊断、头部机构直通、全流程上市/并购辅导、专属基金通道与闭门私董会。'
      : '升级 SVIP 理事会员可解锁一对一资本诊断、头部机构直通、全流程上市/ 并购辅导、专属基金通道等专属权益。');
    return lines.join('\n');
  }

  // —— 组织架构 ——
  if (action === 'org') {
    const o = plan.org;
    const lines = [`🏗️ 研究院组织架构与运营机制`, ''];
    lines.push('【组织架构成员】');
    o.structure.forEach((s) => lines.push(`· ${s.role}：${s.desc}`));
    lines.push('');
    lines.push('【会员分级服务】');
    o.tiers.forEach((t) => {
      lines.push(`· ${t.name}：${t.rights.join('、')}`);
    });
    lines.push('');
    lines.push('【运营原则】');
    lines.push(fmtList(o.principles));
    return lines.join('\n');
  }

  // —— 服务流程 ——
  if (action === 'process') {
    return `🔄 研究院服务流程（闭环）：\n` + plan.process.map((p, i) => `${i + 1}. ${p}`).join('\n');
  }

  // —— 实施计划 ——
  if (action === 'roadmap') {
    const r = plan.roadmap;
    return `🗺️ 研究院实施计划与保障：\n· ${r.prep}\n· ${r.run}\n· ${r.safeguard}`;
  }

  return `🏛️ 产业与资本研究院已就绪。可询问：\n` +
    `· overview — 研究院总览（定位/使命/板块）\n` +
    `· business — 五大业务板块详情\n` +
    `· calendar — 2026 全年活动安排\n` +
    `· rights — 会员权益对比（VIP/SVIP）\n` +
    `· org — 组织架构与分级服务\n` +
    `· process — 服务流程\n` +
    `· roadmap — 实施计划与保障`;
}
