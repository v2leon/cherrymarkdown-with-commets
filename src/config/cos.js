// 腾讯云COS配置
// 注意：在生产环境中，这些敏感信息应该通过环境变量或安全的配置管理系统来管理

export const COS_CONFIG = {
  // 基础配置
  Region: 'ap-beijing', // 存储桶所在地域
  Bucket: 'aipage-1312015636', // 存储桶名称
  
  // 访问密钥 - 生产环境中应该从环境变量获取
  SecretId: process.env.VITE_COS_SECRET_ID || '', // 替换为您的SecretId
  SecretKey: process.env.VITE_COS_SECRET_KEY || '', // 替换为您的SecretKey
  
  // 临时密钥配置（推荐使用）
  getAuthorization: null, // 可以配置获取临时密钥的函数
  
  // 其他配置
  Protocol: 'https:', // 协议
  Domain: '', // 自定义域名
  
  // 预设的测试URL
  TEST_URLS: {
    markdown1: 'https://aipage-1312015636.cos.ap-beijing.myqcloud.com/markdown/01-%E5%A4%A9%E5%B7%A5AI%E4%B8%93%E5%AE%B6%E6%96%87%E6%A1%A3%E6%99%BA%E8%83%BD%E4%BD%93%E8%B0%83%E7%A0%94%E6%8A%A5%E5%91%8A.md'
  }
}

// 环境变量配置说明
export const ENV_SETUP_GUIDE = `
为了安全使用腾讯云COS，请在项目根目录创建 .env.local 文件，并添加以下配置：

VITE_COS_SECRET_ID=your_secret_id_here
VITE_COS_SECRET_KEY=your_secret_key_here

注意：
1. .env.local 文件已在 .gitignore 中忽略，不会被提交到代码仓库
2. 生产环境建议使用临时密钥或STS服务
3. 确保密钥具有适当的权限范围
` 