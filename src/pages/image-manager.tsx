import React, { useState, useEffect } from 'react'
import Layout from '@theme/Layout'
import ImageUpload from '@site/src/components/ImageUpload'
import ImageManagerAuth from '@site/src/components/ImageManagerAuth'
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
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Icon icon="ri:lock-line" className="mx-auto h-16 w-16 text-neutral-400 mb-4" />
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
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
          lastModified: new Date()
        },
        {
          key: 'uploads/1703123456790_def456_sample.png',
          url: 'https://images.yourdomain.com/uploads/1703123456790_def456_sample.png',
          size: 2 * 1024 * 1024, // 2MB
          lastModified: new Date(Date.now() - 86400000) // 1天前
        }
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
      lastModified: new Date()
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
      } catch (error) {
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                图片管理
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                管理你的博客图片资源，支持拖拽上传和批量管理
              </p>
            </div>

            {/* 上传区域 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                上传新图片
              </h2>
              <ImageUpload 
                onUpload={handleUpload}
                onError={handleError}
                maxSize={5 * 1024 * 1024} // 5MB
                className="max-w-2xl"
              />
              {uploadedUrl && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    上传成功！图片URL: {uploadedUrl}
                  </p>
                </div>
              )}
            </div>

            {/* 图片列表 */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                图片列表 ({images.length})
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-neutral-600">加载中...</span>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="ri:image-line" className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">暂无图片</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <div key={image.key} className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                      <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 relative group">
                        <img 
                          src={image.url} 
                          alt={image.key}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA5MEgxMjVWMTEwSDc1VjkweiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            <button
                              onClick={() => copyUrl(image.url)}
                              className="p-2 bg-white rounded-lg shadow-sm hover:bg-neutral-100 transition-colors"
                              title="复制URL"
                            >
                              <Icon icon="ri:file-copy-line" className="h-4 w-4 text-neutral-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(image.key)}
                              className="p-2 bg-red-500 rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                              title="删除"
                            >
                              <Icon icon="ri:delete-bin-line" className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate mb-2">
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