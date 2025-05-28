# 部署指南

本文档详细说明如何将 Cherry Markdown Viewer 部署到各种平台。

## 🌟 推荐方案：GitHub + Vercel

### 步骤 1：准备 GitHub 仓库

1. **创建 GitHub 仓库**
   - 登录 [GitHub](https://github.com)
   - 点击右上角的 "+" → "New repository"
   - 仓库名建议：`cherry-markdown-viewer`
   - 设置为 Public（免费用户）
   - 勾选 "Add a README file"

2. **上传代码到 GitHub**
   ```bash
   # 在项目根目录执行
   git init
   git add .
   git commit -m "Initial commit: Cherry Markdown Viewer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 步骤 2：连接 Vercel

1. **注册/登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Sign up" 或 "Log in"
   - 选择 "Continue with GitHub"
   - 授权 Vercel 访问您的 GitHub 账户

2. **导入项目**
   - 在 Vercel 控制台点击 "New Project"
   - 从 GitHub 仓库列表中选择您的项目
   - 点击 "Import"

3. **配置项目**
   - **Project Name**: 保持默认或自定义
   - **Framework Preset**: Vercel 会自动检测为 "Vite"
   - **Root Directory**: 保持默认 "./"
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 1-3 分钟）
   - 获得部署 URL，格式如：`https://your-repo-name.vercel.app`

### 步骤 3：自动部署设置

部署完成后，每次推送代码到 `main` 分支都会自动触发重新部署：

```bash
# 修改代码后
git add .
git commit -m "Update: 描述您的更改"
git push origin main
```

## 🔧 高级配置

### 自定义域名

1. **在 Vercel 控制台**
   - 进入项目设置
   - 点击 "Domains"
   - 添加您的自定义域名
   - 按照提示配置 DNS 记录

2. **DNS 配置示例**
   ```
   类型: CNAME
   名称: www (或 @)
   值: cname.vercel-dns.com
   ```

### 环境变量配置

如果需要配置环境变量（如腾讯云COS密钥）：

1. **在 Vercel 控制台**
   - 进入项目设置
   - 点击 "Environment Variables"
   - 添加变量：
     - `VITE_COS_SECRET_ID`
     - `VITE_COS_SECRET_KEY`
     - `VITE_COS_BUCKET`
     - `VITE_COS_REGION`

2. **重新部署**
   - 添加环境变量后需要重新部署
   - 在 "Deployments" 页面点击最新部署的 "..." → "Redeploy"

## 🚀 GitHub Actions 自动部署（可选）

如果需要更多控制，可以使用 GitHub Actions：

### 步骤 1：获取 Vercel 信息

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录并获取项目信息**
   ```bash
   vercel login
   vercel link
   ```

3. **获取项目 ID 和组织 ID**
   ```bash
   cat .vercel/project.json
   ```

### 步骤 2：配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. **获取 Vercel Token**
   - 访问 [Vercel Settings](https://vercel.com/account/tokens)
   - 创建新的 Token
   - 复制 Token 值

2. **在 GitHub 添加 Secrets**
   - 进入仓库 → Settings → Secrets and variables → Actions
   - 添加以下 Secrets：
     - `VERCEL_TOKEN`: 您的 Vercel Token
     - `VERCEL_ORG_ID`: 从 `.vercel/project.json` 获取
     - `VERCEL_PROJECT_ID`: 从 `.vercel/project.json` 获取

### 步骤 3：推送代码

推送代码后，GitHub Actions 会自动构建和部署。

## 📱 其他部署选项

### Netlify 部署

1. **方法一：拖拽部署**
   - 运行 `npm run build`
   - 访问 [Netlify Drop](https://app.netlify.com/drop)
   - 拖拽 `dist` 文件夹到页面

2. **方法二：Git 集成**
   - 访问 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择 GitHub 仓库
   - 配置构建设置：
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **方法三：CLI 部署**
   ```bash
   npm run deploy:netlify
   ```

### GitHub Pages 部署

1. **创建部署分支**
   ```bash
   npm run build
   git checkout -b gh-pages
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

2. **配置 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages"
   - 点击 Save

### 腾讯云 COS 部署

1. **配置环境变量**
   ```bash
   cp env.example .env.local
   # 编辑 .env.local 填入您的配置
   ```

2. **部署**
   ```bash
   npm run deploy:cos
   ```

## 🔍 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清除缓存
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Vercel 部署失败**
   - 检查 Node.js 版本（推荐 18+）
   - 查看 Vercel 控制台的构建日志
   - 确认 `vercel.json` 配置正确

3. **文件加载失败**
   - 检查 URL 是否可访问
   - 确认 CORS 设置
   - 验证文件编码为 UTF-8

### 性能优化

1. **启用 Gzip 压缩**
   - Vercel 默认启用
   - 其他平台可能需要手动配置

2. **CDN 缓存**
   - 静态资源自动缓存
   - 可在 `vercel.json` 中自定义缓存策略

3. **图片优化**
   - 使用 WebP 格式
   - 启用懒加载

## 📊 监控和分析

### Vercel Analytics

1. **启用分析**
   - 在 Vercel 控制台启用 Analytics
   - 查看访问量、性能指标

2. **自定义事件**
   ```javascript
   // 在代码中添加
   import { track } from '@vercel/analytics'
   
   track('file_loaded', { type: 'markdown' })
   ```

### Google Analytics

1. **添加跟踪代码**
   ```html
   <!-- 在 index.html 中添加 -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🔒 安全考虑

1. **环境变量**
   - 敏感信息使用环境变量
   - 不要在代码中硬编码密钥

2. **CORS 设置**
   - 限制允许的域名
   - 避免使用通配符 `*`

3. **内容安全策略**
   - 在 `vercel.json` 中配置 CSP 头
   - 防止 XSS 攻击

## 📞 获取帮助

如果遇到问题：

1. **查看文档**
   - [Vercel 文档](https://vercel.com/docs)
   - [Netlify 文档](https://docs.netlify.com)

2. **社区支持**
   - [Vercel Discord](https://vercel.com/discord)
   - [GitHub Issues](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/issues)

3. **联系方式**
   - 项目 Issues
   - Email: your.email@example.com 