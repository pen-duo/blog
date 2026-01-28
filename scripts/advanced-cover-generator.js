const fs = require('fs')
const path = require('path')

// 多个图片源配置
const IMAGE_SOURCES = {
  // Unsplash - 高质量摄影图片
  unsplash: {
    baseUrl: 'https://images.unsplash.com',
    collections: {
      docker: 'photo-1605745341112-85968b19335a', // 容器/科技
      javascript: 'photo-1627398242454-45a1465c2479', // JS代码
      react: 'photo-1633356122544-f134324a6cee', // React
      vue: 'photo-1621839673705-6617adf9e890', // Vue绿色主题
      node: 'photo-1627398242454-45a1465c2479', // Node.js
      python: 'photo-1526379879527-8559ecfcaec0', // Python
      git: 'photo-1556075798-4825dfaaf498', // 版本控制
      database: 'photo-1544383835-bda2bc66a55d', // 数据库
      web: 'photo-1547658719-da2b51169166', // Web开发
      mobile: 'photo-1512941937669-90a1b58e7e9c', // 移动开发
      ai: 'photo-1677442136019-21780ecad995', // AI/机器学习
      blockchain: 'photo-1639762681485-074b7f938ba0', // 区块链
      cloud: 'photo-1544197150-b99a580bb7a8', // 云计算
      security: 'photo-1550751827-4bd374c3f58b', // 网络安全
      devops: 'photo-1605745341112-85968b19335a', // DevOps
      design: 'photo-1561070791-2526d30994b5', // 设计
      tutorial: 'photo-1516321318423-f06f85e504b3', // 教程
      tips: 'photo-1434494878577-86c23bcb06b9', // 技巧
      news: 'photo-1504711434969-e33886168f5c', // 新闻
      review: 'photo-1507003211169-0a1dd7228f2d', // 评测
      lifestyle: 'photo-1506905925346-21bda4d32df4', // 生活方式
      travel: 'photo-1488646953014-85cb44e25828', // 旅行
      book: 'photo-1481627834876-b7833e8f5570', // 书籍/学习
      default: 'photo-1516321318423-f06f85e504b3', // 默认
    },
  },

  // Pexels - 免费高质量图片
  pexels: {
    baseUrl: 'https://images.pexels.com/photos',
    collections: {
      docker: '2004161/pexels-photo-2004161.jpeg',
      javascript: '11035380/pexels-photo-11035380.jpeg',
      react: '11035471/pexels-photo-11035471.jpeg',
      default: '574071/pexels-photo-574071.jpeg',
    },
  },
}

// 根据标签和分类智能选择图片
function selectImageByTags(tags, category = 'tech') {
  const source = IMAGE_SOURCES.unsplash

  // 优先匹配第一个标签
  if (tags && tags.length > 0) {
    const primaryTag = tags[0].toLowerCase()
    const imageId = source.collections[primaryTag] || source.collections.default

    return `${source.baseUrl}/${imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80`
  }

  // 根据分类选择默认图片
  const categoryImages = {
    develop: source.collections.javascript,
    program: source.collections.web,
    project: source.collections.design,
    lifestyle: source.collections.lifestyle,
    reference: source.collections.book,
    finance: source.collections.default,
  }

  const imageId = categoryImages[category] || source.collections.default
  return `${source.baseUrl}/${imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80`
}

// 生成动态封面图（使用OG Image生成服务）
function generateDynamicCover(title, tags) {
  const encodedTitle = encodeURIComponent(title)
  const primaryTag = tags && tags.length > 0 ? tags[0] : 'Tech'

  // 使用 Vercel OG Image 生成服务
  return `https://og-image-generator.vercel.app/${encodedTitle}.png?theme=light&md=1&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&widths=250&heights=250`
}

// 美化文章格式的函数
function beautifyMarkdown(content, filePath) {
  const fileName = path.basename(filePath, '.md')
  const category = path.basename(path.dirname(filePath))

  // 解析现有的 frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) {
    // 如果没有 frontmatter，创建一个
    const newFrontmatter = generateFrontmatter(fileName, category)
    return `---\n${newFrontmatter}\n---\n\n${content}`
  }

  const frontmatter = match[1]
  const bodyContent = content.replace(frontmatterRegex, '').trim()

  // 解析标签
  const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/)
  const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, '')) : []

  // 解析标题
  const titleMatch = frontmatter.match(/title:\s*(.+)/)
  const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : fileName

  // 添加封面图（如果没有的话）
  let updatedFrontmatter = frontmatter
  if (!frontmatter.includes('image:')) {
    const coverImage = selectImageByTags(tags, category)
    updatedFrontmatter += `\nimage: ${coverImage}`
  }

  // 添加描述（如果没有的话）
  if (!frontmatter.includes('description:')) {
    const description = generateDescription(title, tags)
    updatedFrontmatter += `\nDescription: ${description}`
  }

  // 美化正文内容
  const beautifiedBody = beautifyContent(bodyContent)

  return `---\n${updatedFrontmatter}\n---\n\n${beautifiedBody}`
}

// 生成frontmatter
function generateFrontmatter(fileName, category) {
  const title = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const slug = fileName.toLowerCase().replace(/\s+/g, '-')
  const date = new Date().toISOString().split('T')[0]
  const tags = getCategoryTags(category)
  const description = `关于${title}的详细介绍和实践经验分享。`
  const coverImage = selectImageByTags(tags, category)

  return `slug: ${slug}
title: ${title}
date: ${date}
authors: default
tags: [${tags.join(', ')}]
keywords: [${tags.join(', ')}]
description: ${description}
image: ${coverImage}`
}

// 根据分类获取默认标签
function getCategoryTags(category) {
  const categoryTags = {
    develop: ['开发', '技术', '编程'],
    program: ['项目', '实战', '开发'],
    project: ['项目', '作品', '展示'],
    lifestyle: ['生活', '感悟', '分享'],
    reference: ['总结', '回顾', '思考'],
    finance: ['金融', '理财', '投资'],
  }

  return categoryTags[category] || ['技术', '分享']
}

// 生成描述
function generateDescription(title, tags) {
  const tagStr = tags.length > 0 ? tags.join('、') : '技术'
  return `深入探讨${title}相关的${tagStr}知识，分享实践经验和最佳实践。`
}

// 美化正文内容
function beautifyContent(content) {
  // 添加截断标记（如果没有的话）
  if (!content.includes('<!-- truncate -->')) {
    const lines = content.split('\n')
    const firstParagraph = lines.findIndex(line => line.trim() && !line.startsWith('#'))
    if (firstParagraph !== -1 && firstParagraph < lines.length - 1) {
      lines.splice(firstParagraph + 1, 0, '', '<!-- truncate -->', '')
      content = lines.join('\n')
    }
  }

  // 美化代码块
  content = content.replace(/```(\w+)?\n/g, (match, lang) => {
    return lang ? `\`\`\`${lang}\n` : '```bash\n'
  })

  // 添加emoji到标题
  content = content.replace(/^## (.+)$/gm, (match, title) => {
    const emoji = getEmojiForTitle(title)
    return emoji ? `## ${emoji} ${title}` : match
  })

  return content
}

// 为标题添加合适的emoji
function getEmojiForTitle(title) {
  const emojiMap = {
    安装: '🚀',
    配置: '⚙️',
    使用: '📖',
    命令: '💻',
    实例: '📝',
    技巧: '💡',
    总结: '🎯',
    问题: '❓',
    解决: '✅',
    注意: '⚠️',
    优化: '⚡',
    部署: '🚀',
    开发: '👨‍💻',
    测试: '🧪',
    调试: '🐛',
  }

  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (title.includes(keyword)) {
      return emoji
    }
  }

  return ''
}

// 批量处理所有文章
function processAllArticles() {
  const blogDir = path.join(__dirname, '..', 'blog')
  let processedCount = 0

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
          const beautifiedContent = beautifyMarkdown(content, filePath)

          if (content !== beautifiedContent) {
            fs.writeFileSync(filePath, beautifiedContent)
            console.log(`✅ 美化完成: ${path.relative(blogDir, filePath)}`)
            processedCount++
          }
        }
        catch (error) {
          console.error(`❌ 处理失败: ${file}`, error.message)
        }
      }
    })
  }

  processDirectory(blogDir)
  return processedCount
}

// 执行脚本
if (require.main === module) {
  console.log('🎨 开始美化博客文章...')
  const count = processAllArticles()
  console.log(`✨ 完成！共处理了 ${count} 篇文章`)
}

module.exports = {
  selectImageByTags,
  generateDynamicCover,
  beautifyMarkdown,
  processAllArticles,
}
