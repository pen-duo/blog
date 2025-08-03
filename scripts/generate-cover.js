const fs = require('fs')
const path = require('path')

// Unsplash API 配置
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY' // 需要注册获取
const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

// 预设的关键词映射
const KEYWORD_MAP = {
  docker: 'container technology',
  javascript: 'javascript programming',
  react: 'react development',
  vue: 'vue.js framework',
  node: 'nodejs backend',
  python: 'python programming',
  git: 'version control',
  database: 'database technology',
  web: 'web development',
  mobile: 'mobile development',
  ai: 'artificial intelligence',
  blockchain: 'blockchain technology',
  cloud: 'cloud computing',
  security: 'cybersecurity',
  devops: 'devops automation',
}

// 无需API的免费方案 - 使用Unsplash的直接链接
function generateUnsplashUrl(keyword, width = 1200, height = 630) {
  const searchTerm = KEYWORD_MAP[keyword.toLowerCase()] || keyword
  return `https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&h=${height}&q=80`
}

// 根据文章标签生成封面图URL
function generateCoverImage(tags) {
  if (!tags || tags.length === 0) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }

  const primaryTag = tags[0]
  return generateUnsplashUrl(primaryTag)
}

// 处理博客文章的frontmatter
function addCoverToMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) return

  const frontmatter = match[1]
  const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/)

  if (tagsMatch && !frontmatter.includes('image:')) {
    const tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''))
    const coverUrl = generateCoverImage(tags)

    const newFrontmatter = frontmatter + `\nimage: ${coverUrl}`
    const newContent = content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`)

    fs.writeFileSync(filePath, newContent)
    console.log(`✅ Added cover image to ${path.basename(filePath)}`)
  }
}

// 批量处理blog目录下的所有markdown文件
function processBlogFiles() {
  const blogDir = path.join(__dirname, '..', 'blog')

  function processDirectory(dir) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        processDirectory(filePath)
      }
      else if (file.endsWith('.md')) {
        addCoverToMarkdown(filePath)
      }
    })
  }

  processDirectory(blogDir)
}

// 执行脚本
if (require.main === module) {
  console.log('🎨 开始为博客文章添加封面图...')
  processBlogFiles()
  console.log('✨ 完成！')
}

module.exports = { generateCoverImage, addCoverToMarkdown }
