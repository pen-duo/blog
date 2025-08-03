const fs = require('fs')
const path = require('path')

// 修复MDX编译错误的脚本
class MDXErrorFixer {
  constructor() {
    this.fixedCount = 0
    this.errorCount = 0
    this.blogDir = path.join(__dirname, '..', 'blog')
  }

  // 修复代码块问题
  fixCodeBlocks(content) {
    let fixed = content

    // 1. 修复未闭合的代码块（以4个空格开头的代码）
    // 将缩进代码块转换为围栏代码块
    fixed = fixed.replace(/\n    ([^\n]+(?:\n    [^\n]*)*)/g, (match, code) => {
      // 检查是否已经在代码块中
      const beforeMatch = fixed.substring(0, fixed.indexOf(match))
      const codeBlockCount = (beforeMatch.match(/```/g) || []).length

      // 如果代码块数量是偶数，说明我们在代码块外面
      if (codeBlockCount % 2 === 0) {
        const cleanCode = code.replace(/\n    /g, '\n').trim()
        return `\n\`\`\`javascript\n${cleanCode}\n\`\`\``
      }
      return match
    })

    // 2. 修复空的HTML注释
    fixed = fixed.replace(/<!---->[\s\n]*/g, '\n')

    // 3. 修复未闭合的代码块
    const codeBlockMatches = fixed.match(/```/g) || []
    if (codeBlockMatches.length % 2 !== 0) {
      // 代码块数量为奇数，需要添加闭合标签
      fixed += '\n```\n'
    }

    return fixed
  }

  // 生成有效的slug
  generateValidSlug(fileName) {
    return fileName
      .toLowerCase()
      .replace(/[【】—]/g, '') // 移除中文标点
      .replace(/[^\w\s-]/g, '') // 移除其他特殊字符
      .replace(/\s+/g, '-') // 空格转连字符
      .replace(/-+/g, '-') // 多个连字符合并
      .replace(/^-|-$/g, '') // 移除开头结尾的连字符
      || 'article' // 如果为空则使用默认值
  }

  // 修复frontmatter问题
  fixFrontmatter(content, filePath) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/
    const match = content.match(frontmatterRegex)

    if (!match) {
      // 没有frontmatter，添加基本的
      const fileName = path.basename(filePath, '.md')
      const category = path.basename(path.dirname(filePath))
      const slug = this.generateValidSlug(fileName)

      const basicFrontmatter = `---
slug: ${slug}
title: ${fileName}
date: ${new Date().toISOString().split('T')[0]}
authors: default
tags: [${this.getCategoryTags(category).slice(0, 3).join(', ')}]
keywords: [${fileName}]
description: ${fileName}的详细介绍和分享
image: ${this.getDefaultCoverImage(category)}
---

`
      return basicFrontmatter + content
    }
    else {
      // 检查现有frontmatter中的slug是否有效
      const frontmatter = match[1]
      if (frontmatter.includes('slug: -') || frontmatter.includes('slug:\n') || frontmatter.includes('slug: ')) {
        const fileName = path.basename(filePath, '.md')
        const validSlug = this.generateValidSlug(fileName)
        return content.replace(/slug: -?\s*/, `slug: ${validSlug}`)
      }
    }

    return content
  }

  // 根据分类获取推荐标签
  getCategoryTags(category) {
    const tagMap = {
      develop: ['开发技术', '编程', '前端', '后端'],
      program: ['编程实践', '架构', 'API', '数据库'],
      project: ['项目分享', '开源项目', 'github'],
      lifestyle: ['生活感悟', '思考', '成长', '经验分享'],
      reference: ['年度总结', '回顾', '规划'],
    }
    return tagMap[category] || ['技术分享', '学习', '经验']
  }

  // 获取默认封面图
  getDefaultCoverImage(category) {
    const imageMap = {
      develop: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      program: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      project: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      lifestyle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      reference: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    }
    return imageMap[category] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
  }

  // 添加truncate标记
  addTruncateMarker(content) {
    // 如果已经有truncate标记，就不添加
    if (content.includes('<!-- truncate -->') || content.includes('{/* truncate */}')) {
      return content
    }

    // 在frontmatter后的第一个段落后添加truncate
    const lines = content.split('\n')
    let frontmatterEnd = -1
    let inFrontmatter = false

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '---') {
        if (!inFrontmatter) {
          inFrontmatter = true
        }
        else {
          frontmatterEnd = i
          break
        }
      }
    }

    if (frontmatterEnd > -1) {
      // 找到第一个非空行作为插入点
      for (let i = frontmatterEnd + 1; i < lines.length; i++) {
        if (lines[i].trim() !== '') {
          // 在这一行后面插入truncate
          let insertIndex = i + 1
          // 如果下一行也不是空行，找到下一个空行或段落结束
          while (insertIndex < lines.length && lines[insertIndex].trim() !== '') {
            insertIndex++
          }
          lines.splice(insertIndex, 0, '', '<!-- truncate -->', '')
          break
        }
      }
    }

    return lines.join('\n')
  }

  // 修复特殊字符问题
  fixSpecialCharacters(content) {
    let fixed = content

    // 1. 修复可能被误解为JSX的内容
    // 转义单独的大括号
    fixed = fixed.replace(/(?<!`[^`]*)\{(?![^`]*`)/g, '\\{')
    fixed = fixed.replace(/(?<!`[^`]*)\}(?![^`]*`)/g, '\\}')

    // 2. 修复HTML实体
    fixed = fixed.replace(/&(?!amp;|lt;|gt;|quot;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;')

    return fixed
  }

  // 处理单个文件
  async processFile(filePath) {
    try {
      const relativePath = path.relative(this.blogDir, filePath)
      console.log(`🔧 处理文件: ${relativePath}`)

      let content = fs.readFileSync(filePath, 'utf8')
      let hasChanges = false

      // 1. 修复frontmatter
      const originalContent = content
      content = this.fixFrontmatter(content, filePath)
      if (content !== originalContent) {
        hasChanges = true
        console.log(`  ✅ 修复了frontmatter`)
      }

      // 2. 修复代码块
      const beforeCodeFix = content
      content = this.fixCodeBlocks(content)
      if (content !== beforeCodeFix) {
        hasChanges = true
        console.log(`  ✅ 修复了代码块`)
      }

      // 3. 添加truncate标记
      const beforeTruncate = content
      content = this.addTruncateMarker(content)
      if (content !== beforeTruncate) {
        hasChanges = true
        console.log(`  ✅ 添加了truncate标记`)
      }

      // 4. 修复特殊字符（暂时注释掉，因为可能过度修复）
      // const beforeSpecialChars = content;
      // content = this.fixSpecialCharacters(content);
      // if (content !== beforeSpecialChars) {
      //   hasChanges = true;
      //   console.log(`  ✅ 修复了特殊字符`);
      // }

      // 写回文件
      if (hasChanges) {
        fs.writeFileSync(filePath, content)
        this.fixedCount++
        console.log(`  💾 文件已更新`)
      }
      else {
        console.log(`  ✨ 文件无需修改`)
      }
    }
    catch (error) {
      console.error(`  ❌ 处理失败: ${error.message}`)
      this.errorCount++
    }
  }

  // 递归处理目录
  async processDirectory(dir) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        await this.processDirectory(filePath)
      }
      else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        await this.processFile(filePath)
      }
    }
  }

  // 主函数
  async run() {
    console.log('🚀 开始修复MDX编译错误...\n')

    try {
      await this.processDirectory(this.blogDir)

      console.log('\n✨ 修复完成！')
      console.log(`📊 统计信息:`)
      console.log(`  - 修复文件数: ${this.fixedCount}`)
      console.log(`  - 错误文件数: ${this.errorCount}`)

      if (this.errorCount === 0) {
        console.log('\n🎉 所有文件都已成功修复！')
        console.log('💡 建议运行 `pnpm build` 测试构建是否正常')
      }
      else {
        console.log(`\n⚠️  有 ${this.errorCount} 个文件修复失败，请手动检查`)
      }
    }
    catch (error) {
      console.error('❌ 修复过程中发生错误:', error.message)
    }
  }
}

// 执行修复
if (require.main === module) {
  const fixer = new MDXErrorFixer()
  fixer.run()
}

module.exports = MDXErrorFixer
