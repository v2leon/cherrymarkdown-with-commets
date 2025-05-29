# Cherry Markdown Viewer Docker 部署指南

## 📋 概述

本文档将指导您如何在私有虚拟机服务器上部署 Cherry Markdown Viewer 应用。应用将运行在 3000 端口，避免与现有 80 端口应用冲突。

## 🛠️ 环境要求

- Docker Engine 20.10+
- Docker Compose 2.0+ (可选)
- 至少 1GB 可用内存
- 至少 2GB 可用磁盘空间

## 📦 部署步骤

### 方法一：使用预构建镜像（推荐）

#### 1. 上传项目文件到服务器

```bash
# 将整个项目目录上传到服务器
scp -r /path/to/cherry-markdown-viewer user@your-server:/opt/
```

#### 2. 在服务器上构建镜像

```bash
# 登录到服务器
ssh user@your-server

# 进入项目目录
cd /opt/cherry-markdown-viewer

# 构建Docker镜像
./docker/build.sh
```

#### 3. 运行容器

```bash
# 使用docker run命令
docker run -d \
  --name cherry-markdown-viewer \
  --restart unless-stopped \
  -p 3000:3000 \
  cherry-markdown-viewer:latest

# 或者使用docker-compose（推荐）
docker-compose up -d
```

### 方法二：手动构建和运行

#### 1. 构建镜像

```bash
# 在项目根目录执行
docker build -t cherry-markdown-viewer:latest .
```

#### 2. 运行容器

```bash
docker run -d \
  --name cherry-markdown-viewer \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  cherry-markdown-viewer:latest
```

## 🔍 验证部署

### 1. 检查容器状态

```bash
# 查看容器运行状态
docker ps | grep cherry-markdown

# 查看容器日志
docker logs cherry-markdown-viewer

# 查看容器详细信息
docker inspect cherry-markdown-viewer
```

### 2. 测试应用访问

```bash
# 健康检查
curl http://localhost:3000/health

# 访问主页
curl -I http://localhost:3000
```

### 3. 浏览器访问

在浏览器中访问：`http://your-server-ip:3000`

## 🔧 常用管理命令

### 容器管理

```bash
# 启动容器
docker start cherry-markdown-viewer

# 停止容器
docker stop cherry-markdown-viewer

# 重启容器
docker restart cherry-markdown-viewer

# 删除容器
docker rm cherry-markdown-viewer

# 查看容器资源使用情况
docker stats cherry-markdown-viewer
```

### 镜像管理

```bash
# 查看镜像
docker images | grep cherry-markdown

# 删除镜像
docker rmi cherry-markdown-viewer:latest

# 清理未使用的镜像
docker image prune
```

### 日志管理

```bash
# 查看实时日志
docker logs -f cherry-markdown-viewer

# 查看最近100行日志
docker logs --tail 100 cherry-markdown-viewer

# 查看特定时间段的日志
docker logs --since "2024-01-01T00:00:00" cherry-markdown-viewer
```

## 🔄 更新应用

### 1. 更新代码后重新部署

```bash
# 停止并删除旧容器
docker stop cherry-markdown-viewer
docker rm cherry-markdown-viewer

# 重新构建镜像
./docker/build.sh

# 启动新容器
docker-compose up -d
```

### 2. 零停机更新（使用docker-compose）

```bash
# 重新构建并启动
docker-compose up -d --build
```

## 🛡️ 安全配置

### 1. 防火墙设置

```bash
# 开放3000端口（根据您的防火墙工具调整）
# Ubuntu/Debian (ufw)
sudo ufw allow 3000

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### 2. 反向代理配置（可选）

如果您希望通过域名访问或添加SSL，可以配置Nginx反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 监控和维护

### 1. 设置健康检查

应用已内置健康检查端点：`/health`

### 2. 日志轮转

```bash
# 配置Docker日志轮转
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# 重启Docker服务
sudo systemctl restart docker
```

### 3. 定期备份

```bash
# 备份容器配置
docker inspect cherry-markdown-viewer > cherry-markdown-backup.json

# 导出镜像
docker save cherry-markdown-viewer:latest > cherry-markdown-image.tar
```

## 🚨 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   netstat -tlnp | grep :3000
   # 或使用ss命令
   ss -tlnp | grep :3000
   ```

2. **容器启动失败**
   ```bash
   # 查看详细错误信息
   docker logs cherry-markdown-viewer
   ```

3. **内存不足**
   ```bash
   # 检查系统资源
   free -h
   df -h
   ```

4. **网络连接问题**
   ```bash
   # 检查容器网络
   docker network ls
   docker inspect bridge
   ```

### 性能优化

1. **限制容器资源使用**
   ```bash
   docker run -d \
     --name cherry-markdown-viewer \
     --restart unless-stopped \
     -p 3000:3000 \
     --memory="512m" \
     --cpus="0.5" \
     cherry-markdown-viewer:latest
   ```

2. **使用多阶段构建优化镜像大小**
   - 已在Dockerfile中实现

## 📞 技术支持

如果遇到问题，请检查：
1. Docker服务是否正常运行
2. 端口是否被正确映射
3. 防火墙设置是否正确
4. 容器日志中的错误信息

---

**注意**: 请根据您的具体服务器环境调整相关配置。建议在生产环境部署前先在测试环境验证所有步骤。 