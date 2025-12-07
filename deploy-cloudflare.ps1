# Cloudflare Pages 部署脚本 (PowerShell)
# 使用方法: .\deploy-cloudflare.ps1

Write-Host "🚀 开始部署 PDFToolkit 到 Cloudflare Pages..." -ForegroundColor Cyan

# 1. 检查依赖
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 错误: 未找到 npm" -ForegroundColor Red
    exit 1
}

# 2. 安装依赖
Write-Host "📦 安装依赖..." -ForegroundColor Yellow
npm install

# 3. 构建项目
Write-Host "🔨 构建项目..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 构建成功!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 构建输出目录: dist/" -ForegroundColor Cyan
Write-Host ""
Write-Host "接下来的步骤:" -ForegroundColor Yellow
Write-Host "1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com/"
Write-Host "2. 进入 Pages → Create a project"
Write-Host "3. 选择 'Upload assets' 选项"
Write-Host "4. 上传 dist/ 目录中的所有文件"
Write-Host ""
Write-Host "或者使用 Wrangler CLI:" -ForegroundColor Yellow
Write-Host "  npm install -g wrangler"
Write-Host "  wrangler pages deploy dist --project-name=pdftoolkit"

