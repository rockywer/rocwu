// 技能：圈层资源智能对接
import { store } from '../store.js';

export const description = '圈层资源智能对接：基于会员企业赛道/需求/资源标签，精准匹配商机、投融资、产学研、政企。';
export const trigger = '对接 / 商机 / 投融资 / 产学研 / 政企 / 合作';
export const tools = ['resource.match'];

// 示例资源池（生产可由运营录入 / 外部系统同步）
const RESOURCE_POOL = [
  { id: 'R001', type: '投融资', tag: '硬科技', desc: '某头部产业基金寻求 A 轮硬科技项目，单笔 3000万-1亿', need: '技术壁垒高、已实现营收' },
  { id: 'R002', type: '产学研', tag: '新材料', desc: '之江实验室新材料中试成果寻企业落地', need: '具备中试产线企业' },
  { id: 'R003', type: '政企', tag: '乡村振兴', desc: '某县政府产业园招商，提供税收与用地支持', need: '农文旅/制造龙头企业' },
  { id: 'R004', type: '商机', tag: '大健康', desc: '高端康养度假村寻求品牌联名与会员共享', need: '高净值客群渠道' },
  { id: 'R005', type: '投融资', tag: '新能源', desc: '浙商资本寻储能赛道并购标的', need: '年利润 2000万以上' },
  { id: 'R006', type: '产学研', tag: 'AI', desc: '浙大 AI 实验室联合攻关课题征企业伙伴', need: '有数据/场景的企业' },
];

export function handler(ctx) {
  const { action, payload } = ctx;
  switch (action) {
    case 'match': {
      const { tag, type, memberId } = payload || {};
      let pool = RESOURCE_POOL;
      if (type) pool = pool.filter((r) => r.type === type);
      if (tag) pool = pool.filter((r) => r.tag.includes(tag) || tag.includes(r.tag));
      if (!pool.length) pool = RESOURCE_POOL;
      const top = pool.slice(0, 3);
      store.pushOp('matches', { memberId: memberId || 'unknown', hits: top.map((t) => t.id) });
      store.log('INFO', '资源对接匹配', { tag, type, hits: top.length });
      return (
        `🔗 为您精准匹配到 ${top.length} 项圈层资源：\n` +
        top
          .map(
            (r, i) =>
              `${i + 1}. [${r.type}·${r.tag}] ${r.desc}\n   对接门槛：${r.need}`
          )
          .join('\n\n') +
        '\n\n龙虾已生成专属合作方案，复杂事务可一键转接专属管家推进。'
      );
    }

    case 'pool':
      return (
        '📦 当前圈层资源池（示例）：\n' +
        RESOURCE_POOL.map((r) => `· [${r.type}] ${r.desc}`).join('\n')
      );

    default:
      return (
        '🦞 资源对接技能就绪。支持指令：\n' +
        '· match — 按标签/类型匹配资源\n' +
        '· pool — 查看资源池'
      );
  }
}
