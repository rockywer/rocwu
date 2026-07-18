const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const API_BASE = '/api';

async function api(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { ok: false, error: error.message };
  }
}

document.querySelectorAll('.nav button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
    $('#view-' + view).classList.remove('hidden');
    $('#page-title').textContent = getPageTitle(view);
    
    if (view === 'dashboard') loadDashboard();
    if (view === 'tasks') loadTasks('daily');
    if (view === 'products') loadProducts();
    if (view === 'roles') loadRoles();
    if (view === 'shops') loadShops();
    if (view === 'tools') loadTools();
    if (view === 'knowledge') loadKnowledge();
    if (view === 'roadmap') loadRoadmap();
  });
});

function getPageTitle(view) {
  const titles = {
    dashboard: '📊 总览Dashboard',
    roles: '👥 AI角色定岗',
    workflow: '🔄 流程协作',
    tasks: '📋 任务调度',
    kpi: '🎯 考核迭代',
    products: '📦 选品库',
    compliance: '🛡️ 合规风控',
    analytics: '📈 数据分析',
    shops: '🏪 店铺管理',
    tools: '⚒️ AI工具能力',
    knowledge: '📚 知识库管理',
    roadmap: '🗺️ 7天实施路线图',
  };
  return titles[view] || '📊 总览';
}

async function loadDashboard() {
  const [rolesRes, tasksRes] = await Promise.all([
    api('/ai/roles'),
    api('/tasks?type=daily'),
  ]);
  
  const roles = rolesRes.value || [];
  const tasks = tasksRes.value || [];
  
  $('#today-task-count').textContent = tasks.length;
  $('#sys-tasks').textContent = tasks.length;
  
  renderTodayTasks(tasks);
}

function renderTodayTasks(tasks) {
  if (tasks.length === 0) {
    $('#today-tasks').innerHTML = `
      <div class="empty-state">
        <div class="icon">📭</div>
        <p>暂无今日任务</p>
        <button class="btn btn-sm mt-12" onclick="generateDailyPlan()">生成今日计划</button>
      </div>`;
    return;
  }

  $('#today-tasks').innerHTML = tasks.map((t) => `
    <div class="task-item ${t.status === 'completed' ? 'completed' : ''}">
      <div class="check">${t.status === 'completed' ? '✓' : ''}</div>
      <div class="info">
        <div class="title">${t.action || t.description || '任务'}</div>
        <div class="meta">${t.role ? getRoleName(t.role) : '未知角色'} · ${t.description || ''}</div>
      </div>
      <div class="priority ${t.priority === 'high' ? 'high' : 'normal'}">${t.priority === 'high' ? '高' : '普通'}</div>
    </div>
  `).join('');
}

async function loadRoles() {
  const res = await api('/ai/roles');
  const roles = res.value || [];
  renderRoles(roles);
}

function renderRoles(roles) {
  const roleCards = roles.map((role) => `
    <div class="role-card ${role.status === 'active' ? 'active' : ''}" onclick="showRoleDetail('${role.id}')">
      <div class="avatar" style="background:${getRoleColor(role.id)}">${getRoleEmoji(role.id)}</div>
      <div class="role-name">${role.name}</div>
      <div class="role-position">${role.position}</div>
      <div class="status ${role.status === 'active' ? 'online' : 'offline'}">${role.status === 'active' ? '在线' : '离线'}</div>
    </div>
  `).join('');
  $('#view-roles .grid').innerHTML = roleCards;
}

function getRoleColor(roleId) {
  const colors = {
    leader: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    compliance: 'linear-gradient(135deg,#ef4444,#dc2626)',
    product: 'linear-gradient(135deg,#f59e0b,#d97706)',
    content: 'linear-gradient(135deg,#ec4899,#db2777)',
    ads: 'linear-gradient(135deg,#10b981,#059669)',
    shop: 'linear-gradient(135deg,#3b82f6,#2563eb)',
    data: 'linear-gradient(135deg,#06b6d4,#0891b2)',
    expand: 'linear-gradient(135deg,#a855f7,#9333ea)',
  };
  return colors[roleId] || 'linear-gradient(135deg,#6366f1,#4f46e5)';
}

function getRoleEmoji(roleId) {
  const emojis = {
    leader: '🎯',
    compliance: '🛡️',
    product: '🔥',
    content: '🎬',
    ads: '🚀',
    shop: '🏪',
    data: '📊',
    expand: '🌍',
  };
  return emojis[roleId] || '🤖';
}

function getRoleName(roleId) {
  const names = {
    leader: 'AI总负责人',
    compliance: 'AI政策合规专员',
    product: 'AI选品爆品专员',
    content: 'AI内容达人专员',
    ads: 'AI投放运营专员',
    shop: 'AI店铺运营专员',
    data: 'AI数据复盘专员',
    expand: 'AI招商拓店专员',
  };
  return names[roleId] || roleId;
}

async function showRoleDetail(roleId) {
  const res = await api(`/ai/roles/${roleId}`);
  const role = res.ok ? res : null;
  
  if (!role) return;
  
  $('#modal-title').textContent = role.name + ' · ' + role.position;
  $('#modal-content').innerHTML = `
    <p><strong>核心定位：</strong>${role.description}</p>
    <h4 style="font-size:13px;color:var(--text);margin:16px 0 8px">核心职责：</h4>
    <ul>${(role.responsibilities || []).map((r) => `<li>${r}</li>`).join('')}</ul>
    <h4 style="font-size:13px;color:var(--text);margin:16px 0 8px">专属能力：</h4>
    <ul>${(role.capabilities || []).map((c) => `<li>${c}</li>`).join('')}</ul>
    <h4 style="font-size:13px;color:var(--text);margin:16px 0 8px">KPI考核：</h4>
    <ul>${(role.kpi || []).map((k) => `<li>${k}</li>`).join('')}</ul>
    <div style="margin-top:20px;text-align:right">
      <button class="btn btn-sm" onclick="closeModal()">关闭</button>
    </div>
  `;
  $('#role-modal').classList.add('active');
}

function closeModal() {
  $('#role-modal').classList.remove('active');
}

function switchWorkflowTab(type) {
  document.querySelectorAll('#view-workflow .tab').forEach((t) => t.classList.remove('active'));
  event.target.classList.add('active');
  ['daily', 'weekly', 'monthly'].forEach((t) => {
    $('#workflow-' + t).classList.toggle('hidden', t !== type);
  });
}

async function switchTaskTab(type) {
  document.querySelectorAll('#view-tasks .tab').forEach((t) => t.classList.remove('active'));
  event.target.classList.add('active');
  await loadTasks(type);
}

async function loadTasks(type) {
  const res = await api(`/tasks?type=${type}`);
  const tasks = res.value || [];
  
  if (tasks.length === 0) {
    $('#task-list').innerHTML = `
      <div class="empty-state">
        <div class="icon">📋</div>
        <p>暂无${type === 'daily' ? '今日' : type === 'weekly' ? '本周' : '本月'}任务</p>
        <button class="btn btn-sm mt-12" onclick="generateDailyPlan()">生成${type === 'daily' ? '今日' : type === 'weekly' ? '本周' : '本月'}计划</button>
      </div>`;
    return;
  }

  $('#task-list').innerHTML = tasks.map((t) => `
    <div class="task-item ${t.status === 'completed' ? 'completed' : ''}">
      <div class="check">${t.status === 'completed' ? '✓' : ''}</div>
      <div class="info">
        <div class="title">${t.action || t.description || '任务'}</div>
        <div class="meta">${t.role ? getRoleName(t.role) : '未知角色'} · ${t.description || ''}</div>
      </div>
      <div class="priority ${t.priority === 'high' ? 'high' : 'normal'}">${t.priority === 'high' ? '高' : '普通'}</div>
    </div>
  `).join('');
}

async function generateDailyPlan() {
  const res = await api('/ai/roles/leader/execute', {
    method: 'POST',
    body: JSON.stringify({ action: 'daily_plan' }),
  });
  
  if (res.ok) {
    alert('📅 日度运营计划已生成！\n\nAI总负责人已下发今日任务。');
    await loadTasks('daily');
    await loadDashboard();
  } else {
    alert('生成计划失败：' + (res.error || '未知错误'));
  }
}

async function startDailyWorkflow() {
  const res = await api('/workflows/start', {
    method: 'POST',
    body: JSON.stringify({ workflowId: 'daily-operation', params: {} }),
  });
  
  if (res.ok) {
    alert(`🚀 日度协作流程已启动！\n\n工作流ID: ${res.instanceId}\n\n流程将自动按SOP执行：\n1. AI总负责人下发任务\n2. AI选品专员输出测品清单\n3. AI内容专员输出本土化素材\n4. AI投放专员搭建投放计划\n5. AI合规专员全链路审核\n6. AI数据复盘专员统计数据`);
    
    setTimeout(() => {
      checkWorkflowStatus(res.instanceId);
    }, 2000);
  } else {
    alert('启动流程失败：' + (res.error || '未知错误'));
  }
}

async function checkWorkflowStatus(instanceId) {
  const res = await api(`/workflows/status/${instanceId}`);
  
  if (res && res.steps) {
    const activeStep = res.steps.find((s) => s.status === 'running');
    const completedSteps = res.steps.filter((s) => s.status === 'completed').length;
    
    if (activeStep) {
      alert(`🔄 工作流执行中...\n\n当前步骤: ${activeStep.action}\n完成进度: ${completedSteps}/${res.steps.length}`);
      
      if (res.status !== 'completed') {
        setTimeout(() => checkWorkflowStatus(instanceId), 3000);
      } else {
        alert(`✅ 工作流执行完成！\n\n完成步骤: ${completedSteps}/${res.steps.length}\n状态: ${res.status}`);
        loadDashboard();
      }
    }
  }
}

async function generateProductList() {
  const res = await api('/ai/roles/product/execute', {
    method: 'POST',
    body: JSON.stringify({ action: 'overview' }),
  });
  
  if (res.ok) {
    alert('✨ 选品清单已生成！\n\nAI选品爆品专员已输出高潜力欧洲爆品。');
    await loadProducts();
  } else {
    alert('生成选品清单失败：' + (res.error || '未知错误'));
  }
}

async function loadProducts() {
  const res = await api('/products');
  const products = res.value || [];
  
  if (products.length === 0) {
    $('#product-table-body').innerHTML = '<tr><td colspan="8" class="empty-state"><div class="icon">📦</div><p>暂无选品数据</p></td></tr>';
    return;
  }

  $('#product-table-body').innerHTML = products.map((p) => `
    <tr>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.sites ? p.sites.join(', ') : ''}</td>
      <td>${p.price}</td>
      <td><span class="badge ${parseFloat(p.profitMargin) >= 25 ? 'success' : 'warning'}">${p.profitMargin}</span></td>
      <td><span class="badge ${p.complianceRisk === '低' ? 'success' : p.complianceRisk === '中' ? 'warning' : 'danger'}">${p.complianceRisk}</span></td>
      <td><span class="badge ${p.status === '已上架' ? 'success' : p.status === '审核中' ? 'warning' : 'info'}">${p.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline">详情</button>
        <button class="btn btn-sm" style="background:var(--primary)">上架</button>
      </td>
    </tr>
  `).join('');
}

async function scanRisk() {
  const res = await api('/compliance/risk-scan', { method: 'POST' });
  
  if (res.ok) {
    const alerts = [
      { type: 'warning', message: '⚠️ 3项合规审核待处理，请尽快完成' },
      { type: 'info', message: 'ℹ️ 德国站点VAT申报即将到期（7天后）' },
      { type: 'success', message: '✅ 本周无店铺违规风险' },
    ];

    $('#risk-alerts').innerHTML = alerts.map((a) => `
      <div style="padding:12px;border-radius:8px;margin-bottom:8px;background:rgba(${a.type === 'warning' ? '245,158,11' : a.type === 'danger' ? '239,68,68' : a.type === 'success' ? '16,185,129' : '59,130,246'},0.1);border-left:3px solid var(--${a.type})">
        <div style="font-size:13px;color:var(--text)">${a.message}</div>
      </div>
    `).join('');
  } else {
    alert('风险扫描失败：' + (res.error || '未知错误'));
  }
}

async function loadTools() {
  const toolsByRole = {
    leader: ['全局任务调度器', '政策解读分析工具', '团队数据总览看板', '周报月报自动生成'],
    compliance: ['欧盟合规自查工具', 'VAT/EPR资质核对工具', '平台违规风险筛查工具', '政策红利匹配计算器'],
    product: ['GMV MAX测品工具', '欧洲站点趋势热搜工具', '竞品爆款拆解工具', '利润核算选品工具'],
    content: ['多语种本土化文案生成', '区域风格脚本模板', '达人匹配筛选工具', '寄样激励核算工具'],
    ads: ['广告金申领提醒', '动态佣金优化工具', '大促前置预热工具', '投放ROI监控工具'],
    shop: ['商品上架合规模板', '库存监控工具', '店铺权重维护工具', '新手任务进度追踪工具'],
    data: ['单品利润拆解模型', '全链路成本分析工具', '数据异常诊断工具', '周报月报自动生成工具'],
    expand: ['多站点资质匹配工具', '全域低佣政策激活工具', '拓店激励核算工具'],
  };
  
  const commonTools = ['专属知识库', '任务调度系统', '数据汇总看板'];
  
  const html = `
    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:14px;margin-bottom:16px">🌐 通用底层工具（全员共用）</h3>
      <div class="grid grid-3">
        ${commonTools.map((tool) => `
          <div style="text-align:center;padding:16px;background:rgba(99,102,241,0.1);border-radius:12px">
            <div style="font-size:24px;margin-bottom:8px">🛠️</div>
            <div style="font-size:13px;font-weight:600;color:var(--text)">${tool}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    ${Object.entries(toolsByRole).map(([roleId, tools]) => `
      <div class="card" style="margin-bottom:16px">
        <h3 style="font-size:14px;margin-bottom:12px">${getRoleEmoji(roleId)} ${getRoleName(roleId)} · 专属工具</h3>
        <div class="grid grid-4 gap-4">
          ${tools.map((tool) => `
            <div style="padding:12px;background:rgba(59,130,246,0.08);border-radius:8px;font-size:12px;color:var(--text-dim)">${tool}</div>
          `).join('')}
        </div>
      </div>
    `).join('')}
    
    <div class="card">
      <h3 style="font-size:14px;margin-bottom:16px">📋 核心能力落地标准</h3>
      <div class="grid grid-2 gap-8">
        <div class="flex-between items-center p-4 bg:rgba(16,185,129,0.08);border-radius:8px">
          <div>
            <div style="font-size:13px;color:var(--text)">政策解读</div>
            <div style="font-size:11px;color:var(--text-muted)">10分钟完成最新招商政策拆解</div>
          </div>
          <span class="badge success">✅ 达标</span>
        </div>
        <div class="flex-between items-center p-4 bg:rgba(99,102,241,0.08);border-radius:8px">
          <div>
            <div style="font-size:13px;color:var(--text)">选品输出</div>
            <div style="font-size:11px;color:var(--text-muted)">每日10款高潜力欧洲爆品</div>
          </div>
          <span class="badge primary">✅ 达标</span>
        </div>
        <div class="flex-between items-center p-4 bg:rgba(245,158,11,0.08);border-radius:8px">
          <div>
            <div style="font-size:13px;color:var(--text)">内容产出</div>
            <div style="font-size:11px;color:var(--text-muted)">每日20条本土化短视频脚本</div>
          </div>
          <span class="badge warning">✅ 达标</span>
        </div>
        <div class="flex-between items-center p-4 bg:rgba(59,130,246,0.08);border-radius:8px">
          <div>
            <div style="font-size:13px;color:var(--text)">数据复盘</div>
            <div style="font-size:11px;color:var(--text-muted)">每日自动输出运营报表</div>
          </div>
          <span class="badge info">✅ 达标</span>
        </div>
      </div>
    </div>
  `;
  
  $('#view-tools').innerHTML = html;
}

async function loadKnowledge() {
  const [sitesRes, complianceRes, commissionRes] = await Promise.all([
    api('/knowledge/eu-sites'),
    api('/knowledge/compliance-rules'),
    api('/knowledge/commission-rates'),
  ]);
  
  const sites = sitesRes.value || sitesRes || [];
  const compliance = complianceRes.value || complianceRes || [];
  const commission = commissionRes.value || commissionRes || [];
  
  const html = `
    <div class="grid grid-2 gap-16">
      <div class="card">
        <h3 style="font-size:14px;margin-bottom:16px">🌍 EU站点信息</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${sites.map((site) => `
            <div class="flex-between items-center p-4 bg:rgba(99,102,241,0.08);border-radius:8px">
              <div>
                <div style="font-size:13px;color:var(--text)">${site.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${site.code} · ${site.region}</div>
              </div>
              <span class="badge ${site.type === 'EU4' ? 'success' : 'warning'}">${site.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <h3 style="font-size:14px;margin-bottom:16px">🛡️ 合规规则</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${compliance.map((rule) => `
            <div class="flex-between items-center p-4 bg:rgba(${rule.severity === 'high' ? '239,68,68' : rule.severity === 'medium' ? '245,158,11' : '59,130,246'},0.08);border-radius:8px">
              <div>
                <div style="font-size:13px;color:var(--text)">${rule.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${rule.description}</div>
              </div>
              <span class="badge ${rule.severity === 'high' ? 'danger' : rule.severity === 'medium' ? 'warning' : 'info'}">${rule.severity === 'high' ? '高' : rule.severity === 'medium' ? '中' : '低'}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <h3 style="font-size:14px;margin-bottom:16px">💰 佣金费率</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${commission.map((item) => `
            <div class="flex-between items-center p-4 bg:rgba(16,185,129,0.08);border-radius:8px">
              <div>
                <div style="font-size:13px;color:var(--text)">${item.site}</div>
                <div style="font-size:11px;color:var(--text-muted)">${item.category}</div>
              </div>
              <span class="badge success">${item.rate}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <h3 style="font-size:14px;margin-bottom:16px">🎁 激励政策</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="flex-between items-center p-4 bg:rgba(168,85,247,0.08);border-radius:8px">
            <div>
              <div style="font-size:13px;color:var(--text)">新商家广告补贴</div>
              <div style="font-size:11px;color:var(--text-muted)">首月广告金返还50%</div>
            </div>
            <span class="badge primary">进行中</span>
          </div>
          <div class="flex-between items-center p-4 bg:rgba(245,158,11,0.08);border-radius:8px">
            <div>
              <div style="font-size:13px;color:var(--text)">低佣站点红利</div>
              <div style="font-size:11px;color:var(--text-muted)">EU4 2%/EU8 4%佣金减免</div>
            </div>
            <span class="badge warning">进行中</span>
          </div>
          <div class="flex-between items-center p-4 bg:rgba(16,185,129,0.08);border-radius:8px">
            <div>
              <div style="font-size:13px;color:var(--text)">扩店激励计划</div>
              <div style="font-size:11px;color:var(--text-muted)">每新增1站点奖励€50</div>
            </div>
            <span class="badge success">进行中</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  $('#view-knowledge').innerHTML = html;
}

function loadRoadmap() {
  const roadmap = [
    {
      day: 'Day 1',
      title: '岗位搭建&知识库部署',
      icon: '🏗️',
      color: '#6366f1',
      tasks: ['完成8大AI角色定岗', '录入TikTok欧洲全部政策', '搭建专属知识库'],
      status: 'completed',
    },
    {
      day: 'Day 2',
      title: '工具配置&权限开通',
      icon: '⚒️',
      color: '#3b82f6',
      tasks: ['匹配各AI岗位专属工具', '配置指令模板与输出标准', '打通任务调度与数据看板'],
      status: 'completed',
    },
    {
      day: 'Day 3',
      title: '协作SOP落地试运行',
      icon: '🔄',
      color: '#10b981',
      tasks: ['启动日度协作流程', '全岗位试运行', '排查流程卡点与输出偏差'],
      status: 'completed',
    },
    {
      day: 'Day 4',
      title: '考核体系落地',
      icon: '🎯',
      color: '#f59e0b',
      tasks: ['配置各岗位KPI考核标准', '设置迭代规则', '落实人工干预机制'],
      status: 'completed',
    },
    {
      day: 'Day 5',
      title: '全链路实战跑通',
      icon: '🚀',
      color: '#ec4899',
      tasks: ['落地选品全流程', '实施上架与投放', '收割平台基础红利'],
      status: 'in_progress',
    },
    {
      day: 'Day 6',
      title: '全链路实战跑通',
      icon: '💡',
      color: '#a855f7',
      tasks: ['合规风控实战', '数据复盘优化', '问题整改与迭代'],
      status: 'pending',
    },
    {
      day: 'Day 7',
      title: '体系优化&长效运转',
      icon: '🌟',
      color: '#06b6d4',
      tasks: ['复盘试运行问题', '优化岗位分工与协作流程', '实现AI团队24小时自主长效运转'],
      status: 'pending',
    },
  ];
  
  const html = `
    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:14px;margin-bottom:16px">📅 7天完整搭建实施路线图</h3>
      <div style="position:relative;padding-left:30px">
        <div style="position:absolute;left:8px;top:0;bottom:0;width:2px;background:var(--border)"></div>
        
        ${roadmap.map((item, idx) => `
          <div style="position:relative;padding:16px 0;display:flex;gap:16px">
            <div style="position:absolute;left:-24px;top:20px;width:12px;height:12px;border-radius:50%;background:${item.color};border:3px solid var(--bg-card)"></div>
            
            <div style="flex:1;background:${item.status === 'completed' ? 'rgba(16,185,129,0.08)' : item.status === 'in_progress' ? 'rgba(99,102,241,0.08)' : 'rgba(100,116,139,0.08)'};;border-radius:12px;padding:16px;border:1px solid ${item.status === 'completed' ? 'rgba(16,185,129,0.3)' : item.status === 'in_progress' ? 'rgba(99,102,241,0.3)' : 'rgba(100,116,139,0.3)'}">
              <div class="flex-between items-center mb-8">
                <div class="flex-center gap-8">
                  <div style="font-size:24px">${item.icon}</div>
                  <div>
                    <div style="font-size:14px;font-weight:600;color:var(--text)">${item.day}: ${item.title}</div>
                  </div>
                </div>
                <span class="badge ${item.status === 'completed' ? 'success' : item.status === 'in_progress' ? 'primary' : 'info'}">
                  ${item.status === 'completed' ? '✅ 已完成' : item.status === 'in_progress' ? '🔄 进行中' : '⏳ 待开始'}
                </span>
              </div>
              
              <div style="display:flex;flex-direction:column;gap:4px">
                ${item.tasks.map((task) => `
                  <div style="font-size:12px;color:var(--text-dim);display:flex;align-items:center;gap:6px">
                    <span>${item.status === 'completed' ? '✓' : item.status === 'in_progress' ? '○' : '◯'}</span>
                    ${task}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  $('#view-roadmap').innerHTML = html;
}

function updateTime() {
  $('#last-update').textContent = new Date().toLocaleTimeString('zh-CN');
}
setInterval(updateTime, 60000);

async function loadShops() {
  const res = await api('/shops');
  const shops = res.value || res || [];
  
  if (shops.length === 0) {
    $('#shop-list-content').innerHTML = `
      <div class="empty-state">
        <div class="icon">🏪</div>
        <p>暂无已接入的店铺</p>
        <button class="btn btn-sm mt-12" onclick="showAddShopModal()">接入我的店铺</button>
      </div>`;
    return;
  }

  $('#shop-list-content').innerHTML = `
    <div class="grid grid-2 gap-8">
      ${shops.map((shop) => `
        <div style="padding:20px;background:rgba(99,102,241,0.08);border-radius:12px;border:1px solid var(--border)">
          <div class="flex-between items-center mb-12">
            <div>
              <div style="font-size:16px;font-weight:600;color:var(--text)">${shop.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${getSiteFlag(shop.site)} ${shop.site}</div>
            </div>
            <span class="badge ${shop.status === 'authenticated' ? 'success' : shop.status === 'connected' ? 'info' : 'warning'}">
              ${shop.status === 'authenticated' ? '已认证' : shop.status === 'connected' ? '已接入' : '待认证'}
            </span>
          </div>
          
          <div class="grid grid-2 gap-8 mb-12">
            <div>
              <div style="font-size:10px;color:var(--text-muted)">今日GMV</div>
              <div style="font-size:18px;font-weight:600;color:var(--text)">¥${shop.performance?.gmv?.toLocaleString() || 0}</div>
            </div>
            <div>
              <div style="font-size:10px;color:var(--text-muted)">订单数</div>
              <div style="font-size:18px;font-weight:600;color:var(--text)">${shop.performance?.orders || 0}</div>
            </div>
            <div>
              <div style="font-size:10px;color:var(--text-muted)">转化率</div>
              <div style="font-size:18px;font-weight:600;color:var(--text)">${shop.performance?.conversionRate || 0}%</div>
            </div>
            <div>
              <div style="font-size:10px;color:var(--text-muted)">广告ROI</div>
              <div style="font-size:18px;font-weight:600;color:var(--text)">${shop.performance?.roi || 0}:1</div>
            </div>
          </div>

          <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">数据同步</div>
          <div class="flex-between items-center p-4 bg:rgba(16,185,129,0.08);border-radius:8px mb-8">
            <div>
              <div style="font-size:12px;color:var(--text)">商品: ${shop.dataSync?.products || 0} | 订单: ${shop.dataSync?.orders || 0}</div>
              <div style="font-size:11px;color:var(--text-muted)">评论: ${shop.dataSync?.reviews || 0} | 广告: ${shop.dataSync?.ads || 0}</div>
            </div>
            ${shop.syncStatus?.status === 'synced' ? 
              '<span class="badge success">已同步</span>' : 
              '<span class="badge info">待同步</span>'}
          </div>

          <div style="display:flex;gap:8px">
            ${shop.status !== 'authenticated' ? 
              `<button class="btn btn-sm btn-outline" onclick="authenticateShop('${shop.id}')">🔑 认证</button>` : 
              ''}
            <button class="btn btn-sm" style="background:var(--primary)" onclick="syncShopData('${shop.id}')">🔄 同步数据</button>
            <button class="btn btn-sm btn-outline" onclick="deleteShop('${shop.id}')">🗑️ 删除</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getSiteFlag(site) {
  const flags = {
    DE: '🇩🇪', FR: '🇫🇷', UK: '🇬🇧', ES: '🇪🇸', IT: '🇮🇹',
    NL: '🇳🇱', BE: '🇧🇪', PL: '🇵🇱', CZ: '🇨🇿', HU: '🇭🇺',
    RO: '🇷🇴', BG: '🇧🇬', SE: '🇸🇪', AT: '🇦🇹',
  };
  return flags[site] || '🌍';
}

function showAddShopModal() {
  $('#shop-modal').classList.add('active');
}

function closeShopModal() {
  $('#shop-modal').classList.remove('active');
  $('#shop-form').reset();
}

async function handleShopSubmit(event) {
  event.preventDefault();
  
  const shopData = {
    name: $('#shop-name').value,
    site: $('#shop-site').value,
    shopId: $('#shop-id').value,
    apiCredentials: {
      appKey: $('#app-key').value,
      appSecret: $('#app-secret').value,
      redirectUrl: $('#redirect-url').value,
    },
  };
  
  const res = await api('/shops', {
    method: 'POST',
    body: JSON.stringify(shopData),
  });
  
  if (res) {
    alert(`✅ 店铺 "${res.name}" 接入成功！\n\n店铺ID: ${res.id}\n站点: ${res.site}\n\n接下来请完成店铺认证以同步数据。`);
    closeShopModal();
    await loadShops();
  } else {
    alert('接入店铺失败，请重试');
  }
}

async function authenticateShop(shopId) {
  const credentials = {
    appKey: prompt('请输入TikTok Shop App Key:'),
    appSecret: prompt('请输入TikTok Shop App Secret:'),
  };
  
  if (!credentials.appKey || !credentials.appSecret) {
    alert('认证取消');
    return;
  }
  
  const res = await api(`/shops/${shopId}/authenticate`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  if (res.ok) {
    alert(`✅ 店铺认证成功！\n\nToken已获取，有效期2小时\n\n接下来可以同步店铺数据。`);
    await loadShops();
  } else {
    alert('认证失败：' + (res.error || '未知错误'));
  }
}

async function syncShopData(shopId) {
  alert('🔄 正在同步店铺数据...');
  
  const res = await api(`/shops/${shopId}/sync`, {
    method: 'POST',
  });
  
  if (res.ok) {
    const data = res.data;
    alert(`✅ 数据同步完成！\n\nGMV: ¥${data.gmv}\n订单: ${data.orders}\n转化率: ${data.conversionRate}%\nROI: ${data.roi}:1\n\n商品: ${data.products} | 订单: ${data.orders} | 评论: ${data.reviews}`);
    await loadShops();
    await loadDashboard();
  } else {
    alert('同步失败：' + (res.error || '未知错误'));
  }
}

async function deleteShop(shopId) {
  if (!confirm('确定要删除该店铺吗？此操作不可撤销。')) return;
  
  const res = await api(`/shops/${shopId}`, {
    method: 'DELETE',
  });
  
  if (res.ok) {
    alert('✅ 店铺已删除');
    await loadShops();
  } else {
    alert('删除失败：' + (res.error || '未知错误'));
  }
}

window.switchWorkflowTab = switchWorkflowTab;
window.switchTaskTab = switchTaskTab;
window.showRoleDetail = showRoleDetail;
window.closeModal = closeModal;
window.generateDailyPlan = generateDailyPlan;
window.startDailyWorkflow = startDailyWorkflow;
window.generateProductList = generateProductList;
window.scanRisk = scanRisk;
window.showAddShopModal = showAddShopModal;
window.closeShopModal = closeShopModal;
window.handleShopSubmit = handleShopSubmit;
window.authenticateShop = authenticateShop;
window.syncShopData = syncShopData;
window.deleteShop = deleteShop;