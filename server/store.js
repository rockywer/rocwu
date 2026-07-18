import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const LOG_DIR = path.join(DATA_DIR, 'logs');

const FILES = {
  AI_ROLES: path.join(DATA_DIR, 'ai_roles.json'),
  TASKS: path.join(DATA_DIR, 'tasks.json'),
  KPI_RECORDS: path.join(DATA_DIR, 'kpi_records.json'),
  PRODUCTS: path.join(DATA_DIR, 'products.json'),
  COMPLIANCE: path.join(DATA_DIR, 'compliance_records.json'),
  ADS: path.join(DATA_DIR, 'ads_records.json'),
  SHOPS: path.join(DATA_DIR, 'shops.json'),
  DATA_REPORTS: path.join(DATA_DIR, 'data_reports.json'),
  EXPANSION: path.join(DATA_DIR, 'expansion_records.json'),
  WORKFLOWS: path.join(DATA_DIR, 'workflows.json'),
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  Object.values(FILES).forEach((file) => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, file.includes('tasks') ? '{"daily":[],"weekly":[],"monthly":[]}' : '[]');
    }
  });
}

function readJson(file) {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return file.includes('tasks') ? { daily: [], weekly: [], monthly: [] } : [];
  }
}

function writeJson(file, data) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export const store = {
  log(level, msg, meta = {}) {
    ensure();
    const day = new Date().toISOString().slice(0, 10);
    const logFile = path.join(LOG_DIR, `${day}.log`);
    const line = `[${new Date().toISOString()}] [${level}] ${msg} ${JSON.stringify(meta)}\n`;
    fs.appendFileSync(logFile, line);
  },

  // ---- AI角色状态 ----
  listAiRoles() {
    return readJson(FILES.AI_ROLES);
  },
  getAiRole(id) {
    return this.listAiRoles().find((r) => r.id === id);
  },
  updateAiRole(id, patch) {
    const list = this.listAiRoles();
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      writeJson(FILES.AI_ROLES, list);
      return list[idx];
    }
    return null;
  },
  initAiRoles(roles) {
    const existing = this.listAiRoles();
    if (existing.length === 0) {
      const initialized = roles.map((r) => ({
        ...r,
        status: 'active',
        lastTaskAt: null,
        taskCount: 0,
        createdAt: new Date().toISOString(),
      }));
      writeJson(FILES.AI_ROLES, initialized);
      return initialized;
    }
    return existing;
  },

  // ---- 任务调度 ----
  listTasks(type = 'daily') {
    const data = readJson(FILES.TASKS);
    return data[type] || [];
  },
  addTask(task, type = 'daily') {
    const data = readJson(FILES.TASKS);
    if (!data[type]) data[type] = [];
    task.id = 'TASK-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    task.createdAt = new Date().toISOString();
    task.status = task.status || 'pending';
    data[type].push(task);
    writeJson(FILES.TASKS, data);
    this.log('TASK', '任务创建', { id: task.id, type, role: task.role });
    return task;
  },
  updateTask(type, id, patch) {
    const data = readJson(FILES.TASKS);
    const list = data[type] || [];
    const idx = list.findIndex((t) => t.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      data[type] = list;
      writeJson(FILES.TASKS, data);
      return list[idx];
    }
    return null;
  },
  getTask(type, id) {
    const list = this.listTasks(type);
    return list.find((t) => t.id === id);
  },

  // ---- KPI考核记录 ----
  listKpiRecords() {
    return readJson(FILES.KPI_RECORDS);
  },
  addKpiRecord(record) {
    const list = this.listKpiRecords();
    record.id = 'KPI-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    record.createdAt = new Date().toISOString();
    list.push(record);
    writeJson(FILES.KPI_RECORDS, list);
    this.log('KPI', '考核记录', { id: record.id, role: record.role, period: record.period });
    return record;
  },
  getKpiByRole(roleId) {
    return this.listKpiRecords().filter((r) => r.roleId === roleId);
  },

  // ---- 选品库 ----
  listProducts() {
    return readJson(FILES.PRODUCTS);
  },
  addProduct(product) {
    const list = this.listProducts();
    product.id = 'PROD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    product.createdAt = new Date().toISOString();
    product.status = product.status || 'pending';
    list.push(product);
    writeJson(FILES.PRODUCTS, list);
    this.log('PRODUCT', '选品入库', { id: product.id, name: product.name });
    return product;
  },
  updateProduct(id, patch) {
    const list = this.listProducts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      writeJson(FILES.PRODUCTS, list);
      return list[idx];
    }
    return null;
  },
  getProduct(id) {
    return this.listProducts().find((p) => p.id === id);
  },

  // ---- 合规记录 ----
  listComplianceRecords() {
    return readJson(FILES.COMPLIANCE);
  },
  addComplianceRecord(record) {
    const list = this.listComplianceRecords();
    record.id = 'COMP-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    record.createdAt = new Date().toISOString();
    list.push(record);
    writeJson(FILES.COMPLIANCE, list);
    this.log('COMPLIANCE', '合规记录', { id: record.id, type: record.type });
    return record;
  },
  getComplianceByProduct(productId) {
    return this.listComplianceRecords().filter((r) => r.productId === productId);
  },

  // ---- 投放记录 ----
  listAdsRecords() {
    return readJson(FILES.ADS);
  },
  addAdsRecord(record) {
    const list = this.listAdsRecords();
    record.id = 'ADS-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    record.createdAt = new Date().toISOString();
    list.push(record);
    writeJson(FILES.ADS, list);
    this.log('ADS', '投放记录', { id: record.id, campaign: record.campaign });
    return record;
  },

  // ---- 店铺管理 ----
  listShops() {
    return readJson(FILES.SHOPS);
  },
  getShop(id) {
    return this.listShops().find((s) => s.id === id);
  },
  addShop(shop) {
    const list = this.listShops();
    shop.id = 'SHOP-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    shop.createdAt = new Date().toISOString();
    shop.status = shop.status || 'connected';
    shop.apiCredentials = shop.apiCredentials || {};
    shop.authToken = shop.authToken || null;
    shop.syncStatus = shop.syncStatus || { lastSync: null, nextSync: null, status: 'idle' };
    shop.performance = shop.performance || { gmv: 0, orders: 0, conversionRate: 0, roi: 0 };
    shop.dataSync = shop.dataSync || { products: 0, orders: 0, reviews: 0, ads: 0 };
    list.push(shop);
    writeJson(FILES.SHOPS, list);
    this.log('SHOP', '店铺创建', { id: shop.id, name: shop.name, site: shop.site });
    return shop;
  },
  updateShop(id, patch) {
    const list = this.listShops();
    const idx = list.findIndex((s) => s.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      writeJson(FILES.SHOPS, list);
      return list[idx];
    }
    return null;
  },
  deleteShop(id) {
    const list = this.listShops();
    const idx = list.findIndex((s) => s.id === id);
    if (idx >= 0) {
      const deleted = list.splice(idx, 1)[0];
      writeJson(FILES.SHOPS, list);
      this.log('SHOP', '店铺删除', { id: deleted.id, name: deleted.name });
      return deleted;
    }
    return null;
  },
  authenticateShop(id, credentials) {
    const shop = this.getShop(id);
    if (!shop) return { ok: false, error: '店铺不存在' };

    try {
      const mockToken = {
        accessToken: 'tok_' + Math.random().toString(36).slice(2, 30),
        refreshToken: 'ref_' + Math.random().toString(36).slice(2, 30),
        expiresIn: 7200,
        scope: ['product', 'order', 'analytics', 'ad'],
        createdAt: new Date().toISOString(),
      };

      shop.apiCredentials = credentials;
      shop.authToken = mockToken;
      shop.status = 'authenticated';
      shop.syncStatus = {
        lastSync: null,
        nextSync: new Date(Date.now() + 3600000).toISOString(),
        status: 'ready',
      };

      this.updateShop(id, shop);
      this.log('SHOP', '店铺认证成功', { id, name: shop.name });
      return { ok: true, token: mockToken, shop };
    } catch (error) {
      this.log('SHOP', '店铺认证失败', { id, error: error.message });
      return { ok: false, error: error.message };
    }
  },
  syncShopData(id) {
    const shop = this.getShop(id);
    if (!shop) return { ok: false, error: '店铺不存在' };

    try {
      const now = new Date();
      const mockPerformance = {
        gmv: Math.floor(Math.random() * 50000) + 5000,
        orders: Math.floor(Math.random() * 200) + 20,
        conversionRate: (Math.random() * 5 + 1).toFixed(2),
        roi: (Math.random() * 3 + 1).toFixed(1),
      };

      const mockDataSync = {
        products: Math.floor(Math.random() * 50) + 10,
        orders: Math.floor(Math.random() * 500) + 50,
        reviews: Math.floor(Math.random() * 200) + 20,
        ads: Math.floor(Math.random() * 10) + 2,
      };

      shop.performance = mockPerformance;
      shop.dataSync = mockDataSync;
      shop.syncStatus = {
        lastSync: now.toISOString(),
        nextSync: new Date(Date.now() + 3600000).toISOString(),
        status: 'synced',
      };

      this.updateShop(id, shop);
      this.log('SHOP', '店铺数据同步', { id, name: shop.name, gmv: mockPerformance.gmv });
      return { ok: true, data: { ...mockPerformance, ...mockDataSync }, shop };
    } catch (error) {
      this.log('SHOP', '店铺数据同步失败', { id, error: error.message });
      return { ok: false, error: error.message };
    }
  },

  // ---- 数据复盘报告 ----
  listDataReports() {
    return readJson(FILES.DATA_REPORTS);
  },
  addDataReport(report) {
    const list = this.listDataReports();
    report.id = 'REPORT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    report.createdAt = new Date().toISOString();
    list.push(report);
    writeJson(FILES.DATA_REPORTS, list);
    this.log('REPORT', '数据报告生成', { id: report.id, type: report.type });
    return report;
  },
  generateDailyReport() {
    const today = new Date().toISOString().slice(0, 10);
    const tasks = this.listTasks('daily').filter((t) => t.createdAt?.startsWith(today));
    const products = this.listProducts().filter((p) => p.createdAt?.startsWith(today));
    const ads = this.listAdsRecords().filter((a) => a.createdAt?.startsWith(today));
    const compliance = this.listComplianceRecords().filter((c) => c.createdAt?.startsWith(today));

    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

    return {
      date: today,
      taskStats: { total: tasks.length, completed: completedTasks, pending: pendingTasks },
      productStats: { total: products.length, pending: products.filter((p) => p.status === 'pending').length },
      adsStats: { total: ads.length, active: ads.filter((a) => a.status === 'active').length },
      complianceStats: { total: compliance.length, passed: compliance.filter((c) => c.status === 'passed').length },
    };
  },

  // ---- 拓店记录 ----
  listExpansionRecords() {
    return readJson(FILES.EXPANSION);
  },
  addExpansionRecord(record) {
    const list = this.listExpansionRecords();
    record.id = 'EXP-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    record.createdAt = new Date().toISOString();
    list.push(record);
    writeJson(FILES.EXPANSION, list);
    this.log('EXPANSION', '拓店记录', { id: record.id, site: record.site });
    return record;
  },

  // ---- 工作流实例 ----
  listWorkflows() {
    return readJson(FILES.WORKFLOWS);
  },
  addWorkflow(instance) {
    const list = this.listWorkflows();
    instance.id = instance.id || 'WF-' + Date.now();
    instance.createdAt = new Date().toISOString();
    list.push(instance);
    writeJson(FILES.WORKFLOWS, list);
    this.log('WORKFLOW', '工作流实例', { id: instance.id, templateId: instance.templateId });
    return instance;
  },
  updateWorkflow(id, patch) {
    const list = this.listWorkflows();
    const idx = list.findIndex((w) => w.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      writeJson(FILES.WORKFLOWS, list);
      return list[idx];
    }
    return null;
  },
};
