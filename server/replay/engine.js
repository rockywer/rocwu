import { store } from '../store.js';
import { agentEngine } from '../agents/engine.js';
import { workflowEngine } from '../workflows/engine.js';

class ReplayEngine {
  constructor() {
    this.iterationHistory = [];
  }

  async executeReplay(scope = 'all') {
    const records = [];
    
    if (scope === 'all' || scope === 'result') {
      const resultRecord = await this._replayResult();
      records.push(resultRecord);
    }
    
    if (scope === 'all' || scope === 'agent') {
      const agentRecords = await this._replayAgents();
      records.push(...agentRecords);
    }
    
    if (scope === 'all' || scope === 'workflow') {
      const workflowRecord = await this._replayWorkflows();
      records.push(workflowRecord);
    }

    const summary = this._generateSummary(records);
    
    if (records.length > 0) {
      store.addReplayRecord({
        type: 'full',
        scope,
        records,
        summary,
        timestamp: new Date().toISOString(),
      });
      
      await this._autoIterate(records);
    }

    return { records, summary };
  }

  async _replayResult() {
    const workflows = workflowEngine.listCompletedWorkflows();
    const recent = workflows.slice(-10);
    
    const metrics = {
      total: recent.length,
      completed: recent.filter((w) => w.status === 'completed').length,
      avgDuration: 0,
      qualityScore: 0,
      issues: [],
    };

    if (recent.length > 0) {
      const totalDuration = recent.reduce((sum, w) => {
        if (w.startTime && w.endTime) {
          return sum + (new Date(w.endTime) - new Date(w.startTime));
        }
        return sum;
      }, 0);
      metrics.avgDuration = Math.round(totalDuration / recent.length / 1000);
      
      metrics.qualityScore = this._calculateQualityScore(recent);
      
      metrics.issues = this._identifyIssues(recent);
    }

    return {
      type: 'result',
      metrics,
      recentWorkflows: recent.map((w) => ({
        id: w.id,
        name: w.name,
        status: w.status,
        duration: w.startTime && w.endTime ? Math.round((new Date(w.endTime) - new Date(w.startTime)) / 1000) : 0,
        steps: w.steps?.length || 0,
      })),
    };
  }

  _calculateQualityScore(workflows) {
    let score = 100;
    
    workflows.forEach((w) => {
      if (w.status === 'failed') score -= 20;
      
      const failedSteps = w.steps?.filter((s) => s.status === 'failed')?.length || 0;
      score -= failedSteps * 5;
    });
    
    return Math.max(0, score);
  }

  _identifyIssues(workflows) {
    const issues = [];
    
    workflows.forEach((w) => {
      w.steps?.forEach((s) => {
        if (s.status === 'failed') {
          issues.push({
            workflowId: w.id,
            stepId: s.id,
            agentId: s.agentId,
            error: s.error,
          });
        }
      });
    });
    
    return issues;
  }

  async _replayAgents() {
    const stats = agentEngine.getStats();
    const records = [];
    
    Object.entries(stats).forEach(([agentId, stat]) => {
      const efficiency = stat.completed > 0 ? Math.round((stat.completed / (stat.completed + stat.failed)) * 100) : 0;
      const avgTime = stat.avgTime;
      
      const issues = [];
      if (stat.failed > 0) issues.push('存在失败任务');
      if (avgTime > 30000) issues.push('响应时间过长');
      if (efficiency < 80) issues.push('效率偏低');
      
      records.push({
        type: 'agent',
        agentId,
        agentName: stat.name,
        efficiency,
        avgTime: Math.round(avgTime),
        completed: stat.completed,
        failed: stat.failed,
        issues,
      });
    });
    
    return records;
  }

  async _replayWorkflows() {
    const templates = workflowEngine.listWorkflowTemplates();
    const completed = workflowEngine.listCompletedWorkflows();
    
    const records = [];
    
    templates.forEach((template) => {
      const templateCompleted = completed.filter((w) => w.templateId === template.id.replace('workflow.', ''));
      const avgDuration = templateCompleted.length > 0
        ? Math.round(templateCompleted.reduce((sum, w) => {
          if (w.startTime && w.endTime) {
            return sum + (new Date(w.endTime) - new Date(w.startTime));
          }
          return sum;
        }, 0) / templateCompleted.length / 1000)
        : 0;
      
      const steps = template.steps || [];
      const potentialOptimizations = [];
      
      if (steps.length > 5) potentialOptimizations.push('步骤过多，可合并');
      if (avgDuration > 60) potentialOptimizations.push('执行时间过长');
      
      records.push({
        type: 'workflow',
        workflowId: template.id,
        workflowName: template.name,
        stepCount: steps.length,
        completedCount: templateCompleted.length,
        avgDuration,
        potentialOptimizations,
      });
    });
    
    return {
      type: 'workflow_overview',
      totalTemplates: templates.length,
      totalCompleted: completed.length,
      details: records,
    };
  }

  _generateSummary(records) {
    const resultRecord = records.find((r) => r.type === 'result');
    const agentRecords = records.filter((r) => r.type === 'agent');
    const workflowRecord = records.find((r) => r.type === 'workflow_overview');
    
    let summary = '📊 AI 虚拟团队复盘报告\n';
    summary += `━━━━━━━━━━━━━━━━\n`;
    summary += `生成时间：${new Date().toLocaleString('zh-CN')}\n`;
    summary += `━━━━━━━━━━━━━━━━\n`;
    
    if (resultRecord) {
      summary += `【成果复盘】\n`;
      summary += `- 最近10个任务：${resultRecord.metrics.completed}/${resultRecord.metrics.total}\n`;
      summary += `- 平均耗时：${resultRecord.metrics.avgDuration}秒\n`;
      summary += `- 质量评分：${resultRecord.metrics.qualityScore}分\n`;
      if (resultRecord.metrics.issues.length > 0) {
        summary += `- 问题数量：${resultRecord.metrics.issues.length}\n`;
      }
    }
    
    if (agentRecords.length > 0) {
      summary += `\n【Agent岗位复盘】\n`;
      agentRecords.forEach((r) => {
        summary += `- ${r.agentName}：完成${r.completed}次，效率${r.efficiency}%\n`;
        if (r.issues.length > 0) {
          summary += `  问题：${r.issues.join('、')}\n`;
        }
      });
    }
    
    if (workflowRecord) {
      summary += `\n【工作流流程复盘】\n`;
      summary += `- 已注册工作流：${workflowRecord.totalTemplates}个\n`;
      summary += `- 已完成实例：${workflowRecord.totalCompleted}个\n`;
      workflowRecord.details.forEach((d) => {
        if (d.potentialOptimizations.length > 0) {
          summary += `- ${d.workflowName}：${d.potentialOptimizations.join('、')}\n`;
        }
      });
    }
    
    summary += `\n━━━━━━━━━━━━━━━━\n`;
    summary += `自动迭代：已执行\n`;
    
    return summary;
  }

  async _autoIterate(records) {
    records.forEach((record) => {
      if (record.type === 'agent' && record.issues.length > 0) {
        this._optimizeAgent(record);
      }
      
      if (record.type === 'workflow_overview') {
        record.details.forEach((detail) => {
          if (detail.potentialOptimizations.length > 0) {
            this._optimizeWorkflow(detail);
          }
        });
      }
    });
    
    if (records.some((r) => r.type === 'result' && r.metrics.qualityScore < 80)) {
      this._updateKnowledge(records);
    }
  }

  _optimizeAgent(record) {
    store.log('REPLAY', 'Agent优化', { agentId: record.agentId, issues: record.issues });
    
    if (record.issues.includes('响应时间过长')) {
      store.addKnowledge({
        title: `${record.agentName} 响应优化建议`,
        content: `发现 ${record.agentName} 响应时间超过30秒，建议：
1. 优化检索逻辑
2. 增加缓存机制
3. 简化输出内容`,
        category: 'agent_optimization',
        tags: [record.agentId, 'performance', 'optimization'],
        verified: false,
      });
    }
    
    if (record.issues.includes('效率偏低')) {
      store.addKnowledge({
        title: `${record.agentName} 效率提升建议`,
        content: `发现 ${record.agentName} 效率低于80%，建议：
1. 检查任务分配是否合理
2. 优化执行逻辑
3. 增加错误处理`,
        category: 'agent_optimization',
        tags: [record.agentId, 'efficiency', 'optimization'],
        verified: false,
      });
    }
  }

  _optimizeWorkflow(detail) {
    store.log('REPLAY', '工作流优化', { workflowId: detail.workflowId, optimizations: detail.potentialOptimizations });
    
    if (detail.potentialOptimizations.includes('步骤过多，可合并')) {
      store.addKnowledge({
        title: `${detail.workflowName} 流程优化建议`,
        content: `发现 ${detail.workflowName} 步骤过多（${detail.stepCount}步），建议：
1. 合并相似步骤
2. 并行执行可独立的步骤
3. 简化审核环节`,
        category: 'workflow_optimization',
        tags: [detail.workflowId, 'steps', 'optimization'],
        verified: false,
      });
    }
    
    if (detail.potentialOptimizations.includes('执行时间过长')) {
      store.addKnowledge({
        title: `${detail.workflowName} 性能优化建议`,
        content: `发现 ${detail.workflowName} 平均执行时间超过60秒，建议：
1. 优化各步骤执行效率
2. 增加异步处理
3. 优化数据检索`,
        category: 'workflow_optimization',
        tags: [detail.workflowId, 'performance', 'optimization'],
        verified: false,
      });
    }
  }

  _updateKnowledge(records) {
    const resultRecord = records.find((r) => r.type === 'result');
    if (!resultRecord) return;
    
    store.addKnowledge({
      title: '复盘经验沉淀',
      content: `质量评分：${resultRecord.metrics.qualityScore}分
问题清单：${resultRecord.metrics.issues.length}个问题
建议：根据具体问题进行针对性优化`,
      category: 'replay',
      tags: ['replay', 'experience', 'knowledge'],
      verified: false,
    });
  }

  getIterationHistory() {
    return store.listReplayRecords();
  }

  getReplayReport(scope = 'all') {
    const records = store.listReplayRecords();
    if (records.length === 0) {
      return '暂无复盘记录，请先执行复盘';
    }
    
    const latest = records[records.length - 1];
    return latest.summary;
  }
}

export const replayEngine = new ReplayEngine();
