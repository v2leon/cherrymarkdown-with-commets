#!/usr/bin/env node

/**
 * 部署到Netlify的脚本
 * 使用方法：node scripts/deploy-netlify.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function deployToNetlify() {
  console.log('🚀 开始部署到Netlify...')
  
  // 检查构建产物
  const distPath = path.join(__dirname, '../dist')
  if (!fs.existsSync(distPath)) {
    console.error('❌ 未找到构建产物，请先运行 npm run build')
    process.exit(1)
  }
  
  // 检查是否安装了netlify CLI
  const { execSync } = await import('child_process')
  
  try {
    execSync('netlify --version', { stdio: 'pipe' })
  } catch (error) {
    console.log('📦 正在安装Netlify CLI...')
    try {
      execSync('npm install -g netlify-cli', { stdio: 'inherit' })
    } catch (installError) {
      console.error('❌ Netlify CLI安装失败，请手动安装：npm install -g netlify-cli')
      process.exit(1)
    }
  }
  
  try {
    console.log('🔑 请先登录Netlify（如果尚未登录）...')
    execSync('netlify login', { stdio: 'inherit' })
    
    console.log('📤 开始部署...')
    execSync(`netlify deploy --prod --dir=${distPath}`, { stdio: 'inherit' })
    
    console.log('🎉 部署完成！')
    console.log('📝 您可以在Netlify控制台查看部署详情：https://app.netlify.com/')
    
  } catch (error) {
    console.error('❌ 部署失败:', error.message)
    console.log('💡 提示：')
    console.log('1. 确保已安装Netlify CLI：npm install -g netlify-cli')
    console.log('2. 确保已登录Netlify：netlify login')
    console.log('3. 或者直接拖拽dist文件夹到 https://app.netlify.com/drop')
    process.exit(1)
  }
}

deployToNetlify().catch(console.error) 