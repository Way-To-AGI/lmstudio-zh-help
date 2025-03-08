# 🚀 LM Studio Mirror Switcher | 镜像切换工具

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/HuggingFace-Mirror-orange" alt="HuggingFace">
  <img src="https://img.shields.io/badge/LM%20Studio-Compatible-purple" alt="LM Studio">
</p>

> **Supercharge your LM Studio downloads with lightning-fast Chinese mirrors! No proxy needed. 🔥**
>
> **使用国内高速镜像为 LM Studio 提速，无需代理即可畅快下载模型！**

## ✨ Features | 功能特点

- 🔍 **Auto-detect** LM Studio installation directory
- 🔄 **One-click switch** from huggingface.co to hf-mirror.com
- 💾 **Backup creation** before making any changes
- 🌐 **Cross-platform** support for Windows, macOS, and Linux
- 🛡️ **Safe & reversible** operations with restore capability
- 💻 **Interactive CLI** with user-friendly prompts

## 🚀 Quick Start | 快速开始

### Method 1: Using npx (Recommended) | 方法一：使用 npx（推荐）

```bash
npx lmstudio-mirror-switcher
```

### Method 2: Global Installation | 方法二：全局安装

```bash
npm install -g lmstudio-mirror-switcher
lmstudio-mirror-switcher
```

### Method 3: Direct Execution | 方法三：直接运行

```bash
git clone https://github.com/yourusername/lmstudio-mirror-switcher.git
cd lmstudio-mirror-switcher
npm install
npm start
```

### Method 4: Executable File | 方法四：使用可执行文件

Download from [Releases](https://github.com/yourusername/lmstudio-mirror-switcher/releases) and run directly.

## 📖 Usage Guide | 使用指南

1. Run the tool and it will automatically search for LM Studio installation directories
2. Select the correct directory if multiple options are found
3. Manually input the path if not detected automatically
4. Close LM Studio before confirming the operation
5. Create a backup when prompted (highly recommended)
6. After completion, launch LM Studio which will now use hf-mirror.com

## ⚠️ Important Notes | 注意事项

- Close LM Studio before running this tool
- Always create a backup before making changes
- This tool only replaces huggingface.co with hf-mirror.com
- If issues occur, use the backup to restore original files

## 🔍 Troubleshooting | 常见问题

### Can't find LM Studio installation directory | 找不到 LM Studio 安装目录

Possible causes:
- Non-standard installation location
- Unsupported platform

Solutions:
- Manually specify the LM Studio installation path
- For macOS: typically `/Applications/LM Studio.app/Contents/Resources/app`
- For Windows: typically `C:\Users\username\AppData\Local\LM-Studio\resources\app`

### LM Studio doesn't work after replacement | 替换后 LM Studio 无法正常工作

Possible causes:
- Errors during replacement
- Incompatible LM Studio version

Solutions:
- Restore from backup
- Reinstall LM Studio

## 🛠️ For Developers | 开发者信息

```bash
# Install dependencies | 安装依赖
npm install

# Build npm package | 构建 npm 包
npm run build

# Build executables | 构建可执行文件
npm run pkg-all
```

## 📝 Why Use This Tool? | 为什么使用本工具？

If you're in China or regions with limited access to huggingface.co, downloading models through LM Studio can be painfully slow or impossible without a VPN. This tool automatically replaces all references to huggingface.co with hf-mirror.com (a fast Chinese mirror) in your LM Studio installation, allowing you to download models at full speed without any proxy configuration.

在中国或其他访问 huggingface.co 受限的地区，通过 LM Studio 下载模型可能非常缓慢，甚至在没有 VPN 的情况下无法下载。本工具自动将 LM Studio 安装目录中所有对 huggingface.co 的引用替换为 hf-mirror.com（一个快速的中国镜像站），让您无需任何代理配置即可以全速下载模型。

## 📜 License | 许可证

MIT 