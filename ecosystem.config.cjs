// PM2 进程管理配置（生产环境使用）
module.exports = {
  apps: [
    {
      name: 'lobster-agent',
      script: 'server/gateway.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 自动重启
      max_memory_restart: '512M',
      // 日志
      error_file: 'data/logs/pm2-error.log',
      out_file: 'data/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
