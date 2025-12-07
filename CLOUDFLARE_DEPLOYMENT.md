# 📦 Cloudflare Pages 部署指南

## 🎯 快速配置

### 1. Cloudflare Pages 项目设置

在 Cloudflare Pages 控制台，配置以下参数：

| 配置项 | 值 |
|--------|-----|
| **构建命令** | `npm run build` |
| **构建输出目录** | `dist` |
| **Node.js 版本** | `22.16.0` |
| **根目录** | `/` (默认) |

### 2. 环境变量（可选）

如果需要，可以在 Cloudflare Pages 设置中添加环境变量：

```bash
NODE_VERSION=22.16.0
NODE_OPTIONS=--max-old-space-size=4096
```

---

## 🔧 已自动配置的文件

✅ **`public/_headers`** - HTTP headers 配置（CORS、安全策略、缓存）
✅ **`public/_redirects`** - SPA 路由重定向
✅ **`.node-version`** - Node.js 版本锁定
✅ **`wrangler.toml`** - Cloudflare Workers 配置

---

## 📝 部署步骤

### 方式 1: 通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** → **Create a project**
3. 连接你的 Git 仓库（GitHub/GitLab）
4. 配置构建设置（见上方表格）
5. 点击 **Save and Deploy**

### 方式 2: 通过 Wrangler CLI

```bash
# 首次部署（预览）
npm run deploy:preview

# 生产环境部署
npm run deploy:production
```

---

## ⚠️ 常见问题与解决方案

### 问题 1: 构建时内存不足

**错误**: `JavaScript heap out of memory`

**解决方案**:
- Cloudflare Pages 默认提供足够的内存
- 如果仍有问题，可以在环境变量中设置：
  ```
  NODE_OPTIONS=--max-old-space-size=4096
  ```

### 问题 2: 构建警告 chunk size

**警告**: `Some chunks are larger than 500 kB`

**说明**:
- 这是正常的警告，不会影响部署
- 项目已将 `chunkSizeWarningLimit` 设置为 4MB
- 大文件主要是 PDF 处理库（pdf-lib, pdfjs-dist 等）

### 问题 3: CORS 错误

**错误**: `Cross-Origin-Embedder-Policy`

**解决方案**:
- 已在 `public/_headers` 中配置 COOP/COEP
- 这些 headers 对于 WebAssembly 和 SharedArrayBuffer 是必需的
- Cloudflare Pages 会自动应用这些 headers

### 问题 4: 404 错误

**问题**: 刷新页面时出现 404

**解决方案**:
- 已在 `public/_redirects` 中配置 SPA 重定向
- 所有路由都会重定向到 `index.html`

### 问题 5: Node.js 版本不匹配

**警告**: `Node.js version mismatch`

**解决方案**:
- 已创建 `.node-version` 文件指定 v22.16.0
- Cloudflare Pages 会自动使用此版本

---

## 🚀 性能优化建议

### 1. 启用 Cloudflare CDN 缓存

已在 `_headers` 中配置：
- 静态资源（assets）: 1 年缓存
- 图片: 1 年缓存
- 字体: 1 年缓存

### 2. 启用 Cloudflare 压缩

在 Cloudflare Dashboard:
- **Speed** → **Optimization** → **Auto Minify**: 启用 JS, CSS, HTML
- **Speed** → **Optimization** → **Brotli**: 启用

### 3. 启用 HTTP/3

在 Cloudflare Dashboard:
- **Network** → **HTTP/3 (with QUIC)**: 启用

---

## 📊 构建日志分析

### 正常的构建过程：

```
✓ 2031 modules transformed.
rendering chunks...
✓ built in X.XXs
```

### 可以忽略的警告：

1. **Module externalized warnings** (fs, path, crypto)
   - 正常：这些 Node.js 模块已被浏览器兼容版本替代

2. **Chunk size warnings**
   - 正常：PDF 处理库体积较大

3. **Deprecated package warnings**
   - 不影响功能：这些是依赖项的依赖

---

## 🔍 验证部署

部署完成后，测试以下功能：

- [ ] 访问首页正常加载
- [ ] 语言切换功能正常
- [ ] 选择任意 PDF 工具上传文件
- [ ] 文件处理功能正常
- [ ] 浏览器控制台无错误
- [ ] 所有页面路由正常

---

## 📞 获取帮助

如果部署仍有问题：

1. **查看完整构建日志**
   - Cloudflare Dashboard → Pages → 项目 → 选择部署 → View build log

2. **检查 Functions 日志**（如果使用）
   - Dashboard → Pages → 项目 → Functions → Real-time Logs

3. **验证配置**
   - 确认构建命令: `npm run build`
   - 确认输出目录: `dist`
   - 确认 Node.js 版本: `22.16.0`

---

## ✅ 部署检查清单

在部署前确认：

- [x] 所有文件已提交到 Git 仓库
- [x] `package.json` 包含所有必需的依赖
- [x] `public/_headers` 存在
- [x] `public/_redirects` 存在
- [x] `.node-version` 存在
- [x] 本地构建测试成功 (`npm run build`)

---

## 🎉 成功部署后

访问你的 Cloudflare Pages URL：
- 预览: `https://<branch>.<project>.pages.dev`
- 生产: `https://<project>.pages.dev`

可选配置自定义域名：
- Dashboard → Pages → 项目 → Custom domains → Set up a custom domain

---

**最后更新**: 2025-12-07
**版本**: PDFToolkit v1.10.5
