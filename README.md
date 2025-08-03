# Jimmy's Blog

基于 Docusaurus 构建的个人博客网站

<a href="" rel="nofollow"><img src="https://vercel.com/button"></a>
<a href="" rel="nofollow"><img src="https://www.netlify.com/img/deploy/button.svg"></a>
<a href="" rel="nofollow"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"></a>

## 特性

- ✅ **Docusaurus 3.0** - 现代化静态站点生成器
- ✅ **React 19** - 最新 React 版本
- ✅ **TypeScript** - 类型安全
- ✅ **博客功能** - 完整的博客系统
- ✅ **国际化支持** - 中英双语
- ✅ **智能工具** - 自动化文章管理
- ✅ **SEO 优化** - 搜索引擎友好
- ✅ **响应式设计** - 移动端适配

## 📚 文档

- [📝 完整工作流程文档](docs/ARTICLE_WORKFLOW_COMPLETE.md) - 从撰写到发布的详细指南
- [🚀 快速参考指南](docs/QUICK_REFERENCE.md) - 常用命令速查
- [📁 项目结构说明](docs/PROJECT_STRUCTURE.md) - 目录结构和文件组织
- [🛠️ 脚本使用说明](scripts/ARTICLE_WORKFLOW.md) - 工具脚本详解

如果你想要搭建一个类似的站点，可直接 [Fork](https://github.com/pen-duo/blog/fork) 本仓库使用，或者通过 [StackBlitz]() 在线运行本项目，通过 [Vercel]() 一键部署。

## 安装

```bash
git clone https://github.com/pen-duo/blog.git
cd blog
pnpm install
```

## 🚀 智能工具

本项目提供了完整的文章管理工具链：

### 📝 创建文章
```bash
pnpm new                    # 交互式创建文章
pnpm new:quick "标题" 分类   # 快速创建文章
```

### 🎨 优化文章
```bash
pnpm beautify              # 美化格式和封面图
pnpm add-meta              # 添加完整元信息
pnpm fix-mdx               # 修复 MDX 错误
pnpm fix-covers            # 修复封面图链接
```

### 📋 查看帮助
```bash
pnpm run help              # 显示所有可用命令
```

## 开发

```bash
pnpm start                 # 启动开发服务器
pnpm build                 # 构建生产版本
pnpm serve                 # 预览构建结果
```

## 主题

基于 Docusaurus 的博客主题，支持深色模式，移动端适配，SEO 优化等。

主题魔改实现：[Docusaurus 主题魔改]()

## 预览

<img width="1471" alt="Live Demo" src="./static/img/og.png">
