const { get } = require('../../utils/request.js');

Page({
  data: {
    skills: [],
    ops: null,
    online: false
  },

  onShow() {
    this.loadAll();
  },

  loadAll() {
    get('/api/health')
      .then(() => this.setData({ online: true }))
      .catch(() => this.setData({ online: false }));

    get('/api/skills')
      .then((list) => this.setData({ skills: Array.isArray(list) ? list : [] }))
      .catch(() => this.setData({ skills: [] }));

    get('/api/ops')
      .then((ops) => {
        const joins = (ops.joins || []).length;
        const signups = ((ops.activities || []).filter((a) => a.type === 'signup')).length;
        this.setData({
          ops: {
            memberCount: (ops.members || []).length,
            joinCount: joins,
            signupCount: signups
          }
        });
      })
      .catch(() => this.setData({ ops: { memberCount: '-', joinCount: '-', signupCount: '-' } }));
  },

  goBoards() {
    wx.switchTab({ url: '/pages/boards/boards' });
  }
});
