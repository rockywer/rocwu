export default {
  pages: [
    'pages/auth/login',
    'pages/auth/questionnaire',
    'pages/home/index',
    'pages/consultation/index',
    'pages/recipes/index',
    'pages/chronic/index',
    'pages/mine/index',
    'pages/recipe-detail/index',
    'pages/tongue-result/index',
    'pages/health-report/index',
    'pages/tongue-diagnosis/index',
    'pages/plan-generate/index',
    'pages/store-service/index'
  ],
  window: {
    navigationBarTitleText: '青禾大健康',
    navigationBarBackgroundColor: '#2ECC71',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F9F5',
    backgroundTextStyle: 'dark'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2ECC71',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.svg',
        selectedIconPath: 'assets/tabbar/home-selected.svg'
      },
      {
        pagePath: 'pages/consultation/index',
        text: '问诊',
        iconPath: 'assets/tabbar/consultation.svg',
        selectedIconPath: 'assets/tabbar/consultation-selected.svg'
      },
      {
        pagePath: 'pages/recipes/index',
        text: '食养',
        iconPath: 'assets/tabbar/recipes.svg',
        selectedIconPath: 'assets/tabbar/recipes-selected.svg'
      },
      {
        pagePath: 'pages/chronic/index',
        text: '慢病',
        iconPath: 'assets/tabbar/chronic.svg',
        selectedIconPath: 'assets/tabbar/chronic-selected.svg'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.svg',
        selectedIconPath: 'assets/tabbar/mine-selected.svg'
      }
    ]
  }
}
