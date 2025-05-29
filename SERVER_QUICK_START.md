# 🚀 服务器快速部署指南

## 一、准备工作

### 1. 上传项目到服务器
```bash
# 方法一：使用 scp 上传
scp -r /path/to/cherry-markdown-viewer user@your-server:/opt/

# 方法二：使用 git 克隆
ssh user@your-server
cd /opt
git clone https://github.com/your-repo/cherry-markdown-viewer.git
```

### 2. 安装 Docker（如果未安装）
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
```

## 二、一键部署

### 最简单的方式：
```bash
cd /opt/cherry-markdown-viewer
./docker/start.sh
```

### 或者使用 docker-compose：
```bash
cd /opt/cherry-markdown-viewer
docker-compose up -d
```

## 三、验证部署

```bash
# 检查容器状态
docker ps | grep cherry-markdown

# 测试访问
curl http://localhost:3000/health

# 查看日志
docker logs cherry-markdown-viewer
```

## 四、访问应用

在浏览器中访问：`http://your-server-ip:3000`

## 五、常用命令

```bash
# 重启应用
docker restart cherry-markdown-viewer

# 停止应用
docker stop cherry-markdown-viewer

# 查看日志
docker logs -f cherry-markdown-viewer

# 更新应用
./docker/start.sh
```

## 六、防火墙设置

```bash
# Ubuntu/Debian
sudo ufw allow 3000

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

**就这么简单！** 如果遇到问题，请查看详细的 `DOCKER_DEPLOYMENT.md` 文档。 