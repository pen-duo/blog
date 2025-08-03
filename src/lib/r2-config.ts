import { S3Client } from '@aws-sdk/client-s3'

// Cloudflare R2 配置
export const R2_CONFIG = {
  endpoint: process.env.R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
  bucketName: process.env.R2_BUCKET_NAME || 'blog-images',
  customDomain: process.env.R2_CUSTOM_DOMAIN || '', // 如: https://images.yourdomain.com
}

// 创建S3客户端
export const s3Client = new S3Client({
  endpoint: R2_CONFIG.endpoint,
  region: R2_CONFIG.region,
  credentials: {
    accessKeyId: R2_CONFIG.credentials.accessKeyId,
    secretAccessKey: R2_CONFIG.credentials.secretAccessKey,
  },
})

// 获取图片URL
export function getImageUrl(key: string): string {
  if (R2_CONFIG.customDomain) {
    return `${R2_CONFIG.customDomain}/${key}`
  }
  return `${R2_CONFIG.endpoint}/${R2_CONFIG.bucketName}/${key}`
}

// 验证配置
export function validateR2Config(): boolean {
  return !!(R2_CONFIG.credentials.accessKeyId && 
           R2_CONFIG.credentials.secretAccessKey && 
           R2_CONFIG.bucketName)
} 