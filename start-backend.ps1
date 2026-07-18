# 一键启动浙商创新俱乐部后端（含端口占用自清理 + 启动校验）
$ErrorActionPreference = 'SilentlyContinue'

# 1. 清理已占用 3000 端口的旧进程
$occupant = (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess
if ($occupant) {
    Write-Host "检测到端口 3000 被 PID $occupant 占用，正在结束..."
    Stop-Process -Id $occupant -Force
    Start-Sleep -Seconds 1
}
# 兜底：结束所有 node
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep -Seconds 1

# 2. 启动后端（新窗口，便于查看日志）
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Start-Process -FilePath "node" -ArgumentList "server/gateway.js" -WorkingDirectory $root -PassThru

# 3. 等待并校验
Start-Sleep -Seconds 2.5
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/health" -TimeoutSec 3
    Write-Host ("✅ 后端已启动  agent={0}  skills={1}" -f $r.agent, $r.skills)
} catch {
    Write-Host "⚠️ 启动后健康检查失败：$_"
}

# 4. 验证研究院路由（避免 PowerShell GBK 中文乱码，用 python 输出）
$py = @'
import urllib.request, json
for q in ['研究院有哪些业务板块','研究院会员权益对比','研究院年度活动','研究院组织架构','产业资本板块怎么对接']:
    body = json.dumps({'sessionId':'t','message':q}).encode()
    req = urllib.request.Request('http://127.0.0.1:3000/api/chat', data=body, headers={'Content-Type':'application/json'})
    r = json.load(urllib.request.urlopen(req))
    print(q, '->', r['intent']['skill'], '/', r['intent']['action'])
'@
$py | Out-File -Encoding utf8 "$env:TEMP\_verify_inst.py"
python "$env:TEMP\_verify_inst.py"
Remove-Item "$env:TEMP\_verify_inst.py" -ErrorAction SilentlyContinue
