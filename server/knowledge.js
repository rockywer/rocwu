export const PLATFORM = {
  name: 'TikTok Shop 欧洲跨境AI虚拟团队',
  slogan: '24小时自主运转 · 全链路自动化 · 数据驱动迭代 · 零疏漏合规风控',
  positioning: '针对TikTok Shop欧洲跨境POP招商、店铺运营、爆品孵化、合规履约、投放增长全业务场景，搭建标准化AI虚拟团队四大核心体系，适配新手起盘、老店增量、多站点矩阵布局全阶段商家。',
};

export const EU_SITES = {
  EU4: ['德国', '法国', '英国', '意大利'],
  EU8: ['西班牙', '波兰', '荷兰', '比利时', '爱尔兰', '葡萄牙', '奥地利', '瑞士'],
  ALL: ['德国', '法国', '英国', '意大利', '西班牙', '波兰', '荷兰', '比利时', '爱尔兰', '葡萄牙', '奥地利', '瑞士', '瑞典', '丹麦'],
};

export const COMMISSION_RATES = {
  '2%': ['波兰', '荷兰', '比利时', '爱尔兰', '葡萄牙', '奥地利', '瑞士', '瑞典', '丹麦'],
  '4%': ['西班牙'],
  '6%': ['德国', '法国', '英国', '意大利'],
};

export const INCENTIVE_PROGRAMS = [
  { id: 'new-seller', name: '新商家入驻激励', description: '新店15天5品上架、14天3品上架低佣任务', benefit: '佣金减免+广告金补贴' },
  { id: 'expansion', name: '扩店激励', description: '多站点拓店完成指定任务', benefit: '广告金+流量扶持' },
  { id: 'ad-bonus', name: '广告金申领', description: '完成平台指定投放任务', benefit: '最高1:1广告金返还' },
  { id: 'sample', name: '寄样激励', description: '给本土达人寄样推广', benefit: '运费补贴+曝光奖励' },
];

export const COMPLIANCE_RULES = {
  GDPR: { name: '通用数据保护条例', scope: '欧盟境内所有用户数据', requirements: ['用户授权同意', '数据加密存储', '跨境数据传输合规', '数据主体权利保障'] },
  EPR: { name: '生产者责任延伸', scope: '包装废弃物、电子废弃物', requirements: ['注册EPR号码', '申报年度回收量', '支付回收费用', '贴标合规'] },
  VAT: { name: '增值税', scope: '欧盟境内销售', requirements: ['各国VAT注册', '正确计算税率', '按时申报缴纳', 'IOSS/OSS申报'] },
  CE: { name: 'CE认证', scope: '电子产品、玩具、医疗器械等', requirements: ['符合欧盟安全标准', 'CE标识贴附', '技术文件准备', '合格声明'] },
  REACH: { name: '化学品注册评估授权', scope: '化学品及含化学品产品', requirements: ['SVHC物质申报', '安全数据表', '限制物质检测'] },
};

export const AI_ROLES = {
  leader: {
    id: 'leader',
    name: 'AI总负责人',
    position: '团队总指挥',
    description: '全局调度、任务统筹、资源分配、进度管控，衔接人工老板与所有AI员工',
    responsibilities: [
      '拆解平台政策、制定每日/每周运营计划',
      '分配各AI岗位任务',
      '审核核心输出',
      '复盘团队数据',
      '协调跨岗位问题',
      '输出周报月报',
    ],
    capabilities: ['熟悉TikTok欧洲14国政策', '佣金规则', '激励活动', '站点差异', '全局统筹', '风险预判'],
    kpi: ['任务完成率', '政策红利申领率', '团队GMV增长', '利润率提升'],
  },
  compliance: {
    id: 'compliance',
    name: 'AI政策合规专员',
    position: '风控底线岗',
    description: '全链路合规审核、政策解读、资质管控、风险预警，杜绝平台处罚',
    responsibilities: [
      '实时更新欧盟GDPR、EPR、CE、VAT合规规则',
      '核查商品上架合规性',
      '解读佣金减免、广告补贴、寄样激励等官方政策',
      '排查店铺违规风险',
      '输出合规整改清单',
      '跟进资质办理进度',
    ],
    capabilities: ['欧盟合规自查', 'VAT/EPR资质核对', '平台违规风险筛查', '政策红利匹配'],
    kpi: ['合规零违规', '政策红利100%申领', '资质审核零差错', '风险提前预警率100%'],
  },
  product: {
    id: 'product',
    name: 'AI选品爆品专员',
    position: '增长核心岗',
    description: '趋势挖掘、爆款筛选、竞品分析、测品规划，精准孵化欧洲刚需爆品',
    responsibilities: [
      '依托平台GMV MAX测品工具，挖掘EU4核心、EU8新兴站点热门类目',
      '分析标杆店铺爆款逻辑',
      '筛选轻小件、高利润、低合规门槛产品',
      '输出每日选品清单、避坑清单',
      '制定新品上架与测品计划',
    ],
    capabilities: ['GMV MAX测品', '欧洲站点趋势热搜', '竞品爆款拆解', '利润核算选品'],
    kpi: ['月产出爆款2-5款', '选品试错率低于20%', '单品净利润率达标10%+'],
  },
  content: {
    id: 'content',
    name: 'AI内容达人专员',
    position: '种草转化岗',
    description: '本土化内容创作、达人匹配、素材迭代、种草引流',
    responsibilities: [
      '按德、法、西、波兰等区域本土化风格，生成短视频脚本、直播话术、产品文案',
      '筛选垂直类目本土达人',
      '制定寄样计划',
      '优化种草素材',
      '复盘内容曝光与转化数据',
    ],
    capabilities: ['多语种本土化文案生成', '区域风格脚本模板', '达人匹配筛选', '寄样激励核算'],
    kpi: ['素材曝光达标', '达人匹配精准', '寄样激励足额申领', '内容转化率稳步提升'],
  },
  ads: {
    id: 'ads',
    name: 'AI投放运营专员',
    position: '盈利提效岗',
    description: '广告投放、预算管控、ROI优化、流量承接、活动落地',
    responsibilities: [
      '申领平台广告金、优惠券资源',
      '搭建投放计划',
      '动态调整预算',
      '优化素材投放ROI',
      '跟进新商家任务、扩店激励任务',
      '叠加大促前置预热策略',
      '核算投放成本与净利润',
    ],
    capabilities: ['广告金申领提醒', '动态佣金优化', '大促前置预热', '投放ROI监控'],
    kpi: ['投放ROI正向', '广告金利用率100%', '大促活动落地率100%', '佣金成本最优'],
  },
  shop: {
    id: 'shop',
    name: 'AI店铺运营专员',
    position: '基础履约岗',
    description: '店铺日常运维、商品管理、订单跟进、基础数据复盘',
    responsibilities: [
      '完成新店15天5品上架、14天3品上架低佣任务',
      '优化商品标题、详情、库存',
      '监控店铺数据',
      '处理基础售后问题',
      '跟进本地仓履约进度',
      '保障店铺权重稳定',
    ],
    capabilities: ['商品上架合规模板', '库存监控', '店铺权重维护', '新手任务进度追踪'],
    kpi: ['新手任务按时完成', '商品上架合规率100%', '店铺权重稳定', '履约零超时'],
  },
  data: {
    id: 'data',
    name: 'AI数据复盘专员',
    position: '迭代优化岗',
    description: '全维度数据统计、问题诊断、策略迭代、盈利分析',
    responsibilities: [
      '统计店铺GMV、佣金成本、投放成本、转化率、单品利润率',
      '拆解爆款数据模型',
      '排查低转化问题',
      '核算平台补贴收益',
      '输出每日数据报表、每周迭代方案',
    ],
    capabilities: ['单品利润拆解模型', '全链路成本分析', '数据异常诊断', '周报月报自动生成'],
    kpi: ['数据报表零差错', '问题诊断精准', '迭代方案落地有效', '成本持续优化'],
  },
  expand: {
    id: 'expand',
    name: 'AI招商拓店专员',
    position: '规模增量岗',
    description: '多站点拓店、市场布局、资源收割、矩阵搭建',
    responsibilities: [
      '评估EU4/EU8站点入驻资质',
      '制定分层拓店计划',
      '跟进全域低佣政策激活',
      '落地扩店激励任务',
      '搭建多店铺统一后台管理体系',
    ],
    capabilities: ['多站点资质匹配', '全域低佣政策激活', '拓店激励核算'],
    kpi: ['拓店进度达标', '全域低佣政策全覆盖', '扩店激励足额领取'],
  },
};

export const REGION_STYLES = {
  DE: { name: '德国', style: '硬核测评', keywords: ['品质', '技术', '专业', '耐用'] },
  FR: { name: '法国', style: '质感氛围感', keywords: ['优雅', '精致', '设计', '品味'] },
  ES: { name: '西班牙', style: '生活化场景', keywords: ['热情', '家庭', '实用', '实惠'] },
  PL: { name: '波兰', style: '性价比种草', keywords: ['便宜', '实用', '高性价比', '超值'] },
  UK: { name: '英国', style: '简约实用', keywords: ['简约', '实用', '品质', '经典'] },
  IT: { name: '意大利', style: '时尚设计', keywords: ['时尚', '设计', '美观', '独特'] },
};

export const HOT_CATEGORIES = [
  { name: '居家用品', sites: ['DE', 'FR', 'UK'], commission: '低佣优先', profitMargin: '15-30%' },
  { name: '个护美妆', sites: ['DE', 'FR', 'IT', 'ES'], commission: '中等', profitMargin: '20-40%' },
  { name: '3C数码', sites: ['DE', 'UK', 'PL'], commission: '中等', profitMargin: '10-25%' },
  { name: '家居收纳', sites: ['DE', 'FR', 'ES', 'PL'], commission: '低佣', profitMargin: '15-25%' },
  { name: '户外运动', sites: ['DE', 'FR', 'UK'], commission: '中等', profitMargin: '15-30%' },
  { name: '母婴用品', sites: ['DE', 'FR', 'UK'], commission: '低佣', profitMargin: '15-30%' },
  { name: '宠物用品', sites: ['DE', 'FR', 'UK', 'ES'], commission: '低佣', profitMargin: '15-35%' },
];

export const DAILY_SOP = [
  { step: 1, role: 'leader', action: '下发当日任务', description: '上架、测品、投放、合规自查、素材更新' },
  { step: 2, role: 'product', action: '输出当日测品清单', description: 'AI选品专员输出测品清单，AI店铺运营完成商品合规上架' },
  { step: 3, role: 'content', action: '输出本土化素材', description: 'AI内容达人专员输出素材，AI投放专员搭建投放计划、申领平台补贴' },
  { step: 4, role: 'compliance', action: '全链路合规审核', description: '审核商品、素材、投放合规性，规避风险' },
  { step: 5, role: 'data', action: '统计当日数据', description: '输出问题清单与优化建议' },
  { step: 6, role: 'leader', action: '汇总当日工作', description: '调整次日运营策略' },
];

export const WEEKLY_SOP = [
  { step: 1, role: 'product', action: '复盘爆款数据', description: '更新趋势选品库，淘汰低效产品' },
  { step: 2, role: 'content', action: '联合优化素材', description: 'AI内容&投放专员联合优化高ROI素材与投放模型' },
  { step: 3, role: 'expand', action: '评估站点增量', description: '推进EU8蓝海站点扩店布局' },
  { step: 4, role: 'leader', action: '激励政策复盘', description: '全岗位联动复盘平台激励政策完成进度' },
];

export const MONTHLY_SOP = [
  { step: 1, role: 'compliance', action: '全面合规体检', description: '更新资质、排查违规风险' },
  { step: 2, role: 'data', action: '核算整体利润', description: '成本结构、补贴收益，优化成本模型' },
  { step: 3, role: 'leader', action: '制定下月规划', description: '上新、拓店、大促备战整体规划' },
];

export const TOOLS = {
  general: ['专属知识库', '任务调度系统', '数据汇总看板'],
  compliance: ['欧盟合规自查工具', 'VAT/EPR资质核对工具', '平台违规风险筛查工具', '政策红利匹配计算器'],
  product: ['平台GMV MAX测品工具', '欧洲站点趋势热搜工具', '竞品爆款拆解工具', '利润核算选品工具'],
  content: ['多语种本土化文案生成', '区域风格脚本模板', '达人匹配筛选工具', '寄样激励核算工具'],
  ads: ['广告金申领提醒', '动态佣金优化工具', '大促前置预热工具', '投放ROI监控工具'],
  shop: ['商品上架合规模板', '库存监控工具', '店铺权重维护工具', '新手任务进度追踪工具'],
  data: ['单品利润拆解模型', '全链路成本分析工具', '数据异常诊断工具', '周报月报自动生成工具'],
  expand: ['多站点资质匹配工具', '全域低佣政策激活工具', '拓店激励核算工具'],
};

export const KPI_STANDARDS = {
  compliance: {
    zeroViolation: true,
    policyBenefitRate: 100,
    qualificationAccuracy: 100,
    riskWarningRate: 100,
  },
  product: {
    monthlyBestsellers: [2, 5],
    trialErrorRate: 20,
    profitMargin: 10,
  },
  content: {
    exposureTarget: '达标',
    influencerMatchAccuracy: '精准',
    sampleIncentiveRate: 100,
    conversionRateTrend: '稳步提升',
  },
  ads: {
    roiPositive: true,
    adFundUtilization: 100,
    promotionCompletion: 100,
    commissionCostOptimal: true,
  },
  shop: {
    newbieTaskCompletion: '按时',
    complianceRate: 100,
    shopWeightStable: true,
    fulfillmentOnTime: true,
  },
  data: {
    reportAccuracy: 100,
    diagnosisAccuracy: '精准',
    iterationEffectiveness: '有效',
    costOptimization: '持续优化',
  },
  expand: {
    expansionProgress: '达标',
    lowCommissionCoverage: 100,
    incentiveCollection: 100,
  },
};

export const IMPLEMENTATION_STEPS = [
  { day: 1, title: '岗位搭建&知识库部署', description: '完成8大AI角色定岗，录入TikTok欧洲全部政策、合规规则、爆款类目、成本模型' },
  { day: 2, title: '工具配置&权限开通', description: '为各AI岗位匹配专属工具、指令模板、输出标准，打通任务调度与数据看板' },
  { day: 3, title: '协作SOP落地试运行', description: '启动日度协作流程，全岗位试运行，排查流程卡点、输出偏差问题' },
  { day: 4, title: '考核体系落地', description: '配置各岗位KPI考核标准、迭代规则、人工干预机制' },
  { day: 5, title: '全链路实战跑通', description: '落地选品、上架、内容、投放、合规、复盘全流程实战' },
  { day: 6, title: '全链路实战跑通', description: '收割平台基础红利，优化流程细节' },
  { day: 7, title: '体系优化&长效运转', description: '复盘试运行问题，优化岗位分工与协作流程，实现AI团队24小时自主长效运转' },
];

export const VALUE_PROPOSITIONS = [
  { title: '降本', description: '替代80%人工运营、选品、合规、复盘工作，大幅降低人力成本' },
  { title: '提效', description: '24小时不间断作业，流程标准化、无遗漏、无拖延，快速收割平台政策红利' },
  { title: '增收', description: '精准选品、最优投放、合规零风险，持续拉高单品净利润与店铺GMV' },
  { title: '稳盘', description: '全链路合规风控，规避平台处罚，支撑多站点矩阵规模化扩张' },
];
