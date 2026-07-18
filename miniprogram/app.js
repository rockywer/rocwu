// 🦞 龙虾智能体小程序 —— 全局逻辑
const { BASE_URL } = require('./config.js');

App({
  globalData: {
    BASE_URL,
    sessionId: '',
    tier: 'VIP'
  },

  onLaunch() {
    // 生成并持久化 sessionId，保证多轮对话上下文连续
    let sid = wx.getStorageSync('sessionId');
    if (!sid) {
      sid = 'mp-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      wx.setStorageSync('sessionId', sid);
    }
    this.globalData.sessionId = sid;
    // 读取本地会员等级
    const tier = wx.getStorageSync('tier');
    if (tier) this.globalData.tier = tier;
  }
});
