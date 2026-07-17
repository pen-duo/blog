const fs = require('fs')
const path = require('path')

// 修复后的图片源配置 - 使用可靠的图片链接
const RELIABLE_IMAGES = {
  // 技术类图片 - 使用稳定的Unsplash图片ID
  docker: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  javascript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  react: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  vue: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  node: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  python: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  git: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  database: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  web: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  cloud: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  security: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',

  // 生活类图片
  lifestyle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  book: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',

  // 默认图片
  default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
}

// 备用图片源 - 如果Unsplash不可用
const FALLBACK_IMAGES = {
  // 使用本地图片或其他CDN
  docker: '/img/covers/docker-cover.jpg',
  javascript: '/img/covers/js-cover.jpg',
  react: '/img/covers/react-cover.jpg',
  vue: '/img/covers/vue-cover.jpg',
  default: '/img/covers/default-cover.jpg',
}

// 纯色渐变背景作为最后备选
const GRADIENT_BACKGROUNDS = {
  docker: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  javascript: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  react: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  vue: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  python: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

// 智能选择封面图
function selectCoverImage(tags, category, useLocal = false) {
  const imageSource = useLocal ? FALLBACK_IMAGES : RELIABLE_IMAGES

  // 优先根据标签匹配
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const normalizedTag = tag.toLowerCase().trim()
      if (imageSource[normalizedTag]) {
        return imageSource[normalizedTag]
      }
    }
  }

  // 根据分类匹配
  const categoryMapping = {
    develop: 'javascript',
    program: 'web',
    project: 'react',
    lifestyle: 'lifestyle',
    reference: 'book',
  }

  const mappedCategory = categoryMapping[category]
  if (mappedCategory && imageSource[mappedCategory]) {
    return imageSource[mappedCategory]
  }

  return imageSource.default
}

// 测试图片链接是否可用
async function testImageUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  }
  catch (error) {
    return false
  }
}

// 修复现有文章的封面图
function fixCoverImages() {
  const blogDir = path.join(__dirname, '..', 'blog')
  let fixedCount = 0

  function processDirectory(dir) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        processDirectory(filePath)
      }
      else if (file.endsWith('.md')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8')
          const frontmatterRegex = /^---\n([\s\S]*?)\n---/
          const match = content.match(frontmatterRegex)

          if (match) {
            const frontmatter = match[1]
            const category = path.basename(path.dirname(filePath))

            // 解析标签
            const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/)
            const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, '')) : []

            // 获取新的封面图
            const newCoverImage = selectCoverImage(tags, category)

            // 替换封面图链接
            const imageRegex = /image:\s*https?:\/\/[^\s\n]+/
            let newFrontmatter = frontmatter

            if (imageRegex.test(frontmatter)) {
              newFrontmatter = frontmatter.replace(imageRegex, `image: ${newCoverImage}`)
            }
            else {
              newFrontmatter = frontmatter + `\nimage: ${newCoverImage}`
            }

            if (newFrontmatter !== frontmatter) {
              const newContent = content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`)
              fs.writeFileSync(filePath, newContent)
              console.log(`✅ 修复封面图: ${path.relative(blogDir, filePath)}`)
              fixedCount++
            }
          }
        }
        catch (error) {
          console.error(`❌ 处理失败: ${file}`, error.message)
        }
      }
    })
  }

  processDirectory(blogDir)
  return fixedCount
}

// 生成CSS样式用于渐变背景
function generateGradientCSS() {
  const cssContent = `
/* 博客文章封面渐变背景 */
.blog-post-cover-gradient {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
}

${Object.entries(GRADIENT_BACKGROUNDS).map(([key, gradient]) => `
.cover-${key} {
  background: ${gradient};
}
`).join('')}
`

  const cssPath = path.join(__dirname, '..', 'src', 'css', 'cover-gradients.css')
  fs.writeFileSync(cssPath, cssContent)
  console.log('✅ 生成渐变背景CSS文件')
}

// 创建本地封面图目录和示例图片
function createLocalCoverDirectory() {
  const coverDir = path.join(__dirname, '..', 'static', 'img', 'covers')

  if (!fs.existsSync(coverDir)) {
    fs.mkdirSync(coverDir, { recursive: true })
    console.log('✅ 创建本地封面图目录')

    // 创建一个简单的SVG作为默认封面
    const defaultSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad1)" />
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
    agentbangbang's Blog
  </text>
</svg>
`

    fs.writeFileSync(path.join(coverDir, 'default-cover.svg'), defaultSvg)
    console.log('✅ 创建默认SVG封面')
  }
}

// 主函数
function main() {
  console.log('🔧 开始修复封面图...')

  // 1. 修复现有文章的封面图链接
  const fixedCount = fixCoverImages()

  // 2. 生成渐变背景CSS
  generateGradientCSS()

  // 3. 创建本地封面图目录
  createLocalCoverDirectory()

  console.log(`✨ 完成！共修复了 ${fixedCount} 篇文章的封面图`)
  console.log('💡 建议：')
  console.log('   1. 检查修复后的封面图是否正常显示')
  console.log('   2. 如需使用本地图片，请将图片放到 static/img/covers/ 目录')
  console.log('   3. 可以使用渐变背景作为备选方案')
}

// 执行脚本
if (require.main === module) {
  main()
}

module.exports = {
  selectCoverImage,
  fixCoverImages,
  testImageUrl,
  RELIABLE_IMAGES,
  FALLBACK_IMAGES,
  GRADIENT_BACKGROUNDS,
}
