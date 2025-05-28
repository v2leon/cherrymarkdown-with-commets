#!/usr/bin/env node

/**
 * 部署到腾讯云COS的脚本
 * 使用方法：node scripts/deploy-to-cos.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 检查是否安装了cos-nodejs-sdk-v5
function checkCOSSDK() {
  try {
    require.resolve('cos-nodejs-sdk-v5')
    return true
  } catch (e) {
    return false
  }
}

// 主要部署逻辑
async function deploy() {
  console.log('🚀 开始部署到腾讯云COS...')
  
  // 检查构建产物
  const distPath = path.join(__dirname, '../dist')
  if (!fs.existsSync(distPath)) {
    console.error('❌ 未找到构建产物，请先运行 npm run build')
    process.exit(1)
  }
  
  // 检查COS SDK
  if (!checkCOSSDK()) {
    console.log('📦 正在安装腾讯云COS SDK...')
    const { execSync } = await import('child_process')
    try {
      execSync('npm install cos-nodejs-sdk-v5', { stdio: 'inherit' })
    } catch (error) {
      console.error('❌ COS SDK安装失败:', error.message)
      process.exit(1)
    }
  }
  
  // 动态导入COS SDK
  const COS = (await import('cos-nodejs-sdk-v5')).default
  
  // 读取配置
  const configPath = path.join(__dirname, '../.env.local')
  if (!fs.existsSync(configPath)) {
    console.error('❌ 未找到 .env.local 配置文件')
    console.log('请创建 .env.local 文件并配置以下内容：')
    console.log('VITE_COS_SECRET_ID=your_secret_id')
    console.log('VITE_COS_SECRET_KEY=your_secret_key')
    console.log('VITE_COS_BUCKET=your_bucket_name')
    console.log('VITE_COS_REGION=your_region')
    process.exit(1)
  }
  
  // 读取环境变量
  const envContent = fs.readFileSync(configPath, 'utf8')
  const envVars = {}
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      envVars[key.trim()] = value.trim()
    }
  })
  
  const cos = new COS({
    SecretId: envVars.VITE_COS_SECRET_ID,
    SecretKey: envVars.VITE_COS_SECRET_KEY,
  })
  
  const bucket = envVars.VITE_COS_BUCKET || 'your-bucket-name'
  const region = envVars.VITE_COS_REGION || 'ap-beijing'
  
  // 上传文件函数
  function uploadFile(filePath, key) {
    return new Promise((resolve, reject) => {
      cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: fs.createReadStream(filePath),
        ContentType: getContentType(filePath)
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  
  // 获取文件MIME类型
  function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    }
    return mimeTypes[ext] || 'application/octet-stream'
  }
  
  // 递归获取所有文件
  function getAllFiles(dir, baseDir = dir) {
    const files = []
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir))
      } else {
        const relativePath = path.relative(baseDir, fullPath)
        files.push({
          localPath: fullPath,
          remotePath: relativePath.replace(/\\/g, '/')
        })
      }
    }
    
    return files
  }
  
  try {
    const files = getAllFiles(distPath)
    console.log(`📁 找到 ${files.length} 个文件需要上传`)
    
    let uploaded = 0
    for (const file of files) {
      try {
        await uploadFile(file.localPath, file.remotePath)
        uploaded++
        console.log(`✅ [${uploaded}/${files.length}] ${file.remotePath}`)
      } catch (error) {
        console.error(`❌ 上传失败: ${file.remotePath}`, error.message)
      }
    }
    
    console.log(`🎉 部署完成！成功上传 ${uploaded} 个文件`)
    console.log(`🌐 访问地址: https://${bucket}.cos.${region}.myqcloud.com/index.html`)
    
  } catch (error) {
    console.error('❌ 部署失败:', error.message)
    process.exit(1)
  }
}

// 运行部署
deploy().catch(console.error) 