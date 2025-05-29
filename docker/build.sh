#!/bin/bash

# 构建Docker镜像脚本
# 使用方法: ./docker/build.sh [tag]

set -e

# 默认标签
DEFAULT_TAG="cherry-markdown-viewer:latest"
TAG=${1:-$DEFAULT_TAG}

echo "🚀 开始构建Docker镜像..."
echo "📦 镜像标签: $TAG"

# 构建镜像
docker build -t "$TAG" .

echo "✅ 镜像构建完成!"
echo "📋 镜像信息:"
docker images | grep "cherry-markdown-viewer"

echo ""
echo "🔧 可用命令:"
echo "  运行容器: docker run -d -p 3000:3000 --name cherry-markdown $TAG"
echo "  使用docker-compose: docker-compose up -d"
echo "  查看日志: docker logs cherry-markdown"
echo "  停止容器: docker stop cherry-markdown" 