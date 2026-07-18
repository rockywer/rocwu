const { get } = require('../../utils/request.js');

const INDUSTRIES = ['全部行业', '硬科技', '新材料', '农文旅', '大健康', '新能源', 'AI', '国学'];
const REGIONS = ['全部地域', '杭州', '宁波', '温州', '湖州', '嘉兴', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'];
const TIERS = ['全部等级', 'SVIP', 'VIP'];
const REVENUES = ['全部营收', '1亿以下', '1-3亿', '3-5亿', '5亿以上'];
// 与 REVENUES 对应的区间（亿）：[min, max]
const REV_RANGE = [
  null,
  [0, 1],
  [1, 3],
  [3, 5],
  [5, Infinity],
];
const SORTS = ['默认', '营收高→低', '营收低→高'];
// 覆盖种子库全部实际标签
const TAGS = ['全部标签', '半导体', '国产替代', '新材料', '产学研', '中试', '乡村振兴', '文旅', '招商', '康养', '高净值客群', '品牌联名', '储能', '并购', '利润2000万+', 'AI', '数据场景', '精密制造', '出口', '供应链', '国学', '雅集', '圈层', '生物医药', '创新药', '汽车电子', '传感器', '化纤', '模具', '跨境电商', '锂电', '冷链', '水产', '电气', '智能电网'];

Page({
  data: {
    list: [],
    kw: '',
    industries: INDUSTRIES,
    regions: REGIONS,
    tiers: TIERS,
    revenues: REVENUES,
    tags: TAGS,
    sorts: SORTS,
    indIdx: 0,
    regIdx: 0,
    tierIdx: 0,
    revIdx: 0,
    tagIdx: 0,
    sortIdx: 0
  },

  onShow() {
    this.load();
  },

  load() {
    const { indIdx, regIdx, tierIdx, revIdx, tagIdx, kw, sortIdx } = this.data;
    const parts = [];
    if (indIdx) parts.push('industry=' + encodeURIComponent(INDUSTRIES[indIdx]));
    if (regIdx) parts.push('region=' + encodeURIComponent(REGIONS[regIdx]));
    if (tierIdx) parts.push('tier=' + encodeURIComponent(TIERS[tierIdx]));
    const rr = REV_RANGE[revIdx];
    if (rr) {
      if (rr[0] > 0) parts.push('revMin=' + rr[0]);
      if (isFinite(rr[1])) parts.push('revMax=' + rr[1]);
    }
    if (tagIdx) parts.push('tag=' + encodeURIComponent(TAGS[tagIdx]));
    if (kw.trim()) parts.push('kw=' + encodeURIComponent(kw.trim()));
    const qs = parts.join('&');
    get('/api/companies' + (qs ? '?' + qs : ''))
      .then((list) => {
        if (sortIdx === 1) list = list.slice().sort((a, b) => (b.revenueNum || 0) - (a.revenueNum || 0));
        else if (sortIdx === 2) list = list.slice().sort((a, b) => (a.revenueNum || 0) - (b.revenueNum || 0));
        this.setData({ list });
      })
      .catch(() => this.setData({ list: [] }));
  },

  onKw(e) { this.setData({ kw: e.detail.value }); this.load(); },
  onIndustry(e) { this.setData({ indIdx: +e.detail.value }); this.load(); },
  onRegion(e) { this.setData({ regIdx: +e.detail.value }); this.load(); },
  onTier(e) { this.setData({ tierIdx: +e.detail.value }); this.load(); },
  onRevenue(e) { this.setData({ revIdx: +e.detail.value }); this.load(); },
  onTag(e) { this.setData({ tagIdx: +e.detail.value }); this.load(); },
  onSort(e) { this.setData({ sortIdx: +e.detail.value }); this.load(); },

  reset() {
    this.setData({ kw: '', indIdx: 0, regIdx: 0, tierIdx: 0, revIdx: 0, tagIdx: 0, sortIdx: 0 });
    this.load();
  },

  ask(e) {
    const q = e.currentTarget.dataset.q;
    wx.switchTab({ url: '/pages/chat/chat' });
    setTimeout(() => {
      const pages = getCurrentPages();
      const chatPage = pages[pages.length - 1];
      if (chatPage && chatPage.send) chatPage.send(q);
    }, 350);
  }
});
