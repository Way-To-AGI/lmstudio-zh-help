#!/bin/bash

echo "===== LM Studio 镜像切换工具 ====="
echo "正在检查 Node.js 环境..."

if ! command -v node &> /dev/null; then
    echo "错误: 未找到 Node.js，请先安装 Node.js"
    echo "您可以从 https://nodejs.org/ 下载并安装 Node.js"
    echo "或者使用 Homebrew 安装: brew install node"
    read -p "按回车键继续..."
    exit 1
fi

echo "正在安装依赖..."
npm install

echo "正在运行工具..."
node index.js

read -p "按回车键继续..." 