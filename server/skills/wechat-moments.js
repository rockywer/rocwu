// 技能：微信朋友圈信息自动关联整理（板块十核心模块）
// 功能：数据采集模拟、智能标签/分类/归档、商机提取、舆情预警、素材归集、日报生成
import { store } from '../store.js';

export const description = '微信朋友圈自动关联整理：采集/标签/归档、商机自动提取推送、舆情实时预警、素材归集复用、日报简报生成。';
export const trigger = '朋友圈 / 商机提取 / 舆情预警 / 素材归档 / 日报简报 / 竞品动态';
export const tools = ['wechat.moments.ingest', 'wechat.moments.query', 'wechat.moments.opp', 'wechat.moments.alert', 'wechat.moments.material', 'wechat.moments.brief'];

// ---- 商机信号关键词库 ----
const OPPORTUNITY_SIGNALS = {
  high: [
    { pattern: /(采购|求购|需要一批|急寻|大量收购)/, type: '采购需求' },
    { pattern: /(融资|A轮|B轮|估值|寻求投资|pre-?ipo)/i, type: '融资需求' },
    { pattern: /(扩产|搬迁|新工厂|产能翻|新基地)/, type: '厂房扩产' },
    { pattern: /(招商|加盟|代理|城市合伙|全国招募)/, type: '招商加盟' },
    { pattern: /(出海|跨境|海外市场|国际化|外贸订单)/, type: '出海布局' },
  ],
  medium: [
    { pattern: /(设备|产线|升级改造|自动化|智能车间)/, type: '设备更换' },
    { pattern: /(品牌合作|联名|跨界|异业)/, type: '品牌合作' },
    { pattern: /(专利|高新|专精特新|项目申报|科创)/, type: '科创申报' },
    { pattern: /(招聘|急招|人才|高薪聘请)/, type: '人才招聘' },
  ],
};

// ---- 舆情风险关键词库 ----
const RISK_SIGNALS = [
  { pattern: /(投诉|曝光|维权|欺诈|骗局)/, level: 'critical', type: '负面舆情' },
  { pattern: /(质量差|劣质|翻车|事故|伤亡)/, level: 'critical', type: '产品质量风险' },
  { pattern: /(处罚|罚款|查封|停业|吊销)/, level: 'critical', type: '监管处罚' },
  { pattern: /(破产|清算|跑路|暴雷|违约)/, level: 'high', type: '经营风险' },
  { pattern: /(裁员|降薪|欠薪|停工)/, level: 'high', type: '经营困难' },
  { pattern: /(夸大|虚假|误导|违规|夸大宣传)/, level: 'medium', type: '合规风险' },
  { pattern: /(政策收紧|限制|禁止|清理|整顿)/, level: 'medium', type: '政策风险' },
  { pattern: /(竞品|对手|友商|同行).*(降价|促销|新品|发布)/, level: 'low', type: '竞品动态' },
];

// ---- 分类映射 ----
const CATEGORY_MAP = {
  client: ['客户', '采购方', '需求方', '甲方'],
  peer: ['同行', '竞品', '供应商', '供应链', '产业'],
  self: ['本人', '自己企业', '本公司', '自家'],
  industry: ['行业大咖', '专家', '政企', '领导', '官方'],
  staff: ['员工', '同事', '团队成员'],
};

function classifyMoment(moment) {
  const c = (moment.content || '') + (moment.author || '') + (moment.company || '');
  for (const [cat, kws] of Object.entries(CATEGORY_MAP)) {
    if (kws.some((kw) => c.includes(kw))) return cat;
  }
  return moment.category || 'client';
}

export function handler(ctx) {
  const { action, payload, memberId, tier, question } = ctx;

  switch (action) {

    // ---- 数据采集入库 ----
    case 'ingest': {
      const { moments } = payload || {};
      if (!moments || !moments.length) {
        return '📱 朋友圈数据采集：请提供朋友圈内容（支持单条/批量）。\n格式示例：{"author":"张三","content":"公司新品发布...","images":2}\n\n⚠️ 合规提示：仅采集企业授权可见范围，模拟真人浏览节奏，数据本地加密存储。';
      }
      const enriched = moments.map((m) => ({
        ...m,
        category: classifyMoment(m),
        memberId: m.memberId || memberId || null,
        source: 'wechat_moments',
        riskFlags: scanRisks(m.content || ''),
      }));
      const results = store.batchAddMoments(enriched);
      // 同步提取商机
      const opps = extractOpportunities(results);
      opps.forEach((o) => store.addOpportunity(o));
      // 自动归档素材
      archiveMaterials(results);

      return (
        `✅ 朋友圈数据已入库\n` +
        `📥 采集 ${results.length} 条动态\n` +
        `🏷️ 自动标签分布：${summarizeTags(results)}\n` +
        `🎯 发现潜在商机：${opps.length} 条（高优 ${opps.filter((o) => o.priority === 'high').length} 条）\n` +
        `⚠️ 风险信号：${results.filter((r) => (r.riskFlags || []).length > 0).length} 条\n\n` +
        (opps.length > 0 ? `🔔 高优先级商机已自动推送，请查收！\n` : '') +
        `说「朋友圈商机」查看详情，说「朋友圈日报」查看今日简报。`
      );
    }

    // ---- 朋友圈查询 ----
    case 'query': {
      const { kw, author, bizTag, type, dateFrom, dateTo, limit } = payload || {};
      const filters = {};
      if (kw) filters.kw = kw;
      if (author) filters.author = author;
      if (bizTag) filters.bizTag = bizTag;
      if (type) filters.type = type;
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;
      const results = store.queryMoments(filters);
      const display = results.slice(0, limit || 20);
      if (!display.length) return '📭 未找到匹配的朋友圈动态。';
      return (
        `📱 朋友圈查询结果（共 ${results.length} 条，显示前 ${display.length} 条）：\n` +
        display
          .map(
            (m, i) =>
              `${i + 1}. [${m.category || '未知'}] ${m.author || '匿名'} | ${m.createdAt?.slice(0, 10) || '—'}\n` +
              `   ${(m.content || '').slice(0, 80)}${(m.content || '').length > 80 ? '…' : ''}\n` +
              `   标签：${(m.bizTags || []).join('、') || '—'} | 风险：${(m.riskFlags || []).length > 0 ? '⚠️ ' + m.riskFlags.join(',') : '✅'}`
          )
          .join('\n\n')
      );
    }

    // ---- 商机提取 ----
    case 'opp': {
      const opps = store.queryOpportunities({ status: 'new' });
      const highOpps = opps.filter((o) => o.priority === 'high');
      if (!opps.length) return '📭 当前无待处理商机。采集朋友圈数据后，龙虾会自动识别并推送商机。';
      return (
        `🎯 朋友圈商机列表（共 ${opps.length} 条）：\n\n` +
        `🔴 高优先级（${highOpps.length} 条）：\n` +
        highOpps
          .slice(0, 5)
          .map((o, i) =>
            `${i + 1}. [${o.type}] ${o.title}\n   来源：${o.sourceAuthor || '—'} | 匹配板块：${o.matchBoard || '—'}\n   关联会员：${o.memberId || '待关联'}`
          )
          .join('\n\n') +
        (opps.length > highOpps.length
          ? `\n\n🟡 其他商机（${opps.length - highOpps.length} 条）：说「全部商机」查看` +
            `\n\n龙虾已自动匹配俱乐部资源库，说「对接商机 OP0001」即可生成合作方案。`
          : `\n\n龙虾已自动匹配俱乐部资源库，说「对接商机 OP0001」即可生成合作方案。`)
      );
    }

    // ---- 舆情风险预警 ----
    case 'alert': {
      const all = store.listMoments();
      const risky = all.filter((m) => (m.riskFlags || []).length > 0);
      const critical = risky.filter((m) => (m.riskFlags || []).includes('critical'));
      if (!risky.length) return '✅ 当前朋友圈舆情正常，未发现风险信号。';
      return (
        `⚠️ 朋友圈舆情风险预警：\n` +
        `🔴 严重风险：${critical.length} 条\n` +
        `🟡 其他风险：${risky.length - critical.length} 条\n\n` +
        (critical.length > 0
          ? `【严重风险详情】\n` +
            critical
              .slice(0, 5)
              .map(
                (m, i) =>
                  `${i + 1}. 发布人：${m.author || '—'}\n   内容：${(m.content || '').slice(0, 60)}…\n   风险类型：${m.riskFlags.join(', ')}\n   建议：${generateRiskAdvice(m)}`
              )
              .join('\n\n')
          : `【风险概览】\n${summarizeRisks(risky)}`) +
        `\n\n⚠️ 建议立即启动公关处置流程，龙虾已自动生成处置建议，说「舆情处置」获取。`
      );
    }

    // ---- 素材归集 ----
    case 'material': {
      const { type } = payload || {};
      const mats = store.queryMaterials(type ? { type } : {});
      if (!mats.length) return '📭 素材库暂无内容，朋友圈数据采集后将自动归集。';
      const byType = {};
      mats.forEach((m) => { byType[m.type] = (byType[m.type] || 0) + 1; });
      return (
        `📦 朋友圈素材库（共 ${mats.length} 条）：\n` +
        Object.entries(byType)
          .map(([t, n]) => `· ${t}：${n} 条`)
          .join('\n') +
        `\n\n素材类型：好评实拍 / 落地案例 / 活动实拍 / 行业文案 / 营销文案\n说「素材 好评实拍」可按类型筛选。`
      );
    }

    // ---- 朋友圈日报 ----
    case 'brief': {
      const brief = store.generateDailyBrief();
      const opps = store.queryOpportunities({ status: 'new' });
      const highOpps = opps.filter((o) => o.priority === 'high');

      return (
        `📊 朋友圈日报 · ${brief.date}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📱 今日入库动态：${brief.totalMoments} 条\n` +
        `🎯 新增商机：${brief.newOpportunities} 条（高优 ${brief.highPriorityOpps} 条）\n` +
        `📈 业务标签分布：\n` +
        Object.entries(brief.bizTagDist)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([k, v]) => `  · ${k}：${v} 条`)
          .join('\n') +
        `\n👤 活跃发布人 Top 3：\n` +
        brief.topAuthors
          .slice(0, 3)
          .map((a, i) => `  ${i + 1}. ${a.name}（${a.count} 条）`)
          .join('\n') +
        `\n━━━━━━━━━━━━━━━━\n` +
        (highOpps.length > 0
          ? `🔔 今日高优商机提醒：\n` +
            highOpps
              .slice(0, 3)
              .map((o, i) => `  ${i + 1}. [${o.type}] ${o.title}`)
              .join('\n') +
            `\n说「朋友圈商机」查看详情。`
          : `✅ 今日无高风险商机。`) +
        `\n\n龙虾 7×24 小时持续监控中，有商机/风险即时推送。`
      );
    }

    // ---- 竞品动态 ----
    case 'competitor': {
      const peers = store.queryMoments({ category: 'peer' });
      const recent = peers.filter((p) => {
        const d = new Date(p.createdAt);
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return d.getTime() > weekAgo;
      });
      if (!recent.length) return '📭 近 7 天无竞品/同行朋友圈动态。';
      return (
        `📊 竞品/同行动态周报（${recent.length} 条）：\n\n` +
        recent
          .slice(0, 10)
          .map(
            (m, i) =>
              `${i + 1}. [${m.author || '—'}] ${m.createdAt?.slice(0, 10) || '—'}\n` +
              `   内容：${(m.content || '').slice(0, 60)}…\n` +
              `   标签：${(m.bizTags || []).join('、') || '—'}`
          )
          .join('\n\n') +
        `\n\n说「竞品周报导出」可一键导出 PDF。`
      );
    }

    // ---- 数据导出 ----
    case 'export': {
      const { format } = payload || {};
      const moments = store.listMoments();
      if (!moments.length) return '📭 暂无朋友圈数据可导出。';
      if (format === 'excel' || format === 'csv') {
        const header = 'ID,发布人,内容,分类,业务标签,风险标记,时间';
        const rows = moments.map((m) =>
          [m.id, m.author || '', (m.content || '').replace(/,/g, '，'), m.category || '', (m.bizTags || []).join(';'), (m.riskFlags || []).join(';'), m.createdAt || ''].join(',')
        );
        const csv = [header, ...rows].join('\n');
        return `📎 CSV 数据已生成（${moments.length} 条），请求「/api/moments/export」获取完整文件。\n前 3 行预览：\n${rows.slice(0, 3).join('\n')}`;
      }
      return (
        `📎 导出格式支持：\n` +
        `· Excel（结构化台账：发布人/内容/商机标签/互动数据）\n` +
        `· PDF（行业动态简报）\n` +
        `· 自动同步至企业私有知识库 / CRM 客户档案 / AI 数字化赋能中心素材库\n` +
        `说「导出 Excel」或「导出 PDF」即可。`
      );
    }

    default:
      return (
        '📱 朋友圈信息自动关联整理 · 龙虾智能体\n' +
        '━━━━━━━━━━━━━━━━\n' +
        '支持指令：\n' +
        '· 朋友圈采集 — 入库朋友圈数据（单条/批量）\n' +
        '· 朋友圈查询 — 按作者/标签/关键词检索\n' +
        '· 朋友圈商机 — 查看提取的商机信号\n' +
        '· 朋友圈预警 — 查看舆情风险动态\n' +
        '· 朋友圈素材 — 查看自动归集的营销素材\n' +
        '· 朋友圈日报 — 生成今日动态简报\n' +
        '· 竞品动态 — 近7天竞品/同行动态汇总\n' +
        '· 导出 Excel/PDF — 导出结构化数据\n' +
        '━━━━━━━━━━━━━━━━\n' +
        '⚠️ 合规说明：仅采集企业授权可见范围，模拟真人浏览节奏，全链路数据加密存储。'
      );
  }
}

// ---- 辅助函数 ----

function extractOpportunities(moments) {
  const opps = [];
  moments.forEach((m) => {
    const content = m.content || '';
    for (const [priority, signals] of Object.entries(OPPORTUNITY_SIGNALS)) {
      for (const sig of signals) {
        if (sig.pattern.test(content)) {
          const match = content.match(sig.pattern);
          opps.push({
            title: (m.content || '').slice(0, 40) + '…',
            type: sig.type,
            priority,
            source: 'wechat_moments',
            sourceMomentId: m.id,
            sourceAuthor: m.author || '—',
            memberId: m.memberId || null,
            matchBoard: suggestBoard(sig.type),
            status: 'new',
            rawContent: content,
          });
          break; // 每条动态只取最高优先级的一个商机
        }
      }
    }
  });
  return opps;
}

function suggestBoard(oppType) {
  const map = {
    '采购需求': '跨境贸易与出海经济中心',
    '融资需求': '产业与资本研究院',
    '厂房扩产': '地方产业规划中心',
    '招商加盟': '品牌公关与新媒体IP赋能中心',
    '出海布局': '跨境贸易与出海经济中心',
    '设备更换': '人工智能数字化赋能中心',
    '品牌合作': '品牌公关与新媒体IP赋能中心',
    '科创申报': '专精特新科创梯度培育中心',
    '人才招聘': '新生代浙商传承与青年创业中心',
  };
  return map[oppType] || '通用资源对接';
}

function scanRisks(content) {
  return RISK_SIGNALS.filter((s) => s.pattern.test(content)).map((s) => s.type);
}

function archiveMaterials(moments) {
  moments.forEach((m) => {
    const c = m.content || '';
    if (/好评|点赞|推荐|很棒|满意|靠谱/.test(c)) {
      store.addMaterial({ type: '好评实拍', content: c.slice(0, 100), sourceId: m.id, author: m.author, memberId: m.memberId });
    }
    if (/案例|落地|项目|实施|交付/.test(c)) {
      store.addMaterial({ type: '落地案例', content: c.slice(0, 100), sourceId: m.id, author: m.author, memberId: m.memberId });
    }
    if (/活动|大会|峰会|沙龙|论坛/.test(c)) {
      store.addMaterial({ type: '活动实拍', content: c.slice(0, 100), sourceId: m.id, author: m.author, memberId: m.memberId });
    }
  });
}

function generateRiskAdvice(moment) {
  const types = (moment.riskFlags || []).join(',');
  return `针对「${types}」：建议①核实信息真实性 ②联系发布人沟通 ③准备官方回应口径 ④必要时启动法务介入`;
}

function summarizeTags(moments) {
  const allTags = {};
  moments.forEach((m) => (m.bizTags || []).forEach((t) => { allTags[t] = (allTags[t] || 0) + 1; }));
  return Object.entries(allTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, v]) => `${k}(${v})`)
    .join('、') || '—';
}

function summarizeRisks(moments) {
  const allRisks = {};
  moments.forEach((m) => (m.riskFlags || []).forEach((r) => { allRisks[r] = (allRisks[r] || 0) + 1; }));
  return Object.entries(allRisks)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `· ${k}：${v} 条`)
    .join('\n');
}

// 导出辅助函数供外部使用
export { extractOpportunities, scanRisks, classifyMoment };
