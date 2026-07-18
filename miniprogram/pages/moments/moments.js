const { get } = require('../../utils/request.js');

Page({
  data: {
    brief: { totalMoments: 0, newOpportunities: 0, highPriorityOpps: 0, bizTagDist: {}, topAuthors: [] },
    opps: [],
    moments: [],
    riskyCount: 0,
    loading: true,
    activeTab: 'overview',
    bizTagCount: 0,
    sortedBizTags: [],
    oppsList: [],
    riskMomentsList: [],
    recentMomentsList: []
  },

  onLoad() { this.loadAll(); },
  onShow() { this.loadAll(); },

  async loadAll() {
    this.setData({ loading: true });
    try {
      const [brief, opps, moments] = await Promise.allSettled([
        get('/api/moments/daily-brief'),
        get('/api/opportunities?status=new'),
        get('/api/moments?limit=20')
      ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : null));
      const bizTagDist = (brief || {}).bizTagDist || {};
      const bizTagCount = Object.keys(bizTagDist).length;
      const sortedBizTags = Object.entries(bizTagDist).sort((a, b) => b[1] - a[1]).slice(0, 8);
      const formatMoment = m => ({
        ...m,
        displayContent: m.content ? (m.content.slice(0, 80) + (m.content.length > 80 ? '…' : '')) : '',
        displayRiskContent: m.content ? (m.content.slice(0, 60) + '…') : '',
        displayTime: m.createdAt ? m.createdAt.slice(0, 16) : '—',
        displayCategory: m.category || '—',
        displayAuthor: m.author || '—',
        displaySourceAuthor: m.sourceAuthor || '—',
        displayMatchBoard: m.matchBoard || '—',
        displayPriority: m.priority === 'high' ? '🔴' : '🟡',
        priorityClass: m.priority === 'high' ? 'pri-high' : 'pri-medium'
      });
      const riskMoments = (moments || []).filter(m => (m.riskFlags || []).length > 0).map(formatMoment);
      const riskMomentsList = riskMoments.slice(0, 20);
      const riskyCount = riskMoments.length;
      const recentMomentsList = (moments || []).slice(0, 20).map(formatMoment);
      const oppsList = (opps || []).slice(0, 20).map(o => ({
        ...o,
        displayPriority: o.priority === 'high' ? '🔴' : '🟡',
        priorityClass: o.priority === 'high' ? 'pri-high' : 'pri-medium',
        displaySourceAuthor: o.sourceAuthor || '—',
        displayMatchBoard: o.matchBoard || '—'
      }));
      const allFailed = !brief && !opps && !moments;
      this.setData({
        brief: brief || {},
        opps: opps || [],
        moments: moments || [],
        bizTagCount,
        sortedBizTags,
        oppsList,
        riskMomentsList,
        riskyCount,
        recentMomentsList,
        loading: false
      });
      if (allFailed) {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  goChat(e) {
    const q = e.currentTarget.dataset.q || '';
    wx.switchTab({ url: '/pages/chat/chat' });
    setTimeout(() => {
      const pages = getCurrentPages();
      const chatPage = pages[pages.length - 1];
      if (chatPage && chatPage.send) chatPage.send(q);
    }, 350);
  },

  onPullDownRefresh() {
    this.loadAll().then(() => wx.stopPullDownRefresh());
  }
});
