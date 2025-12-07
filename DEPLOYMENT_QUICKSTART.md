# 🚀 Cloudflare Pages 部署快速入门

## 📋 您的项目已准备好部署！

所有必要的配置文件已创建完成。您只需 3 个步骤即可完成部署。

---

## ⚡ 3 步快速部署

### 第 1 步：验证构建

运行部署前检查：

```bash
npm run deploy:check
```

如果看到 "🎉 All checks passed!"，继续下一步。

---

### 第 2 步：推送到 Git

```bash
git add .
git commit -m "Ready for Cloudflare Pages deployment"
git push origin main
```

---

### 第 3 步：连接 Cloudflare Pages

1. 访问：https://dash.cloudflare.com/
2. 进入：**Pages** → **Create a project**
3. 选择您的 Git 仓库：`freetopdf`
4. 确认构建设置（应该自动检测）：
   ```
   Build command:     npm run build
   Build output:      dist
   Node.js version:   22.x
   ```
5. 点击 **Save and Deploy**

---

## 🎯 完成！

部署完成后，您将获得：
- 🌐 一个 `*.pages.dev` 域名（例如：`pdftoolkit.pages.dev`）
- 🔒 自动 HTTPS 证书
- 🚀 全球 CDN 加速（200+ 节点）
- 🔄 自动部署（每次 Git push）

---

## 📁 已创建的配置文件

| 文件 | 说明 |
|------|------|
| `wrangler.toml` | Cloudflare Pages 主配置 |
| `public/_headers` | HTTP 安全头和缓存策略 |
| `public/_redirects` | 404 重定向配置 |
| `.nvmrc` / `.node-version` | Node.js 版本指定 |
| `.github/workflows/cloudflare-pages.yml` | GitHub Actions 自动部署（可选）|
| `scripts/pre-deploy-check.js` | 部署前验证脚本 |

---

## 🛠️ 有用的命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 部署前检查
npm run deploy:check

# 手动部署（需要先安装 wrangler）
npm run deploy:preview
npm run deploy:production
```

---

## 🔧 高级配置

### 自定义域名

部署成功后：
1. Cloudflare Pages → 您的项目 → **Custom domains**
2. 点击 **Set up a domain**
3. 输入域名：`www.pdftoolkit.com`
4. Cloudflare 自动配置 DNS 和 SSL ✅

### 环境变量

如需配置环境变量：
1. Cloudflare Pages → 您的项目 → **Settings** → **Environment variables**
2. 添加变量（例如）：
   ```
   BASE_URL=/
   SIMPLE_MODE=false
   ```

### GitHub Actions 自动部署

如果您想使用 GitHub Actions：
1. 在 Cloudflare 获取 API Token 和 Account ID
2. 在 GitHub 仓库添加 Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. 推送代码即可自动部署

详细说明请参阅：[CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)

---

## ❓ 常见问题

### Q: 构建显示警告是否正常？

**A**: 是的！以下警告是正常的：
- ✅ Module "fs", "path", "crypto" externalized（Vite 自动处理）
- ✅ Chunk size warnings（PDF 库较大）
- ✅ npm deprecated warnings（不影响生产）

### Q: 部署需要多长时间？

**A**: 首次部署约 3-5 分钟，后续部署约 1-2 分钟。

### Q: 如何回滚到之前的版本？

**A**: Cloudflare Pages 保留所有部署历史：
1. 进入项目 → **Deployments**
2. 选择之前的部署
3. 点击 **Rollback**

### Q: 支持哪些浏览器？

**A**: 支持所有现代浏览器：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

---

## 📊 性能优化（已配置）

✅ **静态资源缓存**：1 年（immutable）
✅ **HTML 缓存**：不缓存（always fresh）
✅ **Gzip/Brotli 压缩**：自动
✅ **HTTP/2 和 HTTP/3**：启用
✅ **代码分割**：已优化
✅ **全球 CDN**：200+ 节点

---

## 🎉 完成！

您的 **PDFToolkit** 项目已完全准备好部署到 Cloudflare Pages！

**下一步**：
```bash
# 1. 验证
npm run deploy:check

# 2. 推送
git push origin main

# 3. 在 Cloudflare 连接仓库
```

**祝部署成功！** 🚀

---

## 📞 需要更多帮助？

- 📖 详细文档：[CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)
- 🌐 Cloudflare 文档：https://developers.cloudflare.com/pages/
- 📝 README：[README.md](README.md)

