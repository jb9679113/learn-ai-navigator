# 部署到 Vercel 指南

## 前提条件

1. ✅ 代码已推送到 GitHub 仓库：`https://github.com/jb9679113/learn-ai-navigator`
2. ✅ 已安装 Vercel CLI（可选）：`npm i -g vercel`

## 部署步骤

### 方法一：通过 Vercel 网站部署（推荐）

#### 1. 登录 Vercel
- 访问 [https://vercel.com](https://vercel.com)
- 使用 GitHub 账号登录

#### 2. 导入项目
- 点击 **"Add New"** → **"Project"**
- 在 **"Import Git Repository"** 页面找到 `jb9679113/learn-ai-navigator` 仓库
- 点击 **"Import"**

#### 3. 配置项目
- **Framework Preset**: Next.js（自动检测）
- **Build Command**: `prisma generate && prisma migrate deploy && next build`
- **Output Directory**: `.next`（默认）

#### 4. 添加环境变量
在 **"Environment Variables"** 部分添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `ADMIN_SECRET` | `admin123` | Production, Preview, Development |
| `DATABASE_URL` | (Vercel Postgres 连接字符串) | Production |
| `POSTGRES_PRISMA_URL` | (Vercel Postgres 连接字符串) | Production |

#### 5. 配置 Vercel Postgres（推荐）
- 在项目设置页面，点击 **"Storage"** → **"Add Database"** → **"Postgres"**
- 创建新数据库或选择现有数据库
- Vercel 会自动设置 `POSTGRES_PRISMA_URL` 和 `DATABASE_URL`

#### 6. 部署
- 点击 **"Deploy"**
- 等待构建完成（约 2-3 分钟）
- 部署成功后会显示访问 URL

### 方法二：通过 Vercel CLI 部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel

# 4. 生产环境部署
vercel --prod
```

## 数据库迁移

首次部署后，需要运行数据库迁移：

### 方式一：自动（推荐）
- Vercel 会在每次构建时自动运行 `prisma migrate deploy`
- 确保 `vercel.json` 中配置了正确的 `buildCommand`

### 方式二：手动
```bash
# 设置环境变量
vercel env add DATABASE_URL "your-database-url"

# 运行迁移
vercel env pull
npx prisma migrate deploy
```

## 验证部署

1. **访问网站首页**
   - 检查是否正常加载
   - 验证资源列表和分类显示

2. **测试后台管理**
   - 访问 `/admin` 页面
   - 使用密码 `admin123` 登录
   - 测试添加/编辑/删除资源

3. **检查 API**
   - `/api/categories` - 获取分类列表
   - `/api/resources` - 获取资源列表

## 常见问题

### 1. 构建失败
**错误**: `Error: Prisma schema validation`
**解决**: 确保环境变量正确配置，特别是 `DATABASE_URL`

### 2. 数据库连接失败
**错误**: `Can't reach database server`
**解决**: 
- 检查 Vercel Postgres 是否正确配置
- 验证 `DATABASE_URL` 环境变量

### 3. API 返回 500 错误
**解决**:
- 检查 Vercel Function Logs
- 确保 Prisma Client 已正确生成

## 后续优化

### 性能优化
- 启用 Vercel Analytics
- 配置 ISR（增量静态再生成）
- 使用 Vercel Blob Storage 存储静态资源

### 安全优化
- 修改默认管理员密码
- 配置 CORS
- 启用速率限制

### 监控
- 设置 Vercel Alerts
- 监控错误日志
- 跟踪性能指标

## 本地测试部署

```bash
# 1. 拉取生产环境变量
vercel env pull

# 2. 本地构建
npm run build

# 3. 本地运行
npm start
```

## 参考链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Prisma 与 Vercel](https://www.prisma.io/docs/guides/database/vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
