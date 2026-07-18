const { chat } = require('../../utils/request.js');
const app = getApp();

const QUICK = [
  '入会申请流程',
  '申请SVIP理事会员',
  '有哪些板块',
  '我的会员权益',
  '朋友圈日报',
  '人工智能数字化赋能',
  '帮我对接投融资资源',
  '生成运营复盘'
];

Page({
  data: {
    messages: [],
    inputText: '',
    loading: false,
    scrollTarget: '',
    quick: QUICK
  },

  onLoad() {
    this.sessionId = app.globalData.sessionId;
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendQuick(e) {
    this.send(e.currentTarget.dataset.text);
  },

  send(text) {
    const rawMsg = text != null ? text : this.data.inputText;
    const msg = typeof rawMsg === 'string' ? rawMsg.trim() : '';
    if (!msg || this.data.loading) return;

    const userMsg = { id: 'u' + Date.now(), role: 'user', content: msg };
    const messages = this.data.messages.concat(userMsg);
    this.setData({ messages, inputText: '', loading: true, scrollTarget: 'msg-' + userMsg.id });
    this._scrollToBottom();

    chat(msg, this.sessionId)
      .then((res) => {
        const agentMsg = { id: 'a' + Date.now(), role: 'agent', content: res.reply || '（无回复）' };
        this.setData({
          messages: this.data.messages.concat(agentMsg),
          loading: false,
          scrollTarget: 'msg-' + agentMsg.id
        });
        this._scrollToBottom();
      })
      .catch((err) => {
        const agentMsg = { id: 'a' + Date.now(), role: 'agent', content: '⚠️ 连接失败：' + (err.errMsg || err.message || '未知错误') + '\n请确认后端服务已启动，并在开发者工具勾选「不校验合法域名」。' };
        this.setData({
          messages: this.data.messages.concat(agentMsg),
          loading: false,
          scrollTarget: 'msg-' + agentMsg.id
        });
        this._scrollToBottom();
      });
  },

  // 清空对话
  clearChat() {
    if (this.data.messages.length === 0) return;
    wx.showModal({
      title: '清空对话',
      content: '确定要清空所有对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ messages: [], scrollTarget: '' });
          wx.showToast({ title: '已清空', icon: 'success', duration: 1200 });
        }
      }
    });
  },

  // 复制最后一条 agent 回复（长按或按钮触发）
  copyLastReply() {
    const msgs = this.data.messages;
    let lastContent = '';
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'agent') { lastContent = msgs[i].content; break; }
    }
    if (!lastContent) { wx.showToast({ title: '暂无回复可复制', icon: 'none' }); return; }
    wx.setClipboardData({
      data: lastContent,
      success: () => wx.showToast({ title: '已复制', icon: 'success', duration: 1200 })
    });
  },

  // scroll-view 的 scroll-into-view 模式：每次 setData 更新 scrollTarget 到最新消息 id，
  // scroll-view 会自动将对应元素滚动到可视区域。延迟 100ms 确保 DOM 渲染完成。
  _scrollToBottom() {
    const msgs = this.data.messages;
    if (msgs.length === 0) return;
    const lastId = msgs[msgs.length - 1].id;
    setTimeout(() => {
      this.setData({ scrollTarget: 'msg-' + lastId });
    }, 100);
  }
});
