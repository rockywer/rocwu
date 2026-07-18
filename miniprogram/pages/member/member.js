const { get, chat } = require('../../utils/request.js');

const RIGHTS = [
  '十八大板块服务体系参与资格',
  '企业家学院大课与私董会',
  '高端运动联赛（高尔夫·网球）圈层社交',
  'AI 智能体 7×24 专属服务',
  '人工智能数字化赋能（AI实战·大模型·数字员工）',
  '产业资本与资源对接通道',
  '专精特新科创梯度培育',
  '会员专属活动与闭门夜话'
];

Page({
  data: {
    tier: 'VIP',
    rights: RIGHTS,
    name: '',
    company: '',
    applyTier: 'VIP',
    members: []
  },

  onLoad() {
    this.loadMembers();
  },

  onShow() {
    const app = getApp();
    this.setData({ tier: app.globalData.tier });
  },

  onName(e) { this.setData({ name: e.detail.value }); },
  onCompany(e) { this.setData({ company: e.detail.value }); },
  pickTier(e) { this.setData({ applyTier: e.currentTarget.dataset.t }); },

  loadMembers() {
    get('/api/members')
      .then((list) => this.setData({ members: list || [] }))
      .catch(() => this.setData({ members: [] }));
  },

  submit() {
    const { name, company, applyTier } = this.data;
    if (!name.trim()) {
      wx.showToast({ title: '请填写姓名', icon: 'none' });
      return;
    }
    const text = `申请${applyTier}会员，姓名${name}${company ? '，企业' + company : ''}`;
    wx.showLoading({ title: '提交中' });
    chat(text, getApp().globalData.sessionId)
      .then((res) => {
        wx.hideLoading();
        wx.showModal({
          title: '申请已提交',
          content: res.reply || '我们已收到您的入会申请，专人将与您联系。',
          showCancel: false
        });
        this.loadMembers();
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: '提交失败：' + (err.errMsg || ''), icon: 'none' });
      });
  }
});
