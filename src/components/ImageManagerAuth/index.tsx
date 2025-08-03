import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

interface ImageManagerAuthProps {
  children: React.ReactNode
}

export default function ImageManagerAuth({ children }: ImageManagerAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  // 检查是否已经认证过
  useEffect(() => {
    const authStatus = localStorage.getItem('image-manager-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 简单的密码验证（你可以修改这个密码）
    const correctPassword = process.env.REACT_APP_IMAGE_MANAGER_PASSWORD || 'admin123'
    
    if (password === correctPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('image-manager-auth', 'true')
      setError('')
    } else {
      setAttempts(prev => prev + 1)
      setError('密码错误')
      
      // 超过5次尝试后锁定
      if (attempts >= 4) {
        setError('尝试次数过多，请稍后再试')
        setTimeout(() => {
          setAttempts(0)
          setError('')
        }, 30000) // 30秒后重置
      }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('image-manager-auth')
    setPassword('')
  }

  if (isAuthenticated) {
    return (
      <div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Icon icon="ri:shield-check-line" className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-800 dark:text-blue-200">
                图片管理 - 已认证
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              退出登录
            </button>
          </div>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Icon icon="ri:lock-line" className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              图片管理
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              请输入访问密码
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                访问密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-100"
                placeholder="请输入密码"
                disabled={attempts >= 5}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={attempts >= 5}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {attempts >= 5 ? '已锁定' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              此页面仅限管理员访问
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 