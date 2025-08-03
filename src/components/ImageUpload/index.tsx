import React, { useState, useCallback } from 'react'
import { Icon } from '@iconify/react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  maxSize?: number
  accept?: string[]
  className?: string
}

export default function ImageUpload({ 
  onUpload, 
  onError, 
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = ['image/*'],
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    // 验证文件大小
    if (file.size > maxSize) {
      onError?.(`文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      onError?.('只能上传图片文件')
      return
    }

    setUploading(true)
    setPreview(URL.createObjectURL(file))

    try {
      // 这里应该调用你的上传API
      // 暂时模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 模拟上传成功，返回一个示例URL
      const mockUrl = `https://images.yourdomain.com/${Date.now()}_${file.name}`
      onUpload(mockUrl)
      
    } catch (error) {
      onError?.(error instanceof Error ? error.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }, [maxSize, onUpload, onError])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  return (
    <div className={`image-upload ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 hover:border-neutral-400
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input 
          type="file" 
          accept={accept.join(',')}
          onChange={handleFileInput}
          className="hidden"
          id="image-upload-input"
          disabled={uploading}
        />
        <label htmlFor="image-upload-input" className="cursor-pointer">
          {preview ? (
            <div className="space-y-4">
              <img 
                src={preview} 
                alt="预览" 
                className="max-w-full max-h-48 mx-auto rounded-lg shadow-sm"
              />
              {uploading && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-neutral-600">上传中...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Icon 
                icon="ri:image-add-line" 
                className="mx-auto h-12 w-12 text-neutral-400"
              />
              <div>
                <p className="text-lg font-medium text-neutral-900">
                  点击或拖拽图片到此处
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  支持 JPG、PNG、GIF、WebP 格式，最大 {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  )
} 