import { AI_ROLES, DAILY_SOP, WEEKLY_SOP, MONTHLY_SOP, INCENTIVE_PROGRAMS } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI总负责人 - 团队总指挥，全局调度、任务统筹、资源分配、进度管控';
export const trigger = ['总负责人', '团队指挥', '任务调度', '周报', '月报', '工作汇总'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'daily_plan':
      return generateDailyPlan(ctx);
    case 'weekly_plan':
      return generateWeeklyPlan(ctx);
    case 'monthly_plan':
      return generateMonthlyPlan(ctx);
    case 'review':
      return reviewDailyWork(ctx);
    case 'task_assign':
      return assignTasks(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.leader;
  return `## 🎯 AI总负责人 · 团队总指挥\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function generateDailyPlan(ctx) {
  const today = new Date().toISOString().slice(0, 10);
  const plan = {
    date: today,
    tasks: DAILY_SOP.map((step) => ({
      step: step.step,
      role: AI_ROLES[step.role]?.name || step.role,
      action: step.action,
      description: step.description,
    })),
  };
  
  DAILY_SOP.forEach((step) => {
    store.addTask({
      role: step.role,
      action: step.action,
      description: step.description,
      planDate: today,
      priority: step.step <= 2 ? 'high' : 'normal',
    }, 'daily');
  });
  
  return `## 📅 ${today} 日度运营计划已生成\n\n### 今日任务安排：\n${plan.tasks.map((t) => `**步骤${t.step} - ${t.role}**\n• 任务：${t.action}\n• 详情：${t.description}\n`).join('\n')}\n\n📌 已将任务分配至各AI岗位，请查收执行。`;
}

function generateWeeklyPlan(ctx) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const plan = {
    period: `${weekStart.toISOString().slice(0, 10)} ~ ${weekEnd.toISOString().slice(0, 10)}`,
    tasks: WEEKLY_SOP.map((step) => ({
      step: step.step,
      role: AI_ROLES[step.role]?.name || step.role,
      action: step.action,
      description: step.description,
    })),
  };
  
  WEEKLY_SOP.forEach((step) => {
    store.addTask({
      role: step.role,
      action: step.action,
      description: step.description,
      planDate: weekStart.toISOString().slice(0, 10),
      priority: 'high',
    }, 'weekly');
  });
  
  return `## 📊 周度增长计划已生成\n\n**周期**：${plan.period}\n\n### 本周重点任务：\n${plan.tasks.map((t) => `**步骤${t.step} - ${t.role}**\n• 任务：${t.action}\n• 详情：${t.description}\n`).join('\n')}`;
}

function generateMonthlyPlan(ctx) {
  const now = new Date();
  const period = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  
  const plan = {
    period,
    tasks: MONTHLY_SOP.map((step) => ({
      step: step.step,
      role: AI_ROLES[step.role]?.name || step.role,
      action: step.action,
      description: step.description,
    })),
  };
  
  MONTHLY_SOP.forEach((step) => {
    store.addTask({
      role: step.role,
      action: step.action,
      description: step.description,
      planDate: now.toISOString().slice(0, 10),
      priority: 'high',
    }, 'monthly');
  });
  
  return `## 📋 ${period} 月度规划已生成\n\n### 本月重点任务：\n${plan.tasks.map((t) => `**步骤${t.step} - ${t.role}**\n• 任务：${t.action}\n• 详情：${t.description}\n`).join('\n')}`;
}

function reviewDailyWork(ctx) {
  const today = new Date().toISOString().slice(0, 10);
  const tasks = store.listTasks('daily').filter((t) => t.createdAt?.startsWith(today));
  const report = store.generateDailyReport();
  
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  
  return `## 📈 ${today} 日度工作复盘\n\n### 任务完成情况：\n• 总任务数：${tasks.length}\n• ✅ 已完成：${completed}\n• 🔄 进行中：${inProgress}\n• ⏳ 待执行：${pending}\n\n### 数据概览：\n• 新增选品：${report.productStats.total} 款\n• 投放计划：${report.adsStats.total} 个\n• 合规审核：${report.complianceStats.total} 项（通过 ${report.complianceStats.passed} 项）\n\n### 平台激励政策提醒：\n${INCENTIVE_PROGRAMS.map((p) => `• **${p.name}**：${p.description} → ${p.benefit}`).join('\n')}`;
}

function assignTasks(ctx) {
  const { role, task, description } = ctx;
  if (!role || !task) {
    return '❌ 请指定目标角色和任务内容。\n\n格式：assignTasks role=product task=输出选品清单 description=今日10款高潜力爆品';
  }
  
  store.addTask({
    role,
    action: task,
    description: description || '',
    assignedBy: 'leader',
  }, 'daily');
  
  return `✅ 任务已分配给 ${AI_ROLES[role]?.name || role}：\n• 任务：${task}\n• 详情：${description || '无'}`;
}
