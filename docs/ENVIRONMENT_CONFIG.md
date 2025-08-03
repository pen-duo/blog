# 环境配置指南

## 环境变量配置

本项目使用 `cross-env` 来管理不同环境的配置。

### 1. 开发环境配置

创建 `.env.development` 文件：

```bash
# 开发环境配置
NODE_ENV=development

# Cloudflare R2 配置 (开发环境)
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_REGION=auto
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=blog-images-dev
R2_CUSTOM_DOMAIN=https://images-dev.yourdomain.com

# 图片管理访问密码 (开发环境)
REACT_APP_IMAGE_MANAGER_PASSWORD=dev123

# 其他开发环境配置
DEBUG=true
LOG_LEVEL=debug
```

### 2. 生产环境配置

创建 `.env.production` 文件：

```bash
# 生产环境配置
NODE_ENV=production

# Cloudflare R2 配置 (生产环境)
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_REGION=auto
R2_ACCESS_KEY_ID=your-production-access-key-id
R2_SECRET_ACCESS_KEY=your-production-secret-access-key
R2_BUCKET_NAME=blog-images-prod
R2_CUSTOM_DOMAIN=https://images.yourdomain.com

# 图片管理访问密码 (生产环境)
REACT_APP_IMAGE_MANAGER_PASSWORD=prod-secure-password

# 其他生产环境配置
DEBUG=false
LOG_LEVEL=error
```

### 3. 本地开发配置

创建 `.env.local` 文件（用于本地开发，不会被提交到Git）：

```bash
# 本地开发配置
NODE_ENV=development

# 本地R2配置
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-local-access-key-id
R2_SECRET_ACCESS_KEY=your-local-secret-access-key
R2_BUCKET_NAME=blog-images-local
R2_CUSTOM_DOMAIN=https://images-local.yourdomain.com

# 本地图片管理密码
REACT_APP_IMAGE_MANAGER_PASSWORD=local123
```

## 脚本命令

### 开发环境命令

```bash
# 启动开发服务器
pnpm start                    # NODE_ENV=development

# 构建开发版本
pnpm build:dev               # NODE_ENV=development

# 预览开发版本
pnpm serve:dev               # NODE_ENV=development

# 图片管理（仅开发环境）
pnpm image-manager           # NODE_ENV=development
```

### 生产环境命令

```bash
# 启动生产服务器
pnpm start:prod             # NODE_ENV=production

# 构建生产版本
pnpm build                  # NODE_ENV=production

# 预览生产版本
pnpm serve                  # NODE_ENV=production

# 部署
pnpm deploy                 # NODE_ENV=production
```

### 工具脚本

```bash
# 文章管理（仅开发环境）
pnpm new                    # NODE_ENV=development
pnpm new:quick             # NODE_ENV=development
pnpm beautify              # NODE_ENV=development
pnpm fix-mdx               # NODE_ENV=development
pnpm add-meta              # NODE_ENV=development
```

## 环境变量优先级

环境变量按以下优先级加载：

1. `.env.local` (最高优先级，本地开发)
2. `.env.development` (开发环境)
3. `.env.production` (生产环境)
4. 系统环境变量
5. 默认值 (最低优先级)

## 安全注意事项

### 1. 文件安全
- `.env.local` 文件不会被提交到Git
- `.env.development` 和 `.env.production` 可以提交到Git
- 敏感信息（如API密钥）建议使用环境变量

### 2. 密码管理
- 开发环境使用简单密码：`dev123`
- 生产环境使用强密码
- 定期更换生产环境密码

### 3. 存储桶分离
- 开发环境：`blog-images-dev`
- 生产环境：`blog-images-prod`
- 避免开发和生产环境混用

## 部署配置

### Vercel部署

在Vercel项目设置中添加环境变量：

```bash
# 生产环境变量
NODE_ENV=production
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-production-access-key-id
R2_SECRET_ACCESS_KEY=your-production-secret-access-key
R2_BUCKET_NAME=blog-images-prod
R2_CUSTOM_DOMAIN=https://images.yourdomain.com
REACT_APP_IMAGE_MANAGER_PASSWORD=your-secure-password
```

### 其他平台

根据部署平台的要求，在平台的环境变量设置中配置相应的变量。

## 故障排除

### 1. 环境变量未生效
- 检查文件名是否正确
- 确认变量名拼写正确
- 重启开发服务器

### 2. 跨平台兼容性
- 使用 `cross-env` 确保跨平台兼容
- 避免使用平台特定的环境变量语法

### 3. 调试环境变量
```bash
# 查看当前环境变量
echo $NODE_ENV

# 在代码中调试
console.log('NODE_ENV:', process.env.NODE_ENV)
``` 