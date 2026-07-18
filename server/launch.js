// 启动辅助：杀掉占用 3000 端口的旧 node，后台拉起 gateway
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// 尝试释放 3000 端口（Windows）
try {
  const out = execSync('netstat -ano | findstr :3000', { encoding: 'utf-8', timeout: 5000 });
  const pids = [...new Set([...out.matchAll(/(\d+)\s+LISTENING/g)].map((m) => m[1]))];
  for (const pid of pids) {
    try { execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore', timeout: 5000 }); } catch {}
  }
} catch {}

setTimeout(() => {
  const child = spawn('node', ['server/gateway.js'], {
    cwd: ROOT,
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  child.unref();
  console.log('gateway launched pid=' + child.pid);
  setTimeout(() => process.exit(0), 800);
}, 600);
