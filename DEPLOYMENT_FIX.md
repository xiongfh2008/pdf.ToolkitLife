# 🚀 Cloudflare Pages 部署修复说明

## ✅ 已完成的修复

### 1. 创建的配置文件

| 文件 | 作用 | 状态 |
|------|------|------|
| `public/_headers` | HTTP 安全头、CORS 配置、缓存策略 | ✅ 已创建 |
| `public/_redirects` | SPA 路由重定向（解决 404 问题） | ✅ 已创建 |
| `.node-version` | 锁定 Node.js 版本为 22.16.0 | ✅ 已创建 |
| `CLOUDFLARE_DEPLOYMENT.md` | 完整部署指南 | ✅ 已创建 |
| `scripts/cloudflare-check.js` | 部署前检查脚本 | ✅ 已创建 |

### 2. 新增的 NPM 脚本

```bash
npm run cloudflare:check  # 部署前配置检查
```

---

## 📋 Cloudflare Pages 控制台配置

### 必需配置（复制粘贴）

```
构建命令:        npm run build
构建输出目录:    dist
Node.js 版本:   22.16.0
根目录:          /
```

### 可选环境变量（如果需要）

```
NODE_OPTIONS=--max-old-space-size=4096
```

---

## 🔧 关于您的构建日志

### 您看到的日志

```
✓ 2031 modules transformed.
rendering chunks...
[plugin vite:reporter] 
(!) 
```

### 说明

✅ **这是正常的！**

- `(!)` 是 Vite 的警告标记，通常是关于 chunk size 的警告
- 日志被截断了，但构建会继续完成
- 这不会影响部署成功

### 完整的警告内容（本地构建显示）

```
(!) Some chunks are larger than 500 kB after minification.
```

**原因**: PDF 处理库（pdf-lib, pdfjs-dist）体积较大
**影响**: 无，这是正常的
**已优化**: 
- 设置了 `chunkSizeWarningLimit: 4000` (4MB)
- 使用了 `manualChunks` 分离大型库

---

## 🎯 部署步骤

### 方式 1: 通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com/
   - 进入 **Pages**

2. **连接 Git 仓库**
   - 点击 **Create a project**
   - 选择 **Connect to Git**
   - 授权并选择你的仓库

3. **配置构建设置**
   ```
   Framework preset:      None (或 Vite)
   Build command:         npm run build
   Build output directory: dist
   Root directory:        / (留空)
   ```

4. **环境变量**（可选）
   - 点击 **Environment variables**
   - 添加: `NODE_VERSION` = `22.16.0`

5. **开始部署**
   - 点击 **Save and Deploy**
   - 等待构建完成（约 30-60 秒）

### 方式 2: 通过 Wrangler CLI

```bash
# 安装 Wrangler (如果还没安装)
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到预览环境
npm run deploy:preview

# 部署到生产环境
npm run deploy:production
```

---

## ✅ 验证部署成功

部署完成后，打开你的网站 URL，检查：

- [ ] ✅ 首页加载正常
- [ ] ✅ 语言切换功能正常（中文、英文、日语、韩语、西班牙语、繁体中文）
- [ ] ✅ 点击任意 PDF 工具能打开
- [ ] ✅ 上传 PDF 文件能正常处理
- [ ] ✅ 刷新页面不会出现 404
- [ ] ✅ 浏览器控制台无错误

---

## 🐛 常见问题解决

### 问题 1: 构建失败 "JavaScript heap out of memory"

**解决方案**:
在 Cloudflare Pages 环境变量中添加：
```
NODE_OPTIONS=--max-old-space-size=4096
```

### 问题 2: 页面刷新后 404

**原因**: SPA 路由问题
**已修复**: `public/_redirects` 文件已配置
**验证**: 刷新任意工具页面，应该正常显示

### 问题 3: CORS 错误

**原因**: WebAssembly 需要特殊的 CORS 配置
**已修复**: `public/_headers` 文件已配置 COOP/COEP
**验证**: PDF 工具能正常处理文件

### 问题 4: 构建警告 chunk size

**说明**: 这是正常的，不影响功能
**原因**: PDF 处理库体积大
**优化**: 已配置代码分割和缓存策略

### 问题 5: Node.js 版本警告

**说明**: Cloudflare 会使用 `.node-version` 文件
**验证**: 构建日志显示 `Detected... nodejs@22.16.0`

---

## 📊 性能优化（已自动配置）

### 缓存策略

- **静态资源** (`/assets/*`): 1 年缓存
- **图片** (`/images/*`): 1 年缓存
- **字体** (`*.woff`, `*.woff2`): 1 年缓存

### 安全头

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 代码分割

- `pdf-worker`: pdfjs-dist
- `pdf-libs`: pdf-lib, pdfkit, blob-stream
- `image-libs`: html2canvas, cropperjs, heic2any
- `compression`: jszip, archiver

---

## 🎉 部署成功后

### 你的网站 URL

- **预览环境**: `https://<branch>.<project>.pages.dev`
- **生产环境**: `https://<project>.pages.dev`

### 配置自定义域名（可选）

1. Cloudflare Dashboard → Pages → 你的项目
2. **Custom domains** → **Set up a custom domain**
3. 输入你的域名（如 `pdftoolkit.com`）
4. 按照提示配置 DNS 记录

### 启用额外优化（推荐）

1. **Auto Minify**
   - Dashboard → Speed → Optimization
   - 启用 JavaScript, CSS, HTML

2. **Brotli 压缩**
   - Dashboard → Speed → Optimization
   - 启用 Brotli

3. **HTTP/3**
   - Dashboard → Network
   - 启用 HTTP/3 (with QUIC)

---

## 📞 需要帮助？

### 查看构建日志

1. Cloudflare Dashboard → Pages
2. 选择你的项目
3. 点击最新的部署
4. 查看 **Build log** 和 **Function log**

### 本地测试部署配置

```bash
# 运行配置检查
npm run cloudflare:check

# 本地构建测试
npm run build

# 本地预览
npm run preview
```

### 调试工具

```bash
# 查看构建输出
ls -la dist/

# 测试 _headers 文件
cat public/_headers

# 测试 _redirects 文件
cat public/_redirects
```

---

## 🎯 下一步

1. ✅ 提交所有更改到 Git
   ```bash
   git add .
   git commit -m "Add Cloudflare Pages deployment configuration"
   git push
   ```

2. ✅ 在 Cloudflare Dashboard 创建项目并连接仓库

3. ✅ 配置构建设置（见上方）

4. ✅ 点击 Deploy

5. ✅ 等待构建完成并测试网站

---

**创建日期**: 2025-12-07
**项目版本**: PDFToolkit v1.10.5
**Node.js 版本**: 22.16.0
**构建工具**: Vite 7.1.11

✨ **所有配置已完成，可以开始部署了！**

