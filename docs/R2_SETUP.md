# Cloudflare R2 集成配置指南

## 1. 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下配置：

### 图片管理访问密码
```bash
# 图片管理页面访问密码（可选，默认为 admin123）
REACT_APP_IMAGE_MANAGER_PASSWORD=your-secure-password
```

```bash
# Cloudflare R2 配置
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_REGION=auto
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=blog-images
R2_CUSTOM_DOMAIN=https://images.yourdomain.com
```

## 2. 获取R2配置信息

### 步骤1：创建R2存储桶
1. 登录 [Cloudflare控制台](https://dash.cloudflare.com)
2. 点击 **"R2 Object Storage"**
3. 点击 **"Create bucket"**
4. 输入存储桶名称：`blog-images`
5. 选择地区（建议选择离用户最近的地区）

### 步骤2：获取API凭证
1. 在R2页面，点击 **"Manage R2 API tokens"**
2. 点击 **"Create API token"**
3. 选择 **"Custom token"**
4. 配置权限：
   - **Object Read** - 读取权限
   - **Object Write** - 写入权限
5. 保存并记录以下信息：
   - **Account ID**
   - **Access Key ID**
   - **Secret Access Key**

### 步骤3：配置自定义域名（可选）
1. 在存储桶设置中，点击 **"Settings"**
2. 找到 **"Custom Domains"**
3. 添加你的域名（如：`images.yourdomain.com`）
4. 配置DNS记录

## 3. 更新配置文件

将获取的信息更新到 `.env.local` 文件中：

```bash
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-actual-access-key-id
R2_SECRET_ACCESS_KEY=your-actual-secret-access-key
R2_BUCKET_NAME=blog-images
R2_CUSTOM_DOMAIN=https://images.yourdomain.com
```

## 4. 验证配置

启动开发服务器，访问 `/image-manager` 页面测试功能：

```bash
pnpm start
```

### 访问图片管理页面
1. 访问：`http://localhost:3000/image-manager`
2. 输入访问密码（默认为 `admin123`）
3. 点击登录进入管理界面

### 安全说明
- 图片管理页面已从导航栏移除，不会对外暴露
- 添加了密码保护，只有知道密码的用户才能访问
- 支持登录状态保持，避免重复输入密码
- 超过5次错误尝试会临时锁定30秒

## 5. 功能特性

### 已实现功能
- ✅ 图片上传（支持拖拽）
- ✅ 图片预览和管理
- ✅ 文件类型验证
- ✅ 文件大小限制
- ✅ 图片列表展示
- ✅ 复制图片URL
- ✅ 删除图片
- ✅ 响应式设计

### 待实现功能
- 🔄 批量上传
- 🔄 图片压缩
- 🔄 图片裁剪
- 🔄 文件夹管理
- 🔄 搜索和筛选

## 6. 使用说明

### 上传图片
1. 访问 `/image-manager` 页面
2. 点击上传区域或拖拽图片
3. 等待上传完成
4. 复制图片URL用于博客文章

### 管理图片
- 点击图片上的按钮进行管理
- 复制URL：复制图片链接
- 删除：删除不需要的图片

## 7. 注意事项

### 安全考虑
- 不要将 `.env.local` 文件提交到Git
- 定期轮换API密钥
- 设置合适的文件大小限制

### 性能优化
- 图片会自动设置1年缓存
- 使用CDN加速访问
- 支持WebP等现代格式

### 成本控制
- 免费套餐：10GB存储，1000万次读取/月
- 监控使用量避免超出免费额度
- 定期清理无用图片

## 8. 故障排除

### 常见问题
1. **上传失败**：检查API密钥和权限
2. **图片无法显示**：检查自定义域名配置
3. **权限错误**：确认存储桶权限设置

### 调试方法
1. 检查浏览器控制台错误
2. 验证环境变量配置
3. 测试R2连接性

## 9. 扩展功能

### 可以添加的功能
- 图片水印
- 自动生成缩略图
- 图片分类标签
- 使用统计
- 备份和恢复

### 集成其他服务
- 图片处理服务
- CDN优化
- 监控和告警 