# Docker 配置文件说明

本目录包含了 Cherry Markdown Viewer 应用的 Docker 相关配置文件。

## 📁 文件结构

```
docker/
├── nginx.conf      # Nginx 配置文件
├── build.sh        # 构建脚本
├── start.sh        # 快速启动脚本
└── README.md       # 本说明文件
```

## 📋 文件说明

### `nginx.conf`
- Nginx 服务器配置文件
- 配置应用在 3000 端口运行
- 包含 Gzip 压缩、安全头、静态资源缓存等优化
- 支持 Vue Router 的 history 模式
- 提供健康检查端点 `/health`

### `build.sh`
- Docker 镜像构建脚本
- 使用方法: `./docker/build.sh [tag]`
- 默认标签: `cherry-markdown-viewer:latest`

### `start.sh`
- 一键部署脚本
- 自动检查 Docker 环境
- 自动构建镜像并启动容器
- 包含健康检查和状态验证

## 🚀 快速使用

### 方法一：使用快速启动脚本（推荐）
```bash
./docker/start.sh
```

### 方法二：手动构建和运行
```bash
# 构建镜像
./docker/build.sh

# 运行容器
docker run -d -p 3000:3000 --name cherry-markdown cherry-markdown-viewer:latest
```

### 方法三：使用 docker-compose
```bash
# 在项目根目录执行
docker-compose up -d
```

## 🔧 自定义配置

如需修改配置，请编辑相应文件：
- 修改端口: 编辑 `nginx.conf` 和 `docker-compose.yml`
- 修改构建参数: 编辑 `Dockerfile`
- 修改启动参数: 编辑 `start.sh` 或 `docker-compose.yml` 