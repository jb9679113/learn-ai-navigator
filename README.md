# AI学习资源导航网站

一个现代化的资源导航网站，用于集中管理 AI 学习相关的网站、GitHub 仓库、文档等资源。

## 技术栈

- 前端框架：React + Next.js (App Router) + TypeScript
- 样式：TailwindCSS
- 后端：Next.js API Routes
- ORM：Prisma
- 数据库：PostgreSQL (Vercel Postgres)

## 功能特性

### 前台（公开访问）
- 首页：Hero 区域、热门分类入口、最新添加资源、推荐资源
- 资源列表页：左侧树形分类菜单、资源卡片列表、搜索筛选功能
- 资源详情弹窗：完整描述、链接按钮、我的笔记区域（仅管理员可见）
- 资源详情独立页：SEO 友好的资源详情页面

### 后台管理（/admin）
- 简单密码保护登录
- 资源管理：列表展示、添加、编辑、删除
- 分类管理：树形列表、添加、编辑、删除
- 标签管理：资源标签支持

## 快速开始

### 环境要求
- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写连接字符串：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```env
POSTGRES_PRISMA_URL="your-postgres-connection-string"
ADMIN_SECRET="admin123"
```

### 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

### 运行种子数据

```bash
npm run prisma:seed
```

### 构建生产版本

```bash
npm run build
```

## 部署到 Vercel

### 部署步骤

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "Add New" → "Project"
   - 选择你的 GitHub 仓库

3. **创建 Vercel Postgres 数据库**
   - 在 Vercel 项目 Dashboard 中，点击 "Storage" → "Create Database"
   - 选择 "Prisma Postgres"，等待数据库创建完成
   - Vercel 会自动注入环境变量 `POSTGRES_PRISMA_URL`

4. **配置环境变量**
   - 回到项目 "Settings" → "Environment Variables"
   - 添加 `ADMIN_SECRET`（自定义密码）

5. **重新部署**
   - Vercel 会自动运行 `prisma migrate deploy` 和构建命令
   - 如果没有自动执行，手动触发重新部署

6. **访问网站**
   - 部署完成后，访问生成的域名即可使用

### 注意事项

- 部署到 Vercel 后，数据库连接字符串会自动注入，无需手动配置
- 本地开发时需在 Vercel 项目面板的 Storage 中获取连接字符串并填入 `.env.local`
- 初始种子数据会在首次部署时自动运行

## 项目结构

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── resources/     # 资源相关 API
│   │   ├── categories/    # 分类相关 API
│   │   └── admin/         # 管理员验证 API
│   ├── resources/         # 资源列表页
│   ├── resource/          # 资源详情页
│   ├── admin/             # 后台管理页
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── Header.tsx         # 头部导航
│   ├── Hero.tsx           # Hero 区域
│   ├── CategoryTree.tsx   # 分类树组件
│   ├── ResourceCard.tsx   # 资源卡片组件
│   ├── SearchFilter.tsx   # 搜索筛选组件
│   ├── ResourceModal.tsx  # 资源详情弹窗
│   ├── ResourceForm.tsx   # 资源表单
│   └── CategoryForm.tsx   # 分类表单
├── lib/                   # 工具库
│   └── prisma.ts          # Prisma 客户端单例
├── prisma/                # Prisma 配置
│   ├── schema.prisma      # 数据模型定义
│   ├── migrations/        # 数据库迁移文件
│   └── seed.ts            # 种子脚本
├── .env.example           # 环境变量示例
├── next.config.js         # Next.js 配置
├── tailwind.config.js     # TailwindCSS 配置
├── postcss.config.js      # PostCSS 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目配置
```

## 默认管理员密码

默认密码：`admin123`

建议在生产环境中修改此密码（通过环境变量 `ADMIN_SECRET`）。

## 许可证

MIT
