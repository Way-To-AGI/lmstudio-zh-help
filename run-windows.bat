@echo off
echo ===== LM Studio 镜像切换工具 =====
echo 正在检查 Node.js 环境...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    echo 您可以从 https://nodejs.org/ 下载并安装 Node.js
    pause
    exit /b
)

echo 正在安装依赖...
call npm install

echo 正在运行工具...
node index.js

pause 