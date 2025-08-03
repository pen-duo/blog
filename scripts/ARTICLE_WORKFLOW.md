# 📝 智能文章创建与管理工作流程

## 🚀 快速开始

### 1. 创建新文章

#### 方式一：交互式创建（推荐）
```bash
pnpm new
```
- 🎯 **适合场景**：首次创建，需要精确配置
- ✨ **特点**：逐步引导，智能推荐标签和封面图

#### 方式二：快速创建
```bash
pnpm new:quick "文章标题" [分类]
```
- 🎯 **适合场景**：快速创建，使用默认配置
- ✨ **特点**：一行命令，自动配置

**示例：**
```bash
# 创建开发技术类文章
pnpm new:quick "Vue3 组合式API实践" develop

# 创建项目分享类文章  
pnpm new:quick "个人博客搭建指南" project

# 创建生活感悟类文章
pnpm new:quick "程序员的时间管理" lifestyle
```

### 2. 文章分类说明

| 分类 | 说明 | 推荐标签 |
|------|------|----------|
| `develop` | 开发技术 | javascript, typescript, react, vue, docker |
| `program` | 编程实践 | next.js, nest.js, api, 数据库, 架构 |
| `project` | 项目分享 | 开源项目, github, 产品设计, ui设计 |
| `lifestyle` | 生活感悟 | 思考, 成长, 学习, 工作, 经验分享 |
| `reference` | 年度总结 | 年终总结, 回顾, 规划, 目标 |

## 📋 完整工作流程

### 第一步：创建文章
```bash
# 交互式创建（推荐新手）
pnpm new

# 或快速创建
pnpm new:quick "我的文章标题" develop
```

### 第二步：编写内容
1. 📝 使用你喜欢的编辑器打开生成的 `.md` 文件
2. 🎨 根据模板结构填写内容
3. 💡 使用提供的 emoji 和格式规范

### 第三步：预览效果
```bash
# 启动开发服务器
pnpm start

# 在浏览器中预览
# http://localhost:3000
```

### 第四步：优化文章
```bash
# 美化格式和封面图
pnpm beautify

# 或仅修复封面图
pnpm fix-covers
```

### 第五步：发布
```bash
# 构建生产版本
pnpm build

# 部署到 Vercel
git add .
git commit -m "新增文章：你的文章标题"
git push
```

## 🎨 文章模板结构

生成的文章包含以下结构：

```markdown
---
slug: article-url-slug
title: 文章标题
date: 2024-01-15
authors: default
tags: [标签1, 标签2, 标签3]
keywords: [关键词1, 关键词2]
description: 文章描述
image: 封面图URL
---

文章描述

<!-- truncate -->

## 📝 概述
文章概述内容...

## 🚀 开始
### 步骤1：准备工作
### 步骤2：具体实现

## 💡 核心要点
- 要点1
- 要点2

## 🎯 总结
总结内容...

## 📚 参考资料
- [链接1](url)
```

## 🖼️ 封面图系统

### 自动选择规则
1. **优先级1**：根据文章标签匹配
2. **优先级2**：根据文章分类匹配  
3. **优先级3**：使用默认封面图

### 支持的标签封面图
- `javascript` - JS开发相关
- `react` - React框架
- `vue` - Vue框架
- `docker` - 容器化技术
- `database` - 数据库相关
- `web` - Web开发
- `lifestyle` - 生活感悟

### 手动修改封面图
编辑文章的 frontmatter：
```yaml
image: https://your-custom-image-url.jpg
```

## 🛠️ 高级功能

### 批量处理文章
```bash
# 美化所有文章
pnpm beautify

# 修复所有封面图
pnpm fix-covers

# 添加封面图到无封面的文章
pnpm add-covers
```

### 自定义配置
编辑 `scripts/create-article.js` 文件可以：
- 修改默认标签建议
- 添加新的封面图
- 调整文章模板
- 添加新的分类

## 💡 最佳实践

### 1. 标题命名
- ✅ 具体明确：`Vue3 组合式API实践指南`
- ❌ 过于宽泛：`Vue学习笔记`

### 2. 标签选择
- 📊 **数量**：3-5个标签最佳
- 🎯 **精准**：选择最相关的标签
- 🔄 **复用**：使用已有标签增强关联性

### 3. 描述撰写
- 📝 **长度**：50-150字
- 🎯 **关键词**：包含核心关键词
- 💡 **价值**：突出文章价值和亮点

### 4. 内容结构
- 📋 使用清晰的标题层级
- 💡 添加 emoji 增强可读性
- 🖼️ 适当添加图片和代码示例
- 📚 提供参考资料链接

## 🔧 故障排除

### 问题1：文件创建失败
```bash
# 检查目录权限
ls -la blog/

# 手动创建目录
mkdir -p blog/develop
```

### 问题2：封面图显示404
```bash
# 修复封面图链接
pnpm fix-covers
```

### 问题3：构建失败
```bash
# 检查文章格式
pnpm lint

# 清除缓存重新构建
pnpm clear && pnpm build
```

## 📞 获取帮助

如果遇到问题，可以：
1. 📖 查看本文档
2. 🔍 检查控制台错误信息
3. 🛠️ 运行相关修复命令
4. 💬 在项目中创建 Issue

---

> 💡 **提示**：建议将此文档加入书签，方便随时查阅！ 