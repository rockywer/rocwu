const text = '朋友圈日报';
const t = text.toLowerCase();
let matched = false;

// 逐条检查（和 gateway.js routeIntent 顺序一致）
if (/(入会|加入|申请|怎么成为|审核|激活|续费|年费|缴费)/.test(text)) { console.log('MATCH: member.lifecycle'); matched=true; }
if (/(研究院|产业研究|研报|白皮书|产融沙龙|路演日|项目路演|峰会|上市培育|资本运作|北交所|IPO培育|并购峰会|资本年会|年度活动|产融私董会)/.test(text)) { console.log('MATCH: institute.capital'); matched=true; }
if (/(报名|预约|签到|参加|参与)/.test(text)) { console.log('MATCH: scheduler'); matched=true; }
if (/(产业资本|资本板块|融资上市|并购重组)/.test(text)) { console.log('MATCH: board.capital'); matched=true; }
if (/(高尔夫|网球|联赛|赛事)/.test(text)) { console.log('MATCH: board.detail sports'); matched=true; }
if (/(非遗|手作|青瓷|木雕|文创孵化)/.test(text)) { console.log('MATCH: board.detail intangible'); matched=true; }
if (/(国学|论道|禅修|古址|儒释道)/.test(text)) { console.log('MATCH: board.detail guoxue'); matched=true; }
if (/(康养|体检|名医|中医|抗衰|慢病|疗愈)/.test(text)) { console.log('MATCH: board.detail health'); matched=true; }
if (/(农文旅|康养旅居|田园|森林疗愈|有机食材|乡村振兴)/.test(text)) { console.log('MATCH: board.detail agritourism'); matched=true; }
if (/(家族|遗嘱|信托|资产隔离|继承)/.test(text)) { console.log('MATCH: board.detail inheritance'); matched=true; }
if (/(资本|融资上市|并购|市值管理|Pre-IPO)/.test(text)) { console.log('MATCH: board.capital info'); matched=true; }
if (/(科研|中科院|浙大|之江实验室|中试|联合实验室|成果转化)/.test(text)) { console.log('MATCH: board.detail research'); matched=true; }
if (/(产业规划|招商|园区|飞地|返乡投资|产城融合)/.test(text)) { console.log('MATCH: board.detail localplan'); matched=true; }
if (/(专精特新|小巨人|单项冠军|高新培育|科创梯度)/.test(text)) { console.log('MATCH: board.detail kechuang'); matched=true; }
if (/(跨境|出海|外贸|汇率|国际展会|海外客商)/.test(text)) { console.log('MATCH: board.detail crossborder'); matched=true; }
if (/(新生代|企二代|青年创业|接班特训|跨代对话)/.test(text)) { console.log('MATCH: board.detail newgen'); matched=true; }
if (/(品牌|创始人IP|新媒体|短视频|舆情|公关|曝光)/.test(text)) { console.log('MATCH: board.detail brand'); matched=true; }
if (/(私行|全球资产|财富配置|家族信托|高净值)/.test(text)) { console.log('MATCH: board.detail wealth'); matched=true; }
if (/(低空经济|无人机|未来产业|新质生产力|元宇宙|前沿科技)/.test(text)) { console.log('MATCH: board.detail lowaltitude'); matched=true; }
if (/(人工智能|AI赋能|大模型|数字化|智能体|数字员工|企业AI|AI转型|AI落地|AI应用|AI实战|算力中心)/.test(text)) { console.log('MATCH: board.detail aidigit'); matched=true; }
if (/(对接|商机|投融资|融资|产学研|政企|合作|资源)/.test(text)) { console.log('MATCH: resource.match'); matched=true; }
if (/(学院|课程|大课|私董会|研学|标杆参访|股权架构|财税合规|企业传承)/.test(text)) { console.log('MATCH: board.academy'); matched=true; }
if (/(有哪些板块|全体系|服务体系|所有板块|17大|17 大)/.test(text)) { console.log('MATCH: board.detail list'); matched=true; }
if (/(权益|区别|VIP|SVIP|理事|会员等级)/.test(text)) { console.log('MATCH: scheduler rights'); matched=true; }
if (/(企业库|企业信息|找企业|符合条件的企业|企业名录|有哪些企业|推荐企业|浙江企业|浙商企业|硬科技企业|新材料企业|新能源企业|大健康企业|农文旅企业|会员企业|SVIP企业|理事企业|VIP企业|企业有哪些|企业推荐|企业名单)/.test(text)) { console.log('MATCH: company.library'); matched=true; }
if (/(朋友圈|商机提取|舆情预警|素材归档|日报简报|竞品动态|导出.*(Excel|PDF|CSV))/i.test(text)) { console.log('MATCH: wechat.moments'); matched=true; }
if (/(复盘|报告|统计|数据)/.test(text)) { console.log('MATCH: report.daily'); matched=true; }
if (!matched) console.log('NO MATCH - default to kb.answer');
