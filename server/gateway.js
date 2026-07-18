import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runSkill, listSkills } from './skills/index.js';
import { store } from './store.js';
import { IDENTITY } from './identity.js';
import { workflowEngine } from './workflows/engine.js';
import { AI_ROLES, PLATFORM, COMPLIANCE_RULES, HOT_CATEGORIES, EU_SITES, COMMISSION_RATES, INCENTIVE_PROGRAMS } from './knowledge.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 3000;

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});
app.use(express.json());
app.use(express.static(path.join(ROOT, 'client')));

// ---------- 核心 API ----------
app.get('/api/health', (req, res) => res.json({ ok: true, agent: IDENTITY.name, skills: listSkills().length }));

app.get('/api/skills', (req, res) => res.json(listSkills()));

// ---- AI角色体系 API ----
app.get('/api/ai/roles', (req, res) => {
  const roles = store.listAiRoles();
  if (roles.length === 0) {
    const initialized = store.initAiRoles(Object.values(AI_ROLES));
    res.json(initialized);
  } else {
    res.json(roles);
  }
});

app.get('/api/ai/roles/:id', (req, res) => {
  const role = store.getAiRole(req.params.id);
  if (role) res.json({ ...role, knowledge: AI_ROLES[req.params.id] });
  else res.status(404).json({ error: '角色不存在' });
});

app.post('/api/ai/roles/:id/execute', (req, res) => {
  const { action, params } = req.body || {};
  const skill = `ai.${req.params.id}`;
  try {
    const ctx = { action: action || 'overview', ...(params || {}) };
    const result = runSkill(skill, ctx);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ---- 任务调度 API ----
app.get('/api/tasks', (req, res) => {
  const type = req.query.type || 'daily';
  res.json(store.listTasks(type));
});

app.post('/api/tasks', (req, res) => {
  const { task, type = 'daily' } = req.body || {};
  const result = store.addTask(task, type);
  res.json(result);
});

app.put('/api/tasks/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const patch = req.body || {};
  const result = store.updateTask(type, id, patch);
  if (result) res.json(result);
  else res.status(404).json({ error: '任务不存在' });
});

// ---- 选品库 API ----
app.get('/api/products', (req, res) => {
  res.json(store.listProducts());
});

app.post('/api/products', (req, res) => {
  const product = req.body || {};
  const result = store.addProduct(product);
  res.json(result);
});

app.put('/api/products/:id', (req, res) => {
  const patch = req.body || {};
  const result = store.updateProduct(req.params.id, patch);
  if (result) res.json(result);
  else res.status(404).json({ error: '商品不存在' });
});

// ---- 合规风控 API ----
app.get('/api/compliance', (req, res) => {
  res.json(store.listComplianceRecords());
});

app.post('/api/compliance/check', (req, res) => {
  const { productName, category, sites } = req.body || {};
  try {
    const ctx = { action: 'check_product', productName, category, sites };
    const result = runSkill('ai.compliance', ctx);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/compliance/risk-scan', (req, res) => {
  try {
    const ctx = { action: 'risk_scan' };
    const result = runSkill('ai.compliance', ctx);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ---- 数据复盘 API ----
app.get('/api/reports', (req, res) => {
  res.json(store.listDataReports());
});

app.get('/api/reports/daily', (req, res) => {
  res.json(store.generateDailyReport());
});

// ---- 店铺管理 API ----
app.get('/api/shops', (req, res) => {
  res.json(store.listShops());
});

app.get('/api/shops/:id', (req, res) => {
  const shop = store.getShop(req.params.id);
  if (shop) res.json(shop);
  else res.status(404).json({ error: '店铺不存在' });
});

app.post('/api/shops', (req, res) => {
  const shop = req.body || {};
  const result = store.addShop(shop);
  res.json(result);
});

app.put('/api/shops/:id', (req, res) => {
  const patch = req.body || {};
  const result = store.updateShop(req.params.id, patch);
  if (result) res.json(result);
  else res.status(404).json({ error: '店铺不存在' });
});

app.delete('/api/shops/:id', (req, res) => {
  const result = store.deleteShop(req.params.id);
  if (result) res.json({ ok: true, message: '店铺已删除' });
  else res.status(404).json({ error: '店铺不存在' });
});

app.post('/api/shops/:id/authenticate', (req, res) => {
  const credentials = req.body || {};
  const result = store.authenticateShop(req.params.id, credentials);
  if (result.ok) res.json(result);
  else res.status(400).json(result);
});

app.post('/api/shops/:id/sync', (req, res) => {
  const result = store.syncShopData(req.params.id);
  if (result.ok) res.json(result);
  else res.status(400).json(result);
});

app.get('/api/shops/:id/performance', (req, res) => {
  const shop = store.getShop(req.params.id);
  if (shop) res.json({ performance: shop.performance, dataSync: shop.dataSync });
  else res.status(404).json({ error: '店铺不存在' });
});

// ---- 工作流 API ----
app.get('/api/workflows/templates', (req, res) => {
  res.json(workflowEngine.listWorkflowTemplates());
});

app.post('/api/workflows/start', async (req, res) => {
  const { workflowId, params } = req.body || {};
  try {
    const instanceId = await workflowEngine.startWorkflow(workflowId, params || {});
    res.json({ ok: true, instanceId });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/workflows/status/:instanceId', (req, res) => {
  const status = workflowEngine.getWorkflowStatus(req.params.instanceId);
  if (status) res.json(status);
  else res.status(404).json({ error: '工作流实例不存在' });
});

app.get('/api/workflows/running', (req, res) => {
  res.json(workflowEngine.listRunningWorkflows());
});

app.get('/api/workflows/completed', (req, res) => {
  res.json(workflowEngine.listCompletedWorkflows());
});

app.post('/api/workflows/schedule', (req, res) => {
  const { workflowId, cron, params } = req.body || {};
  const key = workflowEngine.scheduleWorkflow(workflowId, cron, params || {});
  res.json({ ok: true, scheduleKey: key });
});

// ---- 知识库 API ----
app.get('/api/knowledge/platform', (req, res) => {
  res.json(PLATFORM);
});

app.get('/api/knowledge/compliance-rules', (req, res) => {
  res.json(COMPLIANCE_RULES);
});

app.get('/api/knowledge/hot-categories', (req, res) => {
  res.json(HOT_CATEGORIES);
});

app.get('/api/knowledge/eu-sites', (req, res) => {
  res.json(EU_SITES);
});

app.get('/api/knowledge/commission-rates', (req, res) => {
  res.json(COMMISSION_RATES);
});

app.get('/api/knowledge/incentive-programs', (req, res) => {
  res.json(INCENTIVE_PROGRAMS);
});

// ---- 考核迭代 API ----
app.get('/api/kpi/records', (req, res) => {
  res.json(store.listKpiRecords());
});

app.post('/api/kpi/records', (req, res) => {
  const record = req.body || {};
  const result = store.addKpiRecord(record);
  res.json(result);
});

app.get('/api/kpi/roles/:roleId', (req, res) => {
  res.json(store.getKpiByRole(req.params.roleId));
});

// ---- 拓店 API ----
app.get('/api/expansion', (req, res) => {
  res.json(store.listExpansionRecords());
});

app.post('/api/expansion', (req, res) => {
  const record = req.body || {};
  const result = store.addExpansionRecord(record);
  res.json(result);
});

// ---- 首页路由 ----
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'client', 'index.html'));
});

const HOST = process.env.HOST || '0.0.0.0';
const server = createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`\n🤖 ${IDENTITY.name} 已启动`);
  console.log(`   监听: http://${HOST}:${PORT}`);
  console.log(`   已注册技能: ${listSkills().length} 个`);
  console.log(`   核心体系: AI角色定岗 · 流程协作 · 工具能力 · 考核迭代\n`);
});