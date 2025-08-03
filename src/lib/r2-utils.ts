import { 
  PutObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsV2Command,
  GetObjectCommand 
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client, R2_CONFIG, getImageUrl } from './r2-config'

// 上传文件到R2
export async function uploadToR2(
  key: string, 
  file: Buffer, 
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1年缓存
  })

  await s3Client.send(command)
  return getImageUrl(key)
}

// 删除文件
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  })

  await s3Client.send(command)
}

// 列出文件
export async function listFiles(prefix?: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: R2_CONFIG.bucketName,
    Prefix: prefix,
  })

  const response = await s3Client.send(command)
  return response.Contents?.map(obj => obj.Key || '') || []
}

// 生成预签名URL（用于直接上传）
export async function generatePresignedUrl(
  key: string, 
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

// 生成下载URL
export async function generateDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

// 生成唯一文件名
export function generateUniqueKey(originalName: string, prefix?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  const name = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')
  
  const key = `${prefix || 'uploads'}/${timestamp}_${random}_${name}.${extension}`
  return key
}

// 验证文件类型
export function isValidImageType(mimeType: string): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
  return validTypes.includes(mimeType)
}

// 验证文件大小（默认5MB）
export function isValidFileSize(size: number, maxSize: number = 5 * 1024 * 1024): boolean {
  return size <= maxSize
} 