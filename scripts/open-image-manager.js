#!/usr/bin/env node

const { exec } = require('child_process')
const os = require('os')

const platform = os.platform()
const url = 'http://localhost:3000/image-manager'

console.log('🚀 正在打开图片管理页面...')
console.log(`📍 页面地址: ${url}`)
console.log('🔑 默认密码: admin123')
console.log('')

let command

switch (platform) {
  case 'darwin': // macOS
    command = `open "${url}"`
    break
  case 'win32': // Windows
    command = `start "${url}"`
    break
  default: // Linux
    command = `xdg-open "${url}"`
    break
}

exec(command, (error) => {
  if (error) {
    console.error('❌ 无法自动打开浏览器，请手动访问：')
    console.error(`   ${url}`)
    console.error('')
    console.error('💡 提示：')
    console.error('   1. 确保开发服务器已启动 (pnpm start)')
    console.error('   2. 手动复制链接到浏览器')
    console.error('   3. 输入密码: admin123')
  } else {
    console.log('✅ 浏览器已打开图片管理页面')
    console.log('')
    console.log('📝 使用说明：')
    console.log('   1. 输入密码: admin123')
    console.log('   2. 点击登录进入管理界面')
    console.log('   3. 上传和管理你的图片')
  }
}) 