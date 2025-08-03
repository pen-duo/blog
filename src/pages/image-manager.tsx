import React, { useState, useEffect } from 'react'
import Layout from '@theme/Layout'
import ImageUpload from '@site/src/components/ImageUpload'
import ImageManagerAuth from '@site/src/components/ImageManagerAuth'
import { ENV_INFO } from '@site/src/lib/r2-config'
import { Icon } from '@iconify/react'

interface ImageItem {
  key: string
  url: string
  size: number
  lastModified: Date
}

export default function ImageManager() {
  // 只在开发环境下允许访问
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return (
      <Layout title="访问受限" description="此页面仅限开发环境访问">
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8">
              <Icon icon="ri:lock-line" className="mx-auto mb-4 size-16 text-neutral-400" />
              <h1 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                访问受限
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                图片管理页面仅限开发环境访问，生产环境已禁用。
              </p>
            </div>
          </div>
        </main>
      </Layout>
    )
  }

  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  // 模拟加载图片列表
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      // 这里应该调用实际的API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟数据
      const mockImages: ImageItem[] = [
        {
          key: 'uploads/1703123456789_abc123_example.jpg',
          url: 'https://images.yourdomain.com/uploads/1703123456789_abc123_example.jpg',
          size: 1024 * 1024, // 1MB
          lastModified: new Date(),
        },
        {
          key: 'uploads/1703123456790_def456_sample.png',
          url: 'https://images.yourdomain.com/uploads/1703123456790_def456_sample.png',
          size: 2 * 1024 * 1024, // 2MB
          lastModified: new Date(Date.now() - 86400000), // 1天前
        },
      ]

      setImages(mockImages)
      setLoading(false)
    }

    loadImages()
  }, [])

  const handleUpload = (url: string) => {
    setUploadedUrl(url)
    // 添加到图片列表
    const newImage: ImageItem = {
      key: `uploads/${Date.now()}_new_image.jpg`,
      url,
      size: 1024 * 1024,
      lastModified: new Date(),
    }
    setImages(prev => [newImage, ...prev])
  }

  const handleError = (error: string) => {
    alert(`上传失败: ${error}`)
  }

  const handleDelete = async (key: string) => {
    if (confirm('确定要删除这张图片吗？')) {
      try {
        // 这里应该调用删除API
        await new Promise(resolve => setTimeout(resolve, 500))
        setImages(prev => prev.filter(img => img.key !== key))
      }
      catch (error) {
        alert('删除失败')
      }
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL已复制到剪贴板')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Layout title="图片管理" description="管理博客图片资源">
      <ImageManagerAuth>
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                图片管理
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                管理你的博客图片资源，支持拖拽上传和批量管理
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  ENV_INFO.isDevelopment
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}
                >
                  {ENV_INFO.isDevelopment ? '开发环境' : '生产环境'}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  存储桶:
                  {' '}
                  {process.env.R2_BUCKET_NAME || '未配置'}
                </span>
              </div>
            </div>

            {/* 上传区域 */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                上传新图片
              </h2>
              <ImageUpload
                onUpload={handleUpload}
                onError={handleError}
                maxSize={5 * 1024 * 1024} // 5MB
                className="max-w-2xl"
              />
              {uploadedUrl && (
                <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <p className="text-green-800 dark:text-green-200">
                    上传成功！图片URL:
                    {' '}
                    {uploadedUrl}
                  </p>
                </div>
              )}
            </div>

            {/* 图片列表 */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                图片列表 (
                {images.length}
                )
              </h2>

              {loading
                ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-neutral-600">加载中...</span>
                    </div>
                  )
                : images.length === 0
                  ? (
                      <div className="py-12 text-center">
                        <Icon icon="ri:image-line" className="mx-auto mb-4 size-12 text-neutral-400" />
                        <p className="text-neutral-600 dark:text-neutral-400">暂无图片</p>
                      </div>
                    )
                  : (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {images.map(image => (
                          <div key={image.key} className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="group relative aspect-video bg-neutral-100 dark:bg-neutral-800">
                              <img
                                src={image.url}
                                alt={image.key}
                                className="size-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA5MEgxMjVWMTEwSDc1VjkweiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-50">
                                <div className="flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <button
                                    onClick={() => copyUrl(image.url)}
                                    className="rounded-lg bg-white p-2 shadow-sm transition-colors hover:bg-neutral-100"
                                    title="复制URL"
                                  >
                                    <Icon icon="ri:file-copy-line" className="size-4 text-neutral-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(image.key)}
                                    className="rounded-lg bg-red-500 p-2 shadow-sm transition-colors hover:bg-red-600"
                                    title="删除"
                                  >
                                    <Icon icon="ri:delete-bin-line" className="size-4 text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="mb-2 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {image.key.split('/').pop()}
                              </p>
                              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                                <span>{formatFileSize(image.size)}</span>
                                <span>{image.lastModified.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
            </div>
          </div>
        </main>
      </ImageManagerAuth>
    </Layout>
  )
}
