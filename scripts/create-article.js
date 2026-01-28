const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 配置信息
const CATEGORIES = {
  develop: '开发技术',
  program: '编程实践',
  project: '项目分享',
  lifestyle: '生活感悟',
  reference: '年度总结',
  finance: '金融知识',
}

const TAGS_SUGGESTIONS = {
  develop: ['javascript', 'typescript', 'react', 'vue', 'node.js', 'docker', '前端', '后端', '全栈'],
  program: ['next.js', 'nest.js', 'graphql', 'api', '数据库', 'mongodb', 'mysql', '架构'],
  project: ['开源项目', '个人项目', '团队协作', 'github', '产品设计', 'ui设计'],
  lifestyle: ['思考', '成长', '学习', '工作', '生活', '感悟', '经验分享'],
  reference: ['年终总结', '回顾', '规划', '目标', '成长轨迹'],
  finance: ['web3', 'defi', 'nft', 'crypto', '区块链', '金融知识'],
}

const COVER_IMAGES = {
  javascript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  react: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  vue: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  docker: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  node: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  database: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  web: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  lifestyle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
}

// 创建交互式界面
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

// 询问用户输入
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

// 生成slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

// 生成当前日期
function getCurrentDate() {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// 智能选择封面图
function selectCoverImage(tags, category) {
  // 优先根据标签匹配
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const normalizedTag = tag.toLowerCase().trim()
      if (COVER_IMAGES[normalizedTag]) {
        return COVER_IMAGES[normalizedTag]
      }
    }
  }

  // 根据分类匹配
  const categoryMapping = {
    develop: 'javascript',
    program: 'web',
    project: 'react',
    lifestyle: 'lifestyle',
    reference: 'default',
    finance: 'default',
  }

  const mappedCategory = categoryMapping[category] || 'default'
  return COVER_IMAGES[mappedCategory]
}

// 生成文章模板
function generateArticleTemplate(data) {
  const { title, slug, category, tags, description, coverImage } = data

  return `---
slug: ${slug}
title: ${title}
date: ${getCurrentDate()}
authors: default
tags: [${tags.join(', ')}]
keywords: [${tags.join(', ')}]
description: ${description}
image: ${coverImage}
---

${description}

<!-- truncate -->

## 📝 概述

在这里写文章的概述...

## 🚀 开始

### 步骤1：准备工作

描述第一步...

### 步骤2：具体实现

描述第二步...

\`\`\`javascript
// 示例代码
console.log('Hello, World!');
\`\`\`

## 💡 核心要点

- 要点1
- 要点2
- 要点3

## 🎯 总结

总结文章的主要内容...

## 📚 参考资料

- [参考链接1](https://example.com)
- [参考链接2](https://example.com)

---

> 💡 **提示**：记得在文章完成后运行 \`pnpm beautify\` 来优化格式和封面图！
`
}

// 交互式创建文章
async function createArticleInteractive() {
  const rl = createInterface()

  console.log('🎉 欢迎使用智能文章创建工具！\n')

  try {
    // 1. 选择分类
    console.log('📂 可选分类：')
    Object.entries(CATEGORIES).forEach(([key, value]) => {
      console.log(`  ${key} - ${value}`)
    })

    const category = await askQuestion(rl, '\n请选择文章分类 (develop/program/project/lifestyle/reference/finance): ')

    if (!CATEGORIES[category]) {
      console.log('❌ 无效的分类，请重新运行脚本')
      return
    }

    // 2. 输入标题
    const title = await askQuestion(rl, '📝 请输入文章标题: ')

    if (!title) {
      console.log('❌ 标题不能为空')
      return
    }

    // 3. 生成或自定义slug
    const defaultSlug = generateSlug(title)
    const customSlug = await askQuestion(rl, `🔗 文章URL slug (默认: ${defaultSlug}): `)
    const slug = customSlug || defaultSlug

    // 4. 输入描述
    const description = await askQuestion(rl, '📄 请输入文章描述: ')

    // 5. 选择标签
    console.log(`\n🏷️  推荐标签 (${CATEGORIES[category]}):`)
    console.log(`  ${TAGS_SUGGESTIONS[category].join(', ')}`)

    const tagsInput = await askQuestion(rl, '\n请输入标签 (用逗号分隔): ')
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)

    // 6. 选择封面图
    const coverImage = selectCoverImage(tags, category)

    // 7. 生成文章
    const articleData = {
      title,
      slug,
      category,
      tags,
      description: description || `关于${title}的详细介绍和实践经验分享。`,
      coverImage,
    }

    const articleContent = generateArticleTemplate(articleData)

    // 8. 创建文件
    const blogDir = path.join(__dirname, '..', 'blog', category)
    const fileName = `${title.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ')}.md`
    const filePath = path.join(blogDir, fileName)

    // 确保目录存在
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true })
    }

    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      const overwrite = await askQuestion(rl, '⚠️  文件已存在，是否覆盖？ (y/N): ')
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ 取消创建')
        return
      }
    }

    // 写入文件
    fs.writeFileSync(filePath, articleContent)

    console.log('\n✅ 文章创建成功！')
    console.log(`📁 文件路径: ${path.relative(process.cwd(), filePath)}`)
    console.log(`🔗 URL slug: ${slug}`)
    console.log(`🏷️  标签: ${tags.join(', ')}`)
    console.log(`🖼️  封面图: ${coverImage}`)

    console.log('\n🚀 接下来你可以：')
    console.log('  1. 编辑文章内容')
    console.log('  2. 运行 `pnpm start` 预览效果')
    console.log('  3. 运行 `pnpm beautify` 优化格式')
  }
  catch (error) {
    console.error('❌ 创建失败:', error.message)
  }
  finally {
    rl.close()
  }
}

// 快速创建文章（命令行参数）
function createArticleQuick(title, category = 'develop') {
  if (!title) {
    console.log('❌ 请提供文章标题')
    console.log('用法: node scripts/create-article.js "文章标题" [分类]')
    return
  }

  if (!CATEGORIES[category]) {
    console.log(`❌ 无效的分类: ${category}`)
    console.log(`可选分类: ${Object.keys(CATEGORIES).join(', ')}`)
    return
  }

  const slug = generateSlug(title)
  const tags = TAGS_SUGGESTIONS[category].slice(0, 3) // 取前3个推荐标签
  const coverImage = selectCoverImage(tags, category)

  const articleData = {
    title,
    slug,
    category,
    tags,
    description: `关于${title}的详细介绍和实践经验分享。`,
    coverImage,
  }

  const articleContent = generateArticleTemplate(articleData)

  // 创建文件
  const blogDir = path.join(__dirname, '..', 'blog', category)
  const fileName = `${title.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ')}.md`
  const filePath = path.join(blogDir, fileName)

  // 确保目录存在
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true })
  }

  // 写入文件
  fs.writeFileSync(filePath, articleContent)

  console.log('✅ 文章创建成功！')
  console.log(`📁 ${path.relative(process.cwd(), filePath)}`)
  console.log(`🔗 ${slug}`)
}

// 主函数
function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // 交互式模式
    createArticleInteractive()
  }
  else {
    // 快速模式
    const [title, category] = args
    createArticleQuick(title, category)
  }
}

// 导出函数供其他脚本使用
module.exports = {
  generateSlug,
  selectCoverImage,
  generateArticleTemplate,
  createArticleQuick,
  CATEGORIES,
  TAGS_SUGGESTIONS,
  COVER_IMAGES,
}

// 执行脚本
if (require.main === module) {
  main()
}
