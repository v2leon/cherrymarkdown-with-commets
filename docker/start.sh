#!/bin/bash

# Cherry Markdown Viewer 快速启动脚本
# 使用方法: ./docker/start.sh

set -e

echo "🚀 Cherry Markdown Viewer 快速部署脚本"
echo "========================================"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装Docker"
    echo "安装指南: https://docs.docker.com/engine/install/"
    exit 1
fi

# 检查Docker是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 服务未运行，请启动Docker服务"
    echo "启动命令: sudo systemctl start docker"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 检查端口是否被占用
if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "⚠️  警告: 端口3000已被占用"
    echo "请检查是否有其他应用使用此端口"
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 停止并删除已存在的容器
if docker ps -a | grep -q "cherry-markdown-viewer"; then
    echo "🔄 停止并删除已存在的容器..."
    docker stop cherry-markdown-viewer 2>/dev/null || true
    docker rm cherry-markdown-viewer 2>/dev/null || true
fi

# 构建镜像
echo "🔨 构建Docker镜像..."
docker build -t cherry-markdown-viewer:latest .

# 启动容器
echo "🚀 启动容器..."
docker run -d \
  --name cherry-markdown-viewer \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  cherry-markdown-viewer:latest

# 等待容器启动
echo "⏳ 等待应用启动..."
sleep 5

# 检查容器状态
if docker ps | grep -q "cherry-markdown-viewer"; then
    echo "✅ 应用启动成功!"
    echo ""
    echo "📋 应用信息:"
    echo "  - 容器名称: cherry-markdown-viewer"
    echo "  - 访问地址: http://localhost:3000"
    echo "  - 健康检查: http://localhost:3000/health"
    echo ""
    echo "🔧 管理命令:"
    echo "  - 查看日志: docker logs cherry-markdown-viewer"
    echo "  - 停止应用: docker stop cherry-markdown-viewer"
    echo "  - 重启应用: docker restart cherry-markdown-viewer"
    echo ""
    
    # 测试健康检查
    echo "🔍 测试应用健康状态..."
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ 应用健康检查通过"
    else
        echo "⚠️  健康检查失败，请查看日志: docker logs cherry-markdown-viewer"
    fi
else
    echo "❌ 容器启动失败"
    echo "请查看错误日志: docker logs cherry-markdown-viewer"
    exit 1
fi 