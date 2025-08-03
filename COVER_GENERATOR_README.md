# 🎨 博客封面图自动生成器

这个项目提供了多种方式来为你的博客文章自动生成和添加封面图。

## 🚀 快速开始

### 1. 美化所有文章（推荐）

```bash
# 自动为所有文章添加封面图、美化格式、添加emoji等
pnpm beautify
```

### 2. 仅添加封面图

```bash
# 只为缺少封面图的文章添加封面图
pnpm add-covers
```

## 📸 封面图来源

### 1. Unsplash（主要来源）
- **优点**：高质量摄影图片，免费使用
- **特点**：根据文章标签智能匹配相关图片
- **示例**：
  - Docker文章 → 容器/科技主题图片
  - JavaScript文章 → 代码/编程主题图片
  - 生活文章 → 生活方式主题图片

### 2. 动态生成（可选）
- 使用OG Image生成服务
- 根据文章标题动态生成带文字的封面图
- 适合需要统一风格的场景

## 🎯 智能匹配规则

### 标签优先匹配
```javascript
// 根据第一个标签选择对应主题的图片
tags: ['docker', '容器化', '运维'] → Docker主题图片
tags: ['javascript', 'JS', '前端'] → JavaScript主题图片
tags: ['生活', '感悟', '分享'] → 生活方式主题图片
```

### 分类默认匹配
```javascript
// 如果没有标签，根据文章分类选择
blog/develop/ → 开发主题图片
blog/lifestyle/ → 生活主题图片
blog/project/ → 项目/设计主题图片
```

## 🎨 文章美化功能

### 自动添加的内容
1. **完整的frontmatter**
   - slug（URL友好的标识符）
   - title（标题）
   - date（日期）
   - authors（作者）
   - tags（标签）
   - keywords（关键词）
   - description（描述）
   - image（封面图）

2. **正文美化**
   - 添加`<!-- truncate -->`截断标记
   - 为标题添加合适的emoji
   - 统一代码块语言标识

### 示例对比

**处理前：**
```markdown
## 安装 Docker
下载 Docker Desktop...
```

**处理后：**
```markdown
---
slug: docker-common-commands
title: Docker 常用命令大全
date: 2024-01-15
authors: default
tags: [docker, 容器化, 运维]
keywords: [docker, 容器, 镜像, 命令]
description: 详细介绍Docker的安装、配置和常用命令...
image: https://images.unsplash.com/photo-1605745341112-85968b19335a...
---

Docker 是现代软件开发中不可或缺的容器化平台...

<!-- truncate -->

## 🚀 安装 Docker
下载 Docker Desktop...
```

## 🔧 自定义配置

### 添加新的图片映射

编辑 `scripts/advanced-cover-generator.js` 中的 `IMAGE_SOURCES`：

```javascript
const IMAGE_SOURCES = {
  unsplash: {
    collections: {
      'your-tag': 'photo-xxxxxxxxx-xxxxxxxxxxxxxxx', // 添加新标签映射
      // ... 其他映射
    }
  }
};
```

### 修改emoji映射

编辑 `getEmojiForTitle` 函数：

```javascript
const emojiMap = {
  '你的关键词': '🎯', // 添加新的emoji映射
  // ... 其他映射
};
```

## 🌐 其他封面图方案

### 1. Pexels API
```javascript
// 免费，需要API密钥
const PEXELS_API_KEY = 'your-api-key';
```

### 2. 自定义OG图片生成
```javascript
// 使用Vercel OG或其他服务
const ogImageUrl = `https://your-og-service.com/${title}.png`;
```

### 3. 本地图片库
```javascript
// 将图片存储在static/img/covers/目录下
const localImage = `/img/covers/${category}-${index}.jpg`;
```

## 📝 文章格式最佳实践

### 1. 标题层级
```markdown
# 一级标题（文章标题，在frontmatter中定义）
## 二级标题（主要章节）
### 三级标题（子章节）
```

### 2. 标签规范
```yaml
tags: [主要技术, 次要技术, 分类]
# 例如：
tags: [docker, 容器化, 运维, 开发工具]
```

### 3. 描述写法
```yaml
description: 简洁明了地描述文章内容，包含关键词，有助于SEO
```

## 🎯 使用建议

1. **首次使用**：运行 `pnpm beautify` 处理所有现有文章
2. **新文章**：写完文章后运行 `pnpm add-covers` 添加封面图
3. **批量更新**：修改配置后运行 `pnpm beautify` 重新处理
4. **手动调整**：自动生成后可以手动微调frontmatter和封面图

## ⚠️ 注意事项

1. **备份重要文章**：首次运行前建议备份
2. **检查结果**：处理后检查文章格式是否正确
3. **图片版权**：Unsplash图片免费使用，但建议了解使用条款
4. **网络访问**：封面图使用外部链接，需要网络访问

## 🤝 贡献

欢迎提交Issue和PR来改进这个工具：
- 添加新的图片源
- 优化匹配算法
- 增加新的美化功能
- 修复bug

---

*Happy Blogging! 🎉* 