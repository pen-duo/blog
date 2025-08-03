const fs = require('fs');
const path = require('path');

// 为所有文章添加完整frontmatter的脚本
class FrontmatterEnhancer {
  constructor() {
    this.processedCount = 0;
    this.errorCount = 0;
    this.blogDir = path.join(__dirname, '..', 'blog');
  }

  // 生成有效的slug
  generateValidSlug(fileName) {
    return fileName
      .toLowerCase()
      .replace(/[【】—·]/g, '') // 移除中文标点
      .replace(/[^\w\s-]/g, '') // 移除其他特殊字符
      .replace(/\s+/g, '-') // 空格转连字符
      .replace(/-+/g, '-') // 多个连字符合并
      .replace(/^-|-$/g, '') // 移除开头结尾的连字符
      || 'article'; // 如果为空则使用默认值
  }

  // 根据分类获取推荐标签
  getCategoryTags(category) {
    const tagMap = {
      'develop': ['开发技术', '编程', '前端', '后端', '全栈'],
      'program': ['编程实践', '架构', 'API', '数据库', '框架'],
      'project': ['项目分享', '开源项目', 'github', '产品设计'],
      'lifestyle': ['生活感悟', '思考', '成长', '经验分享', '职场'],
      'reference': ['年度总结', '回顾', '规划', '目标', '成长轨迹']
    };
    return tagMap[category] || ['技术分享', '学习', '经验'];
  }

  // 获取封面图
  getCoverImage(tags, category, title) {
    const imageMap = {
      // 技术相关
      javascript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      react: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      vue: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      docker: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      
      // 分类默认图
      develop: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      program: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      project: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      lifestyle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      reference: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      
      // 特殊主题
      bytedance: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      interview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      internship: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      
      // 默认
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    };

    // 优先根据标题内容匹配
    const titleLower = title.toLowerCase();
    if (titleLower.includes('字节') || titleLower.includes('bytedance')) {
      return imageMap.bytedance;
    }
    if (titleLower.includes('面试') || titleLower.includes('interview')) {
      return imageMap.interview;
    }
    if (titleLower.includes('实习') || titleLower.includes('intern')) {
      return imageMap.internship;
    }

    // 根据标签匹配
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        const normalizedTag = tag.toLowerCase().trim();
        if (imageMap[normalizedTag]) {
          return imageMap[normalizedTag];
        }
      }
    }

    // 根据分类匹配
    return imageMap[category] || imageMap.default;
  }

  // 智能生成描述
  generateDescription(title, content, category) {
    // 提取文章开头的内容作为描述
    const lines = content.split('\n');
    let description = '';
    
    // 跳过frontmatter和空行
    let startIndex = 0;
    let inFrontmatter = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        if (!inFrontmatter) {
          inFrontmatter = true;
        } else {
          startIndex = i + 1;
          break;
        }
      }
    }

    // 查找第一个有内容的段落
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#') && !line.startsWith('<!--') && !line.startsWith('>')) {
        description = line;
        break;
      }
    }

    // 如果没找到合适的描述，使用标题生成
    if (!description) {
      const categoryNames = {
        'develop': '开发技术',
        'program': '编程实践',
        'project': '项目分享',
        'lifestyle': '生活感悟',
        'reference': '年度总结'
      };
      description = `${title} - ${categoryNames[category] || '技术'}相关的经验分享和深度思考。`;
    }

    // 限制长度
    if (description.length > 150) {
      description = description.substring(0, 147) + '...';
    }

    return description;
  }

  // 智能生成关键词
  generateKeywords(title, content, tags) {
    const keywords = new Set();
    
    // 从标题提取关键词
    const titleWords = title.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];
    titleWords.forEach(word => {
      if (word.length > 1) {
        keywords.add(word);
      }
    });

    // 添加标签作为关键词
    if (tags && tags.length > 0) {
      tags.forEach(tag => keywords.add(tag));
    }

    // 从内容中提取一些关键技术词汇
    const techKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Docker',
      '前端', '后端', '全栈', '面试', '实习', '字节跳动', '架构', 'API',
      '数据库', '算法', '性能优化', '工程化', '微前端', '组件库'
    ];
    
    techKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        keywords.add(keyword);
      }
    });

    return Array.from(keywords).slice(0, 8); // 限制关键词数量
  }

  // 生成完整的frontmatter
  generateCompleteFrontmatter(fileName, filePath, content) {
    const category = path.basename(path.dirname(filePath));
    const slug = this.generateValidSlug(fileName);
    const title = fileName;
    
    // 智能推荐标签
    const recommendedTags = this.getCategoryTags(category);
    let finalTags = [...recommendedTags.slice(0, 3)];
    
    // 根据标题和内容添加特定标签
    if (title.includes('字节') || content.includes('字节跳动')) {
      finalTags.push('字节跳动');
    }
    if (title.includes('面试') || content.includes('面试')) {
      finalTags.push('面试');
    }
    if (title.includes('实习') || content.includes('实习')) {
      finalTags.push('实习');
    }
    if (title.includes('React') || content.includes('React')) {
      finalTags.push('React');
    }
    if (title.includes('Vue') || content.includes('Vue')) {
      finalTags.push('Vue');
    }

    // 去重并限制数量
    finalTags = [...new Set(finalTags)].slice(0, 6);
    
    const description = this.generateDescription(title, content, category);
    const keywords = this.generateKeywords(title, content, finalTags);
    const coverImage = this.getCoverImage(finalTags, category, title);
    
    // 生成日期（优先使用文件修改时间，否则使用当前时间）
    let date;
    try {
      const stats = fs.statSync(filePath);
      date = stats.mtime.toISOString().split('T')[0];
    } catch (error) {
      date = new Date().toISOString().split('T')[0];
    }

    return `---
slug: ${slug}
title: ${title}
date: ${date}
authors: default
tags: [${finalTags.join(', ')}]
keywords: [${keywords.join(', ')}]
description: ${description}
image: ${coverImage}
---`;
  }

  // 处理单个文件
  async processFile(filePath) {
    try {
      const relativePath = path.relative(this.blogDir, filePath);
      const fileName = path.basename(filePath, '.md');
      
      console.log(`🔧 处理文件: ${relativePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;
      
      // 检查是否已有完整的frontmatter
      const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
      const match = content.match(frontmatterRegex);
      
      if (!match) {
        // 没有frontmatter，添加完整的
        const newFrontmatter = this.generateCompleteFrontmatter(fileName, filePath, content);
        content = newFrontmatter + '\n\n' + content;
        hasChanges = true;
        console.log(`  ✅ 添加了完整的frontmatter`);
      } else {
        // 检查现有frontmatter是否完整
        const frontmatter = match[1];
        const requiredFields = ['slug', 'title', 'date', 'authors', 'tags', 'keywords', 'description', 'image'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
          if (!frontmatter.includes(`${field}:`)) {
            missingFields.push(field);
          }
        });
        
        // 检查是否只有简单的theme字段
        const isSimpleFrontmatter = frontmatter.trim().startsWith('theme:') && 
                                   frontmatter.trim().split('\n').length <= 2;
        
        if (missingFields.length > 0 || isSimpleFrontmatter) {
          // 生成新的完整frontmatter
          const newFrontmatter = this.generateCompleteFrontmatter(fileName, filePath, content);
          content = content.replace(frontmatterRegex, newFrontmatter);
          hasChanges = true;
          console.log(`  ✅ 更新了frontmatter (缺少字段: ${missingFields.join(', ') || '不完整'})`);
        }
      }
      
      // 添加truncate标记（如果没有的话）
      if (!content.includes('<!-- truncate -->') && !content.includes('{/* truncate */}')) {
        const lines = content.split('\n');
        let frontmatterEnd = -1;
        let inFrontmatter = false;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] === '---') {
            if (!inFrontmatter) {
              inFrontmatter = true;
            } else {
              frontmatterEnd = i;
              break;
            }
          }
        }

        if (frontmatterEnd > -1) {
          // 找到合适的位置插入truncate
          for (let i = frontmatterEnd + 1; i < lines.length; i++) {
            if (lines[i].trim() !== '') {
              // 找到第一个段落的结束位置
              let insertIndex = i + 1;
              while (insertIndex < lines.length && lines[insertIndex].trim() !== '') {
                insertIndex++;
              }
              lines.splice(insertIndex, 0, '', '<!-- truncate -->', '');
              hasChanges = true;
              console.log(`  ✅ 添加了truncate标记`);
              break;
            }
          }
        }
        
        content = lines.join('\n');
      }
      
      // 写回文件
      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        this.processedCount++;
        console.log(`  💾 文件已更新`);
      } else {
        console.log(`  ✨ 文件已有完整元信息`);
      }
      
    } catch (error) {
      console.error(`  ❌ 处理失败: ${error.message}`);
      this.errorCount++;
    }
  }

  // 递归处理目录
  async processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        await this.processDirectory(filePath);
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        await this.processFile(filePath);
      }
    }
  }

  // 主函数
  async run() {
    console.log('🚀 开始为所有文章添加完整的元信息...\n');
    
    try {
      await this.processDirectory(this.blogDir);
      
      console.log('\n✨ 处理完成！');
      console.log(`📊 统计信息:`);
      console.log(`  - 处理文件数: ${this.processedCount}`);
      console.log(`  - 错误文件数: ${this.errorCount}`);
      
      if (this.errorCount === 0) {
        console.log('\n🎉 所有文章都已添加完整的元信息！');
        console.log('📋 每篇文章现在都包含:');
        console.log('  - slug: URL路径');
        console.log('  - title: 文章标题');
        console.log('  - date: 发布日期');
        console.log('  - authors: 作者信息');
        console.log('  - tags: 文章标签');
        console.log('  - keywords: 关键词');
        console.log('  - description: 文章描述');
        console.log('  - image: 封面图片');
        console.log('\n💡 建议运行 `pnpm build` 测试构建是否正常');
      } else {
        console.log(`\n⚠️  有 ${this.errorCount} 个文件处理失败，请手动检查`);
      }
      
    } catch (error) {
      console.error('❌ 处理过程中发生错误:', error.message);
    }
  }
}

// 执行处理
if (require.main === module) {
  const enhancer = new FrontmatterEnhancer();
  enhancer.run();
}

module.exports = FrontmatterEnhancer; 