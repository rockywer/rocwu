import { AI_ROLES, INCENTIVE_PROGRAMS, EU_SITES } from '../knowledge.js';
import { store } from '../store.js';

export const description = 'AI店铺运营专员 - 基础履约岗，店铺日常运维、商品管理、订单跟进、基础数据复盘';
export const trigger = ['店铺', '商品', '订单', '上架', '库存', '售后'];

export function handler(ctx) {
  const action = ctx.action || 'overview';
  
  switch (action) {
    case 'add_product':
      return addProduct(ctx);
    case 'check_inventory':
      return checkInventory(ctx);
    case 'update_shop':
      return updateShopInfo(ctx);
    case 'newbie_task':
      return checkNewbieTask(ctx);
    case 'overview':
    default:
      return getRoleOverview();
  }
}

function getRoleOverview() {
  const role = AI_ROLES.shop;
  return `## 🏪 AI店铺运营专员 · 基础履约岗\n\n**核心定位**：${role.description}\n\n**核心职责**：\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**专属能力**：\n${role.capabilities.map((c) => `• ${c}`).join('\n')}\n\n**KPI考核**：\n${role.kpi.map((k) => `• ${k}`).join('\n')}`;
}

function addProduct(ctx) {
  const { name, category, price, stock, sites } = ctx;
  
  if (!name || !price) {
    return '❌ 请提供商品名称和价格。\n\n格式：add_product name=智能保温杯 category=居家用品 price=29.99 stock=1000 sites=DE,FR';
  }
  
  const product = {
    name,
    category: category || '其他',
    price: parseFloat(price),
    stock: parseInt(stock) || 100,
    sites: sites ? sites.split(',') : ['DE'],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  store.addProduct(product);
  
  return `## ✅ 商品上架申请已提交\n\n**商品名称**：${product.name}\n**品类**：${product.category}\n**售价**：€${product.price}\n**库存**：${product.stock}\n**目标站点**：${product.sites.join('、')}\n**状态**：待审核\n\n### 📋 上架流程：\n1. 合规审核（AI合规专员）\n2. 内容审核（AI内容达人专员）\n3. 审核通过自动上架\n\n### ⏰ 预计时间：\n• 审核周期：1-2个工作日\n• 上架时间：审核通过后即时生效`;
}

function checkInventory(ctx) {
  const { shopId } = ctx;
  
  const products = store.listProducts().filter((p) => p.stock !== undefined);
  
  const lowStock = products.filter((p) => p.stock < 100);
  const normalStock = products.filter((p) => p.stock >= 100 && p.stock < 500);
  const highStock = products.filter((p) => p.stock >= 500);
  
  return `## 📦 库存监控报告\n\n**店铺**：${shopId || '当前店铺'}\n**统计时间**：${new Date().toISOString().slice(0, 10)}\n\n### 📊 库存概况：\n• 总商品数：${products.length}\n• 低库存（<100）：${lowStock.length}款 ⚠️\n• 正常库存（100-500）：${normalStock.length}款\n• 高库存（>=500）：${highStock.length}款\n\n### 🚨 低库存预警：\n${lowStock.length > 0 ? lowStock.map((p) => `• **${p.name}**：库存 ${p.stock}，建议及时补货`).join('\n') : '✅ 暂无低库存预警'}\n\n### 💡 补货建议：\n• 优先补货热销商品\n• 结合销售周期安排备货\n• 关注物流时效，提前下单`;
}

function updateShopInfo(ctx) {
  const { shopId, name, site, status } = ctx;
  
  if (!shopId) {
    return '❌ 请提供店铺ID。\n\n格式：update_shop shopId=SHOP-001 name=新店铺名 site=DE status=active';
  }
  
  const updates = {};
  if (name) updates.name = name;
  if (site) updates.site = site;
  if (status) updates.status = status;
  
  const result = store.updateShop(shopId, updates);
  
  if (!result) {
    return `❌ 店铺 ${shopId} 不存在`;
  }
  
  return `## ✅ 店铺信息已更新\n\n**店铺ID**：${result.id}\n**店铺名称**：${result.name}\n**站点**：${result.site}\n**状态**：${result.status}\n**更新时间**：${result.updatedAt}`;
}

function checkNewbieTask(ctx) {
  const { shopId } = ctx;
  
  const tasks = {
    '5品上架': {
      target: 5,
      current: Math.floor(Math.random() * 5),
      deadline: '入驻后15天',
      reward: '低佣政策激活',
    },
    '3品上架低佣': {
      target: 3,
      current: Math.floor(Math.random() * 3),
      deadline: '入驻后14天',
      reward: '佣金降至2%',
    },
    '首单成交': {
      target: 1,
      current: Math.random() > 0.5 ? 1 : 0,
      deadline: '入驻后30天',
      reward: '额外广告金',
    },
    '店铺装修': {
      target: 1,
      current: Math.random() > 0.3 ? 1 : 0,
      deadline: '入驻后7天',
      reward: '基础流量扶持',
    },
  };
  
  const completed = Object.values(tasks).filter((t) => t.current >= t.target).length;
  const total = Object.keys(tasks).length;
  const progress = Math.round((completed / total) * 100);
  
  return `## 🎯 新手任务进度\n\n**店铺**：${shopId || '当前店铺'}\n**完成进度**：${completed}/${total}（${progress}%）\n\n### 📋 任务详情：\n${Object.entries(tasks).map(([name, task]) => {
    const status = task.current >= task.target ? '✅ 已完成' : `⏳ ${task.current}/${task.target}`;
    return `**${name}**\n• 进度：${status}\n• 截止时间：${task.deadline}\n• 奖励：${task.reward}\n`;
  }).join('\n')}\n\n### 💡 建议：\n${progress < 50 ? '尽快完成新手任务，激活平台扶持政策' : progress < 100 ? '继续完成剩余任务，获取全部奖励' : '恭喜！所有新手任务已完成'}

### 🎁 可申领权益：
${INCENTIVE_PROGRAMS.filter((p) => p.id === 'new-seller').map((p) => `• **${p.name}**：${p.benefit}`).join('\n')}`;
}
