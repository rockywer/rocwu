# 🦞 龙虾智能体 · 部署指南

## 部署方式一：Lighthouse / 云服务器（推荐）

### 前置条件
- 一台 Linux 云服务器（Ubuntu 20.04+ / CentOS 7+ / Debian 11+）
- 安全组开放 **3000 端口**（TCP）
- 服务器已安装 Git（用于拉取代码）

### 步骤 1：上传代码到服务器

```bash
# 方式 A：通过 Git
git clone <你的仓库地址> lobster-agent
cd lobster-agent

# 方式 B：通过 SCP 上传
scp -r ./ root@<服务器IP>:/root/lobster-agent/
ssh root@<服务器IP>
cd /root/lobster-agent
```

### 步骤 2：执行一键部署

```bash
chmod +x deploy.sh
bash deploy.sh
```

### 步骤 3：验证

```bash
# 检查服务状态
pm2 status

# 查看日志
pm2 logs lobster-agent

# 访问控制台
# 浏览器打开: http://<服务器IP>:3000
```

---

## 部署方式二：直接运行（开发/测试）

```bash
npm install
npm start
# 控制台: http://localhost:3000
```

---

## PM2 常用命令

| 命令 | 说明 |
|------|------|
| `pm2 status` | 查看所有进程状态 |
| `pm2 logs lobster-agent` | 查看实时日志 |
| `pm2 restart lobster-agent` | 重启服务 |
| `pm2 stop lobster-agent` | 停止服务 |
| `pm2 delete lobster-agent` | 删除进程 |

---

## 端口与安全

- 默认端口：**3000**
- 确保云服务器防火墙/安全组放行 3000 端口
- 生产环境建议配置 Nginx 反向代理 + SSL

### Nginx 反向代理配置（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 项目结构

```
lobster-agent/
├── server/           # 后端核心（Node.js + Express + WebSocket）
│   ├── gateway.js    # 主网关：会话/路由/技能调度
│   ├── identity.js   # 智能体身份
│   ├── knowledge.js  # 知识库
│   ├── store.js      # 轻量存储
│   └── skills/       # 14 个技能模块
├── client/           # 前端控制台
│   ├── index.html    # 浙商风格 UI
│   └── app.js        # WebSocket 交互逻辑
├── data/             # 运行时数据（自动生成）
├── ecosystem.config.cjs  # PM2 配置
├── deploy.sh         # 一键部署脚本
└── package.json
```
