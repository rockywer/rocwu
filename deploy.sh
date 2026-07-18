#!/bin/bash
# ============================================
# 🦞 龙虾智能体 · 一键部署脚本（Linux 云服务器）
# 适用：Ubuntu 20.04+ / CentOS 7+ / Debian 11+
# ============================================
set -e

echo "🦞 龙虾智能体 · 开始部署..."
echo "============================================"

# 1. 检测 Node.js
if ! command -v node &> /dev/null; then
    echo "📦 安装 Node.js 18+..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "✅ Node.js $(node -v)"

# 2. 安装 PM2（进程守护）
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    sudo npm install -g pm2
fi
echo "✅ PM2 $(pm2 -v)"

# 3. 安装项目依赖
echo "📦 安装项目依赖..."
npm install --production

# 4. 确保 data 目录存在
mkdir -p data/logs

# 5. 停止旧实例（如果存在）
pm2 delete lobster-agent 2>/dev/null || true

# 6. 启动服务
echo "🚀 启动龙虾智能体..."
pm2 start ecosystem.config.cjs

# 7. 设置开机自启
pm2 save
pm2 startup systemd -u $(whoami) --hp $HOME 2>/dev/null || true

# 8. 等待并验证
sleep 2
echo ""
echo "🔍 健康检查..."
curl -s http://127.0.0.1:3000/api/health | python3 -m json.tool 2>/dev/null || curl -s http://127.0.0.1:3000/api/health

echo ""
echo "============================================"
echo "🦞 部署完成！"
echo "   控制台: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_IP'):3000"
echo "   管理: pm2 status"
echo "   日志: pm2 logs lobster-agent"
echo "============================================"
