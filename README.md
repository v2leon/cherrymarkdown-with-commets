# Cherry Markdown Viewer

基于 Cherry Markdown 的静态网站单页应用，支持 Markdown 文件预览和评论解析。

## 功能特性

- 📖 **Markdown 预览**: 使用 Cherry Markdown 引擎进行高质量渲染
- 💬 **评论解析**: 自动解析 HTML 注释中的评论信息并在右侧面板显示
- 🌐 **URL 导入**: 支持从远程 URL 加载 Markdown 文件（如腾讯云 COS）
- ☁️ **云存储导入**: 支持直接从腾讯云COS浏览和导入Markdown文件
- 📁 **本地文件**: 支持打开本地 Markdown 文件进行预览
- 🎨 **现代 UI**: 简洁美观的用户界面设计
- 🚀 **一键部署**: 支持多种部署方式（Vercel、Netlify、腾讯云COS）

## 在线演示

🌐 **Live Demo**: [https://cherrymarkdown-with-commets.vercel.app](https://cherrymarkdown-with-commets.vercel.app)

## 评论格式

在 Markdown 文件中，可以使用以下格式添加评论：

```html
<!-- [COMMENT]这是一个评论内容 -->
```

这些评论会被自动解析并显示在右侧评论面板中。

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/v2leon/cherrymarkdown-with-commets.git
cd cherrymarkdown-with-commets
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `dist` 目录。

## 部署方式

### 🌟 推荐：GitHub + Vercel（免费，无需备案）

#### 方法一：自动部署（推荐）

1. **Fork 或上传代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择您的 GitHub 仓库
   - Vercel 会自动检测到这是一个 Vite 项目并配置构建设置

3. **自动部署**
   - 每次推送到 `main` 分支都会自动触发部署
   - 部署完成后会获得一个 `.vercel.app` 域名

#### 方法二：GitHub Actions 自动部署

如果需要更多控制，可以使用 GitHub Actions：

1. **获取 Vercel 令牌**
   - 在 [Vercel Settings](https://vercel.com/account/tokens) 创建令牌

2. **配置 GitHub Secrets**
   在 GitHub 仓库设置中添加以下 Secrets：
   - `VERCEL_TOKEN`: 您的 Vercel 令牌
   - `VERCEL_ORG_ID`: 组织 ID
   - `VERCEL_PROJECT_ID`: 项目 ID

3. **推送代码**
   GitHub Actions 会自动构建和部署

### 🔧 其他部署方式

#### Netlify 部署

```bash
npm run deploy:netlify
```

或直接拖拽 `dist` 文件夹到 [Netlify Drop](https://app.netlify.com/drop)

#### 腾讯云 COS 部署

1. 配置 `.env.local` 文件：
   ```env
   VITE_COS_SECRET_ID=your_secret_id
   VITE_COS_SECRET_KEY=your_secret_key
   VITE_COS_BUCKET=your_bucket_name
   VITE_COS_REGION=ap-beijing
   ```

2. 部署：
   ```bash
   npm run deploy:cos
   ```

## 配置说明

### 环境变量

创建 `.env.local` 文件（可选，仅在使用腾讯云COS时需要）：

```env
# 腾讯云COS配置（可选）
VITE_COS_SECRET_ID=your_secret_id_here
VITE_COS_SECRET_KEY=your_secret_key_here
VITE_COS_BUCKET=your_bucket_name
VITE_COS_REGION=ap-beijing
```

### Vercel 配置

项目已包含 `vercel.json` 配置文件，支持：
- SPA 路由重定向
- 静态资源缓存优化
- 安全头设置

## 测试文件

项目包含以下演示文件：
- 欢迎文档：`public/markdown_demo/welcome.md` - 应用启动时的默认文档
- 带评论的测试文档：`public/md/test-with-comments.md`
- 在线演示文档：https://raw.githubusercontent.com/v2leon/cherrymarkdown-with-commets/main/docs/online-demo.md

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **Markdown引擎**: Cherry Markdown
- **HTTP客户端**: Axios
- **部署平台**: Vercel / Netlify / 腾讯云COS

## 项目结构

```
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions 部署配置
├── src/
│   ├── App.vue                  # 主应用组件
│   ├── main.js                  # 应用入口
│   ├── style.css                # 全局样式
│   └── config/
│       └── cos.js               # COS配置文件
├── scripts/
│   ├── deploy-to-cos.js         # COS部署脚本
│   └── deploy-netlify.js        # Netlify部署脚本
├── md/                          # 测试 Markdown 文件
├── public/
│   └── md/                      # 公共测试文件
├── dist/                        # 构建输出目录
├── index.html                   # HTML 模板
├── package.json                 # 项目配置
├── vite.config.js               # Vite 配置
├── vercel.json                  # Vercel 配置
├── netlify.toml                 # Netlify 配置
├── env.example                  # 环境变量示例
└── README.md                   # 项目说明
```

## 使用说明

### 1. 从 URL 导入
- 点击"从URL导入"按钮
- 输入 Markdown 文件的 URL 地址
- 支持腾讯云COS、GitHub Raw等任何可访问的URL

### 2. 打开本地文件
- 点击"打开本地文件"按钮
- 选择本地的 .md 或 .markdown 文件
- 文件会在浏览器中直接解析，无需上传

### 3. 从云存储导入
- 点击"从云存储导入"按钮
- 配置腾讯云COS连接信息：
  - SecretId 和 SecretKey
  - 存储桶名称和地域
- 浏览存储桶中的Markdown文件
- 直接点击文件进行预览
- 注意：需要配置COS跨域访问规则或依赖代理服务

### 4. 查看评论
- 如果文档包含 `<!-- [COMMENT]内容 -->` 格式的评论
- 会自动在右侧面板显示所有评论
- 评论按出现顺序编号显示

## 部署优势对比

| 平台 | 优势 | 缺点 | 适用场景 |
|------|------|------|----------|
| **Vercel** | 🌟 全球CDN、自动HTTPS、GitHub集成 | 国内访问可能较慢 | 个人项目、国际用户 |
| **Netlify** | 🌟 拖拽部署、表单处理、边缘函数 | 构建时间限制 | 快速原型、小型项目 |
| **腾讯云COS** | 🌟 国内访问快、价格便宜 | 需要备案、配置复杂 | 国内用户、企业项目 |

## 注意事项

- 确保 Markdown 文件使用 UTF-8 编码
- 远程 URL 需要支持 CORS 跨域访问
- 评论格式必须严格按照 `<!-- [COMMENT]内容 -->` 的格式
- `.env.local` 文件包含敏感信息，请勿提交到代码仓库
- Vercel 免费版有使用限制，商业项目建议升级

## 故障排除

### 1. 构建失败
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### 2. Vercel 部署失败
- 检查 `vercel.json` 配置是否正确
- 确认 Node.js 版本兼容性
- 查看 Vercel 控制台的构建日志

### 3. 文件加载失败
- 检查URL是否可访问
- 确认文件编码为UTF-8
- 检查CORS设置

## 许可证

Apache-2.0 License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请通过以下方式联系：
- GitHub Issues: [项目Issues页面](https://github.com/v2leon/cherrymarkdown-with-commets/issues)
- Email: your.email@example.com 