const BOARDS = [
  { name: '企业家学院', emoji: '🎓', desc: '大课·私董会·认知升级', q: '企业家学院有哪些课程' },
  { name: '高端运动联赛', emoji: '🏌️', desc: '高尔夫·网球·圈层社交', q: '高尔夫板块怎么报名' },
  { name: '非遗传承', emoji: '🏺', desc: '非遗手作·文化雅集', q: '非遗传承板块有什么活动' },
  { name: '大健康康养', emoji: '🌿', desc: '中医·康养·身心管理', q: '大健康康养板块介绍' },
  { name: '国学论道', emoji: '📜', desc: '国学·禅修·智慧共修', q: '国学论道板块介绍' },
  { name: '家族传承', emoji: '🏛️', desc: '信托·遗嘱·世代传承', q: '家族传承板块有什么服务' },
  { name: '产业资本', emoji: '💰', desc: '投融资·并购·上市', q: '产业资本板块怎么对接' },
  { name: '产业与资本研究院', emoji: '🏛️', desc: '产融智库·资本对接·上市培育', page: '/pages/institute/institute' },
  { name: '科研院所协同', emoji: '🔬', desc: '中科院·浙大·产学研', q: '科研院所协同板块介绍' },
  { name: '农文旅融合', emoji: '🌾', desc: '乡村振兴·农文旅', q: '农文旅融合板块介绍' },
  { name: '龙虾智能体', emoji: '🦞', desc: 'AI 自主运营中心', q: '龙虾智能体能做什么' },
  { name: '地方产业规划', emoji: '🗺️', desc: '招商·园区·飞地', q: '地方产业规划板块介绍' },
  { name: '专精特新培育', emoji: '🔧', desc: '高新·小巨人·资质申报', q: '专精特新科创梯度培育板块介绍' },
  { name: '跨境出海', emoji: '🌐', desc: '外贸·出海·全球布局', q: '跨境贸易与出海经济板块介绍' },
  { name: '新生代浙商', emoji: '👥', desc: '接班特训·青年创业', q: '新生代浙商传承与青年创业板块介绍' },
  { name: '品牌IP赋能', emoji: '📣', desc: '品牌升级·创始人IP·舆情', q: '品牌公关与新媒体IP赋能板块介绍' },
  { name: '私行财富', emoji: '💎', desc: '资产配置·家族信托', q: '私行财富与全球资产配置板块介绍' },
  { name: '低空经济', emoji: '🚀', desc: '低空·AI·未来产业', q: '低空经济与未来产业孵化板块介绍' },
  { name: '人工智能数字化', emoji: '🤖', desc: 'AI落地·数字员工·大模型', q: '人工智能数字化赋能中心有哪些服务' },
  { name: '企业信息库', emoji: '🏢', desc: '符合条件企业检索', q: '有哪些符合条件的企业' },
  { name: '入会申请', emoji: '📝', desc: '会员入会申请表', page: '/pages/apply/apply' }
];

Page({
  data: { boards: BOARDS },

  ask(e) {
    const q = e.currentTarget.dataset.q;
    wx.switchTab({ url: '/pages/chat/chat' });
    // 延迟发送，确保 chat 页已加载
    setTimeout(() => {
      const pages = getCurrentPages();
      const chatPage = pages[pages.length - 1];
      if (chatPage && chatPage.send) chatPage.send(q);
    }, 350);
  },

  goPage(e) {
    const page = e.currentTarget.dataset.page;
    if (page) wx.navigateTo({ url: page });
  }
});
