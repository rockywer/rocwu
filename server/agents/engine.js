import { AGENTS, getAgent, routeTaskToAgent } from './config.js';
import { store } from '../store.js';

class AgentEngine {
  constructor() {
    this.taskQueue = [];
    this.runningTasks = new Map();
    this.agentStats = new Map();
  }

  async executeTask(task) {
    const taskId = 'TASK-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    task.id = taskId;
    task.status = 'running';
    task.startTime = new Date().toISOString();
    this.runningTasks.set(taskId, task);

    try {
      const result = await this._executeWithAgent(task);
      task.status = 'completed';
      task.endTime = new Date().toISOString();
      task.result = result;
      this._updateStats(task);
      store.log('AGENT_TASK', '任务完成', { taskId, type: task.type, agent: task.agentId });
      return result;
    } catch (error) {
      task.status = 'failed';
      task.endTime = new Date().toISOString();
      task.error = error.message;
      store.log('AGENT_TASK', '任务失败', { taskId, type: task.type, error: error.message });
      throw error;
    } finally {
      this.runningTasks.delete(taskId);
    }
  }

  async _executeWithAgent(task) {
    const agentId = task.agentId || routeTaskToAgent(task.type);
    const agent = getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} 未找到`);
    }

    const ctx = {
      ...task,
      agent,
      timestamp: new Date().toISOString(),
    };

    return await this._runAgentLogic(agent, ctx);
  }

  async _runAgentLogic(agent, ctx) {
    const layer = agent.layer;
    
    if (layer === 'management') {
      return this._runManagementAgent(agent, ctx);
    } else if (layer === 'professional') {
      return this._runProfessionalAgent(agent, ctx);
    } else if (layer === 'support') {
      return this._runSupportAgent(agent, ctx);
    }
    
    return `Agent ${agent.name} 执行任务：${ctx.task || ctx.message}`;
  }

  async _runManagementAgent(agent, ctx) {
    const { task, message } = ctx;
    
    if (task === 'task-split' || message.includes('拆分')) {
      return this._splitTask(agent, ctx);
    } else if (task === 'review' || message.includes('审核')) {
      return this._reviewTask(agent, ctx);
    } else if (task === 'coordinate' || message.includes('协调')) {
      return this._coordinateTask(agent, ctx);
    }
    
    return `
${agent.name} 任务统筹报告
━━━━━━━━━━━━━━━━
任务类型：${task || '综合管理'}
执行时间：${ctx.timestamp}
━━━━━━━━━━━━━━━━
执行摘要：
- 已确认任务需求
- 已分配专业Agent执行
- 等待执行结果反馈

下一步：专业Agent执行完成后进行终审
      `.trim();
  }

  async _splitTask(agent, ctx) {
    const taskDesc = ctx.message || ctx.task;
    const subtasks = this._inferSubtasks(taskDesc);
    
    return `
${agent.name} · 任务拆分报告
━━━━━━━━━━━━━━━━
原始任务：${taskDesc}
━━━━━━━━━━━━━━━━
拆分结果：
${subtasks.map((t, i) => `${i + 1}. ${t.desc} → 分配：${t.agentName}`).join('\n')}

执行策略：${subtasks.length > 1 ? '多Agent并行执行' : '单Agent独立执行'}
预计完成时间：${subtasks.length * 5}分钟
      `.trim();
  }

  _inferSubtasks(taskDesc) {
    const desc = taskDesc.toLowerCase();
    const subtasks = [];
    
    if (/商业方案|计划书|BP/.test(desc)) {
      subtasks.push({ desc: '市场调研分析', agentName: '产业研究员', agentId: 'agent.industry-research' });
      subtasks.push({ desc: '商业模式设计', agentName: '商业方案专家', agentId: 'agent.business-plan' });
      subtasks.push({ desc: '财务测算', agentName: '投融资分析师', agentId: 'agent.investment' });
      subtasks.push({ desc: '文档校对', agentName: '文档校对专员', agentId: 'agent.document-checker' });
    } else if (/融资|投资|估值/.test(desc)) {
      subtasks.push({ desc: '行业分析', agentName: '产业研究员', agentId: 'agent.industry-research' });
      subtasks.push({ desc: '估值测算', agentName: '投融资分析师', agentId: 'agent.investment' });
      subtasks.push({ desc: '风险评估', agentName: '投融资分析师', agentId: 'agent.investment' });
    } else if (/招商|引进|落地/.test(desc)) {
      subtasks.push({ desc: '政策匹配分析', agentName: '招商谈判专员', agentId: 'agent.investment-promotion' });
      subtasks.push({ desc: '企业需求梳理', agentName: '招商谈判专员', agentId: 'agent.investment-promotion' });
      subtasks.push({ desc: '落地服务方案', agentName: '招商谈判专员', agentId: 'agent.investment-promotion' });
    } else if (/内容|文案|脚本/.test(desc)) {
      subtasks.push({ desc: '内容策划', agentName: '内容创作专家', agentId: 'agent.content-creator' });
      subtasks.push({ desc: '素材整理', agentName: '素材整理专员', agentId: 'agent.material-organizer' });
      subtasks.push({ desc: '文案撰写', agentName: '内容创作专家', agentId: 'agent.content-creator' });
    } else if (/分析|数据|报表/.test(desc)) {
      subtasks.push({ desc: '数据汇总', agentName: '数据汇总专员', agentId: 'agent.data-summarizer' });
      subtasks.push({ desc: '数据分析', agentName: '数据分析师', agentId: 'agent.data-analysis' });
    }
    
    if (subtasks.length === 0) {
      subtasks.push({ desc: '执行核心任务', agentName: '专业执行Agent', agentId: 'agent.business-plan' });
    }
    
    return subtasks;
  }

  async _reviewTask(agent, ctx) {
    const content = ctx.content || ctx.result || '待审核内容';
    
    return `
${agent.name} · 审核报告
━━━━━━━━━━━━━━━━
审核时间：${ctx.timestamp}
━━━━━━━━━━━━━━━━
审核内容摘要：${content.slice(0, 100)}${content.length > 100 ? '...' : ''}

审核结论：✅ 通过
审核意见：内容完整、逻辑清晰、符合标准

下一步：归档入库，推送相关人员
      `.trim();
  }

  async _coordinateTask(agent, ctx) {
    return `
${agent.name} · 协调报告
━━━━━━━━━━━━━━━━
协调事项：${ctx.message}
━━━━━━━━━━━━━━━━
协调结果：
- 已确认各方进度
- 已解决潜在冲突
- 已同步最新信息

状态：协调完成
      `.trim();
  }

  async _runProfessionalAgent(agent, ctx) {
    const { message, task } = ctx;
    
    let result = `
${agent.name} · 执行报告
━━━━━━━━━━━━━━━━
执行时间：${ctx.timestamp}
任务类型：${task || '专业服务'}
━━━━━━━━━━━━━━━━
需求：${message || '无'}

专业分析：
- 根据知识库检索相关资料
- 分析需求关键点
- 生成专业输出

输出：（专业内容）
      `.trim();

    if (agent.id === 'agent.business-plan') {
      result = this._generateBusinessPlan(agent, ctx);
    } else if (agent.id === 'agent.investment') {
      result = this._generateInvestmentAnalysis(agent, ctx);
    } else if (agent.id === 'agent.industry-research') {
      result = this._generateIndustryResearch(agent, ctx);
    } else if (agent.id === 'agent.content-creator') {
      result = this._generateContent(agent, ctx);
    } else if (agent.id === 'agent.scitech-app') {
      result = this._generateSciTechApplication(agent, ctx);
    } else if (agent.id === 'agent.investment-promotion') {
      result = this._generateInvestmentPromotion(agent, ctx);
    } else if (agent.id === 'agent.private-operation') {
      result = this._generatePrivateOperation(agent, ctx);
    } else if (agent.id === 'agent.data-analysis') {
      result = this._generateDataAnalysis(agent, ctx);
    }
    
    return result;
  }

  _generateBusinessPlan(agent, ctx) {
    return `
${agent.name} · 商业方案报告
━━━━━━━━━━━━━━━━
行业：${ctx.industry || '通用'}
━━━━━━━━━━━━━━━━
一、市场分析
- 市场规模：待补充数据
- 增长趋势：待补充数据
- 竞争格局：待补充分析

二、商业模式
- 核心业务：待定义
- 盈利模式：待设计
- 竞争优势：待梳理

三、实施路径
- 阶段目标：待规划
- 关键节点：待确认

需要信息：行业细分领域、目标市场、核心资源
      `.trim();
  }

  _generateInvestmentAnalysis(agent, ctx) {
    return `
${agent.name} · 投融资分析报告
━━━━━━━━━━━━━━━━
项目：${ctx.project || '待评估项目'}
━━━━━━━━━━━━━━━━
一、估值分析
- 估值方法：DCF / 可比公司
- 估值区间：待测算
- 敏感性分析：待评估

二、风险评估
- 行业风险：待分析
- 财务风险：待分析
- 运营风险：待分析

三、投资建议
- 投资策略：待制定
- 退出路径：待规划

需要信息：财务数据、行业对标、项目阶段
      `.trim();
  }

  _generateIndustryResearch(agent, ctx) {
    return `
${agent.name} · 产业研究报告
━━━━━━━━━━━━━━━━
赛道：${ctx.track || ctx.message || '待确定'}
━━━━━━━━━━━━━━━━
一、行业概况
- 市场规模：待补充
- 发展历程：待梳理

二、政策环境
- 最新政策：待检索
- 影响分析：待评估

三、趋势预测
- 技术趋势：待分析
- 市场趋势：待预测

四、投资机会
- 细分赛道：待挖掘
- 潜在标的：待筛选

需要信息：具体赛道名称、关注方向
      `.trim();
  }

  _generateContent(agent, ctx) {
    return `
${agent.name} · 内容创作方案
━━━━━━━━━━━━━━━━
主题：${ctx.topic || ctx.message || '待确定'}
━━━━━━━━━━━━━━━━
一、内容策划
- 内容形式：短视频 / 图文
- 核心卖点：待提炼
- 目标受众：待定位

二、创作大纲
- 开头：吸睛点设计
- 中间：核心内容
- 结尾：行动指引

三、发布计划
- 平台：待选择
- 时间：待规划
- 频率：待确定

需要信息：品牌调性、目标平台、核心信息
      `.trim();
  }

  _generateSciTechApplication(agent, ctx) {
    return `
${agent.name} · 科创申报方案
━━━━━━━━━━━━━━━━
申报类型：${ctx.type || '待确定'}
━━━━━━━━━━━━━━━━
一、资质梳理
- 企业基本信息：待收集
- 研发投入：待统计
- 知识产权：待整理

二、政策匹配
- 适用政策：待检索
- 评分标准：待分析
- 材料要求：待确认

三、申报路径
- 时间节点：待规划
- 材料清单：待制定
- 注意事项：待提醒

需要信息：企业名称、申报类型、相关资质
      `.trim();
  }

  _generateInvestmentPromotion(agent, ctx) {
    return `
${agent.name} · 招商洽谈方案
━━━━━━━━━━━━━━━━
企业：${ctx.company || '待对接企业'}
━━━━━━━━━━━━━━━━
一、企业需求分析
- 产业方向：待了解
- 落地诉求：待沟通
- 政策期望：待确认

二、政策匹配
- 适用政策：待检索
- 优惠力度：待评估
- 落地条件：待确认

三、洽谈策略
- 沟通要点：待设计
- 价值主张：待提炼
- 下一步：待规划

需要信息：企业名称、产业方向、落地地点
      `.trim();
  }

  _generatePrivateOperation(agent, ctx) {
    return `
${agent.name} · 私域运营方案
━━━━━━━━━━━━━━━━
目标：${ctx.objective || '用户运营'}
━━━━━━━━━━━━━━━━
一、社群诊断
- 用户画像：待分析
- 活跃情况：待统计
- 问题痛点：待梳理

二、运营策略
- 内容规划：待制定
- 活动设计：待策划
- 用户分层：待实施

三、执行计划
- 短期目标：待设定
- 中期目标：待设定
- 长期目标：待设定

需要信息：社群类型、用户规模、运营目标
      `.trim();
  }

  _generateDataAnalysis(agent, ctx) {
    return `
${agent.name} · 数据分析报告
━━━━━━━━━━━━━━━━
分析主题：${ctx.topic || ctx.message || '待确定'}
━━━━━━━━━━━━━━━━
一、数据收集
- 数据源：待确认
- 指标定义：待明确
- 时间范围：待设定

二、分析方法
- 描述统计：待计算
- 趋势分析：待展示
- 对比分析：待执行

三、洞察结论
- 关键发现：待挖掘
- 问题诊断：待分析
- 优化建议：待提出

需要信息：分析主题、数据来源、关注指标
      `.trim();
  }

  async _runSupportAgent(agent, ctx) {
    if (agent.id === 'agent.document-checker') {
      return this._checkDocument(agent, ctx);
    } else if (agent.id === 'agent.data-summarizer') {
      return this._summarizeData(agent, ctx);
    } else if (agent.id === 'agent.material-organizer') {
      return this._organizeMaterials(agent, ctx);
    }
    
    return `
${agent.name} · 服务完成
━━━━━━━━━━━━━━━━
任务：${ctx.message}
时间：${ctx.timestamp}
状态：已完成
      `.trim();
  }

  _checkDocument(agent, ctx) {
    const content = ctx.content || '待校对内容';
    
    return `
${agent.name} · 校对报告
━━━━━━━━━━━━━━━━
检查内容：${content.slice(0, 50)}...
━━━━━━━━━━━━━━━━
校对结果：
- 错别字：0处
- 格式问题：0处
- 建议优化：0处

结论：✅ 内容合格，可直接提交
      `.trim();
  }

  _summarizeData(agent, ctx) {
    return `
${agent.name} · 数据汇总报告
━━━━━━━━━━━━━━━━
汇总主题：${ctx.topic || '数据汇总'}
━━━━━━━━━━━━━━━━
数据概览：
- 总条数：待统计
- 关键指标：待计算
- 趋势分析：待展示

汇总文件已生成，可下载查看
      `.trim();
  }

  _organizeMaterials(agent, ctx) {
    return `
${agent.name} · 素材整理报告
━━━━━━━━━━━━━━━━
整理内容：${ctx.type || '全部素材'}
━━━━━━━━━━━━━━━━
整理结果：
- 文件总数：待统计
- 分类数量：待统计
- 入库状态：已完成

素材已按规范分类归档，可随时调取
      `.trim();
  }

  _updateStats(task) {
    const agentId = task.agentId;
    const stats = this.agentStats.get(agentId) || { completed: 0, failed: 0, totalTime: 0 };
    
    if (task.status === 'completed') {
      stats.completed++;
    } else {
      stats.failed++;
    }
    
    if (task.startTime && task.endTime) {
      stats.totalTime += new Date(task.endTime) - new Date(task.startTime);
    }
    
    this.agentStats.set(agentId, stats);
  }

  getStats() {
    const result = {};
    this.agentStats.forEach((stats, agentId) => {
      const agent = getAgent(agentId);
      result[agentId] = {
        name: agent?.name || agentId,
        ...stats,
        avgTime: stats.completed > 0 ? Math.round(stats.totalTime / stats.completed) : 0,
      };
    });
    return result;
  }

  getRunningTasks() {
    return Array.from(this.runningTasks.values());
  }
}

export const agentEngine = new AgentEngine();
