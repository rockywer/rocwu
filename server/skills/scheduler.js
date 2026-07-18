// 技能：全板块服务智能调度
import { store } from '../store.js';
import { BOARDS, MEMBER_TIERS } from '../knowledge.js';

export const description = '全板块服务智能调度：权益匹配、活动报名/签到、课程预约、康养/名医通道对接。';
export const trigger = '报名 / 预约 / 签到 / 板块 / 权益匹配';
export const tools = ['board.match', 'board.signup'];

export function handler(ctx) {
  const { action, payload } = ctx;
  switch (action) {
    case 'boards':
      return (
        '🗂️ 俱乐部 18 大核心服务板块：\n' +
        BOARDS.map((b, i) => `${i + 1}. ${b.name}`).join('\n') +
        '\n\n每位会员须自主选定 1-2 个板块深度参与，严格遵守出勤管理。'
      );

    case 'rights': {
      const tier = (payload?.tier || 'VIP').toUpperCase();
      const t = MEMBER_TIERS[tier] ? tier : 'VIP';
      const rights = t === 'SVIP'
        ? ['核心理事专属群', '全系权益免费畅享', '不限次线下活动', '全程一对一专属对接',
           '优先活动冠名/发言', '参与理事会议', '高端精准资源匹配', '全方位品牌推广',
           '龙虾专属智能分身+全流程代办']
        : ['实名会员群', '会员通讯录(每月更新)', '对应基础权益', '线下活动限次免费',
           '基础资源对接', '基础品牌展示', '龙虾基础智能答疑+提醒'];
      return `🎫 ${t} 会员权益总览：\n` + rights.map((r) => '· ' + r).join('\n');
    }

    case 'signup': {
      let { memberId, boardId } = payload || {};
      const q = (ctx.question || '') + ' ' + (ctx.text || '');
      if (!memberId) {
        const mm = q.match(/M\d{4}/);
        if (mm) memberId = mm[0];
        else {
          const nm = q.match(/会员([\u4e00-\u9fa5]{2,4})/);
          if (nm) { const f = store.getMemberByName(nm[1]); if (f) memberId = f.id; }
        }
      }
      if (!boardId) {
        const ALIAS = {
          academy: ['学院', '企业家学院', '课程', '大课'],
          golf: ['高尔夫', '高球'],
          tennis: ['网球'],
          intangible: ['非遗', '非遗文化'],
          health: ['康养', '健康', '中医', '体检'],
          guoxue: ['国学', '论道', '禅修'],
          inheritance: ['传承', '遗嘱', '家族'],
          capital: ['资本', '产融', '融资', '上市'],
          research: ['科研', '院所', '实验室', '中科院', '浙大'],
          agritourism: ['农文旅', '康养旅居', '田园'],
          localplan: ['产业规划', '地方产业', '招商', '园区'],
          kechuang: ['专精特新', '科创培育', '小巨人', '高新培育'],
          crossborder: ['跨境', '出海', '外贸', '汇率'],
          newgen: ['新生代', '青年创业', '企二代', '接班'],
          brand: ['品牌', '新媒体', '创始人IP', '舆情'],
          wealth: ['私行', '财富', '资产配置', '家族信托'],
          lowaltitude: ['低空经济', '未来产业', '新质生产力', '无人机'],
          aidigit: ['人工智能', 'AI赋能', '大模型', '数字化', '智能体', '数字员工'],
        };
        const hit = BOARDS.find(
          (b) =>
            q.includes(b.name) ||
            q.includes(b.slug) ||
            q.includes(b.id) ||
            (ALIAS[b.id] || []).some((kw) => q.includes(kw))
        );
        if (hit) boardId = hit.id;
      }
      const m = memberId ? store.getMember(memberId) : null;
      const board = BOARDS.find((b) => b.id === boardId || b.slug === boardId);
      if (!m) return '请提供会员编号/姓名（如「报名高尔夫，会员M0001」）。';
      if (!board) return '未识别板块，可说「报名高尔夫板块」或「报名企业家学院」。';
      const boards = m.boards || [];
      if (boards.length >= 2 && !boards.includes(board.id)) {
        return `⚠️ ${m.name} 已选满 2 个板块（${boards.join('、')}），每人最多深度参与 1-2 个板块。`;
      }
      if (!boards.includes(board.id)) boards.push(board.id);
      store.updateMember(m.id, { boards });
      store.pushOp('activities', { memberId: m.id, board: board.id, type: 'signup' });
      const right = m.tier === 'SVIP' ? board.svip : board.vip;
      store.log('INFO', '板块报名', { id: m.id, board: board.id });
      return (
        `✅ ${m.name} 已报名【${board.name}】\n` +
        `板块定位：${board.position}\n` +
        `您的权益：${right}\n` +
        `出勤要求：板块内活动不得无故缺席。`
      );
    }

    case 'matchRight': {
      const { memberId, boardId } = payload || {};
      const m = memberId ? store.getMember(memberId) : null;
      const board = BOARDS.find((b) => b.id === boardId || b.slug === boardId);
      if (!m || !board) return '请提供会员与板块信息。';
      const right = m.tier === 'SVIP' ? board.svip : board.vip;
      return `【${board.name}】· ${m.tier} 权益：\n${right}`;
    }

    default:
      return (
        '🦞 服务调度技能就绪。支持指令：\n' +
        '· boards — 列出全部板块\n' +
        '· rights — 查询等级权益\n' +
        '· signup — 板块活动报名\n' +
        '· matchRight — 匹配板块权益'
      );
  }
}
