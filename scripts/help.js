#!/usr/bin/env node

console.log(`
🎉 Jimmy's Blog - 智能文章管理系统

📝 创建文章：
  pnpm new                    - 交互式创建文章（推荐）
  pnpm new:quick "标题" 分类   - 快速创建文章

🎨 优化文章：
  pnpm beautify              - 美化所有文章格式和封面图
  pnpm add-covers            - 为无封面的文章添加封面图
  pnpm fix-covers            - 修复所有封面图链接
  pnpm fix-mdx               - 修复MDX编译错误（推荐）
  pnpm add-meta              - 为所有文章添加完整元信息

🚀 开发预览：
  pnpm start                 - 启动开发服务器 (NODE_ENV=development)
  pnpm start:prod           - 启动生产服务器 (NODE_ENV=production)
  pnpm build                - 构建生产版本 (NODE_ENV=production)
  pnpm build:dev            - 构建开发版本 (NODE_ENV=development)
  pnpm serve                - 预览生产版本 (NODE_ENV=production)
  pnpm serve:dev            - 预览开发版本 (NODE_ENV=development)

📂 文章分类：
  develop   - 开发技术（JavaScript、React、Vue等）
  program   - 编程实践（架构、API、数据库等）
  project   - 项目分享（开源项目、产品设计等）
  lifestyle - 生活感悟（思考、成长、经验分享）
  reference - 年度总结（回顾、规划、目标）

💡 使用示例：
  pnpm new:quick "Vue3组合式API实践" develop
  pnpm new:quick "个人博客搭建指南" project
  pnpm new:quick "程序员的时间管理" lifestyle

🔧 常见问题解决：
  1. 构建失败 → 运行 pnpm fix-mdx 修复MDX错误
  2. 封面图404 → 运行 pnpm fix-covers 修复图片链接
  3. 格式不美观 → 运行 pnpm beautify 美化格式
  4. 缺少元信息 → 运行 pnpm add-meta 添加完整元信息

📋 完整元信息包含：
  • slug: URL路径
  • title: 文章标题  
  • date: 发布日期
  • authors: 作者信息
  • tags: 文章标签
  • keywords: 关键词
  • description: 文章描述
  • image: 封面图片

📖 详细文档：
  查看 scripts/ARTICLE_WORKFLOW.md 获取完整指南

🖼️ 图片管理：
  pnpm image-manager      - 快速打开图片管理页面

🆘 遇到问题？
  1. 检查控制台错误信息
  2. 运行 pnpm fix-mdx 修复文章格式
  3. 运行 pnpm add-meta 添加完整元信息
  4. 运行 pnpm clear && pnpm build 清除缓存

✨ 快速开始：运行 'pnpm new' 创建你的第一篇文章！
`); 