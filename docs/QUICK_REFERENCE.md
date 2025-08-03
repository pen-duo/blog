# 🚀 快速参考指南

## 📝 创建新文章

```bash
# 交互式创建（推荐）
pnpm new

# 快速创建
pnpm new:quick "文章标题" develop
```

## 🎨 优化文章

```bash
# 一键美化（包含格式、封面图、元信息）
pnpm beautify

# 添加完整元信息
pnpm add-meta

# 修复 MDX 错误
pnpm fix-mdx

# 修复封面图
pnpm fix-covers
```

## 🚀 开发部署

```bash
# 开发预览
pnpm start

# 构建测试
pnpm build

# 本地预览构建结果
pnpm serve
```

## 📋 发布流程

```bash
# 1. 优化文章
pnpm beautify && pnpm add-meta

# 2. 测试构建
pnpm build

# 3. 提交代码
git add .
git commit -m "feat: 新增文章《标题》"
git push

# 4. 自动部署到 Vercel
```

## 🆘 问题解决

```bash
# 构建失败
pnpm fix-mdx && pnpm build

# 封面图404
pnpm fix-covers

# 查看帮助
pnpm run help
```

## 📂 文章分类

- `develop` - 开发技术
- `program` - 编程实践  
- `project` - 项目分享
- `lifestyle` - 生活感悟
- `reference` - 年度总结

## 📋 文章元信息

每篇文章自动包含：
- slug, title, date, authors
- tags, keywords, description
- image (封面图)

---

> 💡 详细文档请查看 `docs/ARTICLE_WORKFLOW_COMPLETE.md` 