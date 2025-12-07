#!/bin/bash

# Cloudflare Pages 部署脚本
# 使用方法: ./deploy-cloudflare.sh

echo "🚀 开始部署 PDFToolkit 到 Cloudflare Pages..."

# 1. 检查依赖
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    exit 1
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm install

# 3. 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功!"
echo ""
echo "📂 构建输出目录: dist/"
echo ""
echo "接下来的步骤:"
echo "1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com/"
echo "2. 进入 Pages → Create a project"
echo "3. 选择 'Upload assets' 选项"
echo "4. 上传 dist/ 目录中的所有文件"
echo ""
echo "或者使用 Wrangler CLI:"
echo "  npm install -g wrangler"
echo "  wrangler pages deploy dist --project-name=pdftoolkit"

