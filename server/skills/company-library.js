// 技能：符合条件的企业信息库
import { store } from '../store.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPANIES_FILE = path.join(__dirname, '..', '..', 'data', 'companies.json');

function loadCompanies() {
  try {
    return JSON.parse(fs.readFileSync(COMPANIES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export const description = '符合条件的企业信息库：按行业/地域/规模/会员等级/年营收区间/标签检索浙商会员企业，支持多维联合检索，支撑资源对接与圈层画像。';
export const trigger = '企业库 / 企业信息 / 找企业 / 符合条件的企业 / 企业名录';
export const tools = ['company.query'];

// 行业词表（含归一化）
const INDUSTRIES = {
  硬科技: '硬科技', 新材料: '新材料', 农文旅: '农文旅', 大健康: '大健康',
  新能源: '新能源', AI: 'AI', 人工智能: 'AI', 国学: '国学', 制造: '硬科技', 半导体: '硬科技',
};

// 标签词表（联合检索用）
const TAG_WORDS = [
  '半导体', '国产替代', '新材料', '产学研', '乡村振兴', '文旅', '康养', '储能', '并购',
  'AI', '国学', '精密制造', '出口', '供应链', '数据场景', '生物医药', '创新药', '汽车电子',
  '传感器', '化纤', '模具', '跨境电商', '品牌联名', '锂电', '冷链', '水产', '电气', '智能电网', '中试', '招商', '雅集', '圈层', '高净值客群',
];

// 从自然语言问句抽取检索条件（支持多维联合）
function extractCriteria(text) {
  const q = text || '';
  const criteria = {};

  // 行业
  const industryHit = Object.keys(INDUSTRIES).find((i) => q.includes(i));
  if (industryHit) criteria.industry = INDUSTRIES[industryHit];

  // 地域（浙江各地市）
  const regions = ['杭州', '宁波', '温州', '湖州', '嘉兴', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'];
  const r = regions.find((c) => q.includes(c));
  if (r) criteria.region = r;

  // 会员等级
  if (/svip|理事|核心/.test(q)) criteria.tier = 'SVIP';
  else if (/vip|基础/.test(q)) criteria.tier = 'VIP';

  // 规模
  if (/500人|大型|500 以上/.test(q)) criteria.scale = '500人以上';
  else if (/200.?500|中大型/.test(q)) criteria.scale = '200-500人';
  else if (/50.?200|中型/.test(q)) criteria.scale = '50-200人';

  // 年营收区间（如「营收过亿」「1亿以上」「5000万以下」「2到5亿」）
  const rev = extractRevenueRange(q);
  if (rev) criteria.revenue = rev;

  // 标签（联合检索）
  const tags = TAG_WORDS.filter((t) => q.includes(t));
  if (tags.length) criteria.tags = tags;

  return criteria;
}

// 解析自然语言中的年营收区间，返回 { min, max }（单位：亿）
function extractRevenueRange(q) {
  // 命中中文数字/阿拉伯数字 + 亿/万
  const numToYi = (s) => {
    if (s.includes('亿')) return parseFloat(s.replace(/[^0-9.]/g, ''));
    if (s.includes('万')) return parseFloat(s.replace(/[^0-9.]/g, '')) / 10000;
    return parseFloat(s.replace(/[^0-9.]/g, ''));
  };

  // 区间：a到b / a-b
  const rangeM = q.match(/([0-9.]+)\s*(?:亿|万)?\s*(?:[到\-~]|至)\s*([0-9.]+)\s*(亿|万)/);
  if (rangeM) {
    const min = numToYi(rangeM[1] + rangeM[3]);
    const max = numToYi(rangeM[2] + rangeM[3]);
    return { min, max };
  }

  // 上限：X亿以下 / 不足X亿 / 低于X亿
  const belowM = q.match(/(?:以下|不足|低于|小于)\s*([0-9.]+)\s*(亿|万)/);
  if (belowM) return { min: 0, max: numToYi(belowM[1] + belowM[2]) };

  // 下限：X亿以上 / 过亿 / 超X亿 / 突破X亿
  const aboveM = q.match(/(?:以上|过|超|突破|大于|高于)\s*([0-9.]+)\s*(亿|万)/);
  if (aboveM) return { min: numToYi(aboveM[1] + aboveM[2]), max: Infinity };
  if (/过亿|破亿|亿元级/.test(q)) return { min: 1, max: Infinity };

  return null;
}

export function handler(ctx) {
  const { action, question, text } = ctx;
  const q = (question || '') + ' ' + (text || '');

  if (action === 'list' || action === 'all') {
    const list = loadCompanies();
    return formatList(list, '全部企业信息库');
  }

  // 默认：按条件检索（多维联合）
  const criteria = extractCriteria(q);
  let pool = loadCompanies();

  if (criteria.industry) pool = pool.filter((c) => c.industry === criteria.industry);
  if (criteria.region) pool = pool.filter((c) => c.region.includes(criteria.region));
  if (criteria.tier) pool = pool.filter((c) => c.tier === criteria.tier);
  if (criteria.scale) pool = pool.filter((c) => c.scale === criteria.scale);
  if (criteria.revenue) {
    const { min, max } = criteria.revenue;
    pool = pool.filter((c) => (c.revenueNum ?? 0) >= min && (c.revenueNum ?? 0) <= max);
  }
  if (criteria.tags && criteria.tags.length)
    pool = pool.filter((c) => criteria.tags.every((t) => (c.tags || []).includes(t)));

  const condText = Object.entries(criteria).map(([k, v]) => {
    if (k === 'revenue') return `营收=${v.min}亿~${isFinite(v.max) ? v.max + '亿' : '∞'}`;
    return `${k}=${Array.isArray(v) ? v.join('/') : v}`;
  }).join('，') || '（全部）';
  store.log('INFO', '企业库检索', { criteria, hits: pool.length });
  return formatList(pool, `符合条件的企业（${condText}）`);
}

// 供 /api/companies 使用的结构化过滤（支持 query 参数）
export function queryCompanies(params = {}) {
  let pool = loadCompanies();
  const { industry, region, tier, scale, tag, revMin, revMax, kw } = params;
  if (industry) pool = pool.filter((c) => c.industry === industry);
  if (region) pool = pool.filter((c) => c.region.includes(region));
  if (tier) pool = pool.filter((c) => c.tier === tier);
  if (scale) pool = pool.filter((c) => c.scale === scale);
  if (tag) pool = pool.filter((c) => (c.tags || []).includes(tag));
  if (revMin != null) pool = pool.filter((c) => (c.revenueNum ?? 0) >= Number(revMin));
  if (revMax != null) pool = pool.filter((c) => (c.revenueNum ?? 0) <= Number(revMax));
  if (kw) pool = pool.filter((c) => [c.name, c.industry, c.region, (c.tags || []).join('')].some((v) => v.includes(kw)));
  return pool;
}

function formatList(list, title) {
  if (!list.length) {
    return `📭 ${title}：未匹配到企业。\n可尝试更宽泛的条件，如「浙江的硬科技企业」「SVIP 理事企业」。`;
  }
  return (
    `🏢 ${title}（共 ${list.length} 家）：\n` +
    list
      .map(
        (c, i) =>
          `${i + 1}. ${c.name}（${c.tier}）\n` +
          `   ${c.industry} · ${c.region} · ${c.scale} · 年营收 ${c.revenue}\n` +
          `   标签：${c.tags.join('、')}\n` +
          `   ${c.intro}`
      )
      .join('\n\n') +
    '\n\n🔗 需深度对接？龙虾可一键转接专属管家推进合作。'
  );
}
