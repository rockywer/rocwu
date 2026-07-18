import { store } from '../store.js';
import { runSkill } from '../skills/index.js';
import { DAILY_SOP, WEEKLY_SOP, MONTHLY_SOP, AI_ROLES } from '../knowledge.js';

class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.timers = new Map();
    this.registeredWorkflows = {};
    this._registerBuiltinWorkflows();
  }

  _registerBuiltinWorkflows() {
    this.registeredWorkflows = {
      'daily-operation': {
        id: 'workflow.daily-operation',
        name: '日度运营流程',
        description: 'AI总负责人下发任务 → 选品/上架 → 内容/投放 → 合规审核 → 数据复盘 → 汇总调整',
        triggers: ['manual', 'schedule'],
        steps: DAILY_SOP.map((step, idx) => ({
          id: `daily-step-${idx + 1}`,
          role: step.role,
          action: step.action,
          description: step.description,
          skill: `ai.${step.role}`,
        })),
      },
      'weekly-growth': {
        id: 'workflow.weekly-growth',
        name: '周度增长流程',
        description: '爆款复盘 → 素材优化 → 站点扩店 → 激励政策复盘',
        triggers: ['manual', 'schedule'],
        steps: WEEKLY_SOP.map((step, idx) => ({
          id: `weekly-step-${idx + 1}`,
          role: step.role,
          action: step.action,
          description: step.description,
          skill: `ai.${step.role}`,
        })),
      },
      'monthly-plan': {
        id: 'workflow.monthly-plan',
        name: '月度规划流程',
        description: '合规体检 → 利润核算 → 下月规划',
        triggers: ['manual', 'schedule'],
        steps: MONTHLY_SOP.map((step, idx) => ({
          id: `monthly-step-${idx + 1}`,
          role: step.role,
          action: step.action,
          description: step.description,
          skill: `ai.${step.role}`,
        })),
      },
      'product-launch': {
        id: 'workflow.product-launch',
        name: '新品上架流程',
        description: '选品分析 → 合规审核 → 内容创作 → 投放计划 → 上架运营',
        triggers: ['manual'],
        steps: [
          { id: 'product-analyze', role: 'product', action: '选品分析', description: '分析新品市场潜力、竞品情况', skill: 'ai.product' },
          { id: 'compliance-check', role: 'compliance', action: '合规审核', description: '检查新品合规性、资质要求', skill: 'ai.compliance' },
          { id: 'content-create', role: 'content', action: '内容创作', description: '生成本土化素材、视频脚本', skill: 'ai.content' },
          { id: 'ads-plan', role: 'ads', action: '投放计划', description: '制定广告投放方案', skill: 'ai.ads' },
          { id: 'shop-launch', role: 'shop', action: '上架运营', description: '完成商品上架、库存配置', skill: 'ai.shop' },
        ],
      },
      'risk-scan': {
        id: 'workflow.risk-scan',
        name: '风险扫描流程',
        description: '合规检查 → 店铺风险排查 → 问题整改',
        triggers: ['manual', 'schedule'],
        steps: [
          { id: 'compliance-review', role: 'compliance', action: '合规检查', description: '全面检查商品、店铺合规状态', skill: 'ai.compliance' },
          { id: 'risk-detect', role: 'compliance', action: '风险排查', description: '排查违规风险、资质过期等问题', skill: 'ai.compliance' },
          { id: 'data-analysis', role: 'data', action: '数据分析', description: '分析异常数据、低转化问题', skill: 'ai.data' },
        ],
      },
    };
  }

  getWorkflowTemplate(id) {
    return this.registeredWorkflows[id];
  }

  listWorkflowTemplates() {
    return Object.values(this.registeredWorkflows);
  }

  async startWorkflow(workflowId, params = {}) {
    const template = this.registeredWorkflows[workflowId];
    if (!template) {
      throw new Error(`工作流 ${workflowId} 未注册`);
    }

    const instanceId = 'WF-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const instance = {
      id: instanceId,
      templateId: workflowId,
      name: template.name,
      status: 'running',
      params,
      steps: template.steps.map((s) => ({ ...s, status: 'pending', result: null, startTime: null, endTime: null })),
      startTime: new Date().toISOString(),
      currentStep: 0,
    };

    this.workflows.set(instanceId, instance);
    store.log('WORKFLOW', '工作流启动', { instanceId, workflowId });

    await this._executeNextStep(instance);

    return instanceId;
  }

  async _executeNextStep(instance) {
    const template = this.registeredWorkflows[instance.templateId];
    if (!template) return;

    if (instance.currentStep >= instance.steps.length) {
      instance.status = 'completed';
      instance.endTime = new Date().toISOString();
      store.log('WORKFLOW', '工作流完成', { instanceId: instance.id });
      await this._archiveResult(instance);
      return;
    }

    const step = instance.steps[instance.currentStep];
    step.status = 'running';
    step.startTime = new Date().toISOString();

    try {
      const ctx = {
        action: this._getActionForStep(step),
        role: step.role,
        task: step.action,
        description: step.description,
        workflowId: instance.templateId,
        workflowInstanceId: instance.id,
        stepId: step.id,
        params: instance.params,
        previousResults: instance.steps.slice(0, instance.currentStep).map((s) => s.result),
      };

      const result = runSkill(step.skill, ctx);
      step.result = typeof result === 'string' ? result : JSON.stringify(result);
      step.status = 'completed';
      step.endTime = new Date().toISOString();

      store.log('WORKFLOW', '步骤完成', { instanceId: instance.id, stepId: step.id, role: step.role });

      instance.currentStep++;
      await this._executeNextStep(instance);
    } catch (error) {
      step.status = 'failed';
      step.error = error.message;
      step.endTime = new Date().toISOString();
      instance.status = 'failed';
      instance.endTime = new Date().toISOString();

      store.log('WORKFLOW', '步骤失败', { instanceId: instance.id, stepId: step.id, role: step.role, error: error.message });
    }
  }

  _getActionForStep(step) {
    const actionMap = {
      leader: step.action.includes('计划') ? 'daily_plan' : step.action.includes('汇总') ? 'review' : 'overview',
      compliance: step.action.includes('审核') ? 'check_product' : step.action.includes('风险') ? 'risk_scan' : 'policy_update',
      product: step.action.includes('选品') ? 'overview' : step.action.includes('测品') ? 'overview' : 'overview',
      content: step.action.includes('素材') ? 'overview' : step.action.includes('脚本') ? 'overview' : 'overview',
      ads: step.action.includes('投放') ? 'overview' : step.action.includes('计划') ? 'overview' : 'overview',
      shop: step.action.includes('上架') ? 'overview' : step.action.includes('运营') ? 'overview' : 'overview',
      data: step.action.includes('统计') ? 'overview' : step.action.includes('复盘') ? 'overview' : 'overview',
      expand: step.action.includes('拓店') ? 'overview' : step.action.includes('评估') ? 'overview' : 'overview',
    };
    return actionMap[step.role] || 'overview';
  }

  async _archiveResult(instance) {
    const finalResult = instance.steps
      .filter((s) => s.result)
      .map((s) => {
        const roleName = AI_ROLES[s.role]?.name || s.role;
        return `【${roleName}】${s.action}\n${s.result}\n`;
      })
      .join('\n');

    store.addDataReport({
      title: `${instance.name} - ${new Date().toISOString().slice(0, 10)}`,
      content: finalResult,
      type: 'workflow',
      workflowId: instance.templateId,
      workflowInstanceId: instance.id,
      status: instance.status,
    });

    store.log('WORKFLOW', '工作流结果已归档', { instanceId: instance.id });
  }

  getWorkflowStatus(instanceId) {
    return this.workflows.get(instanceId);
  }

  listRunningWorkflows() {
    return Array.from(this.workflows.values()).filter((w) => w.status === 'running');
  }

  listCompletedWorkflows() {
    return Array.from(this.workflows.values()).filter((w) => w.status === 'completed');
  }

  scheduleWorkflow(workflowId, cron, params = {}) {
    const key = `cron-${workflowId}-${cron}`;
    
    if (this.timers.has(key)) {
      clearInterval(this.timers.get(key));
    }

    const parts = cron.split(' ');
    if (parts.length === 2) {
      const [hours, minutes] = parts;
      const now = new Date();
      let targetTime = new Date();
      targetTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const delay = targetTime - now;
      const schedule = () => {
        this.startWorkflow(workflowId, params);
        const nextTarget = new Date();
        nextTarget.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (nextTarget <= new Date()) {
          nextTarget.setDate(nextTarget.getDate() + 1);
        }
        const nextDelay = nextTarget - new Date();
        this.timers.set(key, setTimeout(schedule, nextDelay));
      };
      
      this.timers.set(key, setTimeout(schedule, delay));
    } else if (parts.length === 1) {
      const interval = parseInt(parts[0]) * 60 * 1000;
      this.timers.set(key, setInterval(() => {
        this.startWorkflow(workflowId, params);
      }, interval));
    }

    store.log('WORKFLOW', '定时任务注册', { workflowId, cron });
    return key;
  }

  cancelSchedule(key) {
    if (this.timers.has(key)) {
      const timer = this.timers.get(key);
      if (timer) {
        clearInterval(timer);
        clearTimeout(timer);
      }
      this.timers.delete(key);
      store.log('WORKFLOW', '定时任务取消', { key });
      return true;
    }
    return false;
  }

  triggerByEvent(eventType, data) {
    const workflows = Object.values(this.registeredWorkflows).filter(
      (w) => w.triggers.includes('event')
    );

    workflows.forEach((w) => {
      this.startWorkflow(w.id.replace('workflow.', ''), { eventType, data });
    });

    store.log('WORKFLOW', '事件触发', { eventType, count: workflows.length });
    return workflows.length;
  }

  async triggerManual(workflowId, params = {}) {
    return await this.startWorkflow(workflowId, params);
  }
}

export const workflowEngine = new WorkflowEngine();