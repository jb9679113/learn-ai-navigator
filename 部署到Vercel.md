请基于我之前发给你的那个完整的“AI学习资源导航网站”项目提示词（包含 React + Next.js + Prisma + 后台管理等功能）进行开发，但需要做以下针对 Vercel Postgres 一体化部署的适配修改：

1. **数据库适配**：
   - 使用 Vercel Postgres 作为数据库（而不是普通 PostgreSQL 或 SQLite）。
   - Prisma schema 中的 datasource 块应使用 `postgresql` 提供者，并且连接字符串将通过环境变量 `POSTGRES_PRISMA_URL` 提供（Vercel 自动注入）。
   - 为了兼容 Prisma 的默认行为，请在代码中同时支持 `DATABASE_URL` 环境变量（如果未定义则回退到 `POSTGRES_PRISMA_URL`），或者直接在 `.env.example` 中说明部署后需手动设置 `DATABASE_URL` 等于 `POSTGRES_PRISMA_URL` 的值。

2. **环境变量**：
   - 提供 `.env.example` 文件，包含：
     - `POSTGRES_PRISMA_URL`（Vercel Postgres 自动注入，本地开发时需手动填写）
     - `ADMIN_SECRET`（用于后台保护，默认 admin123）
     - `NEXTAUTH_SECRET`（如果使用 NextAuth，可选，目前不需要）
   - 在 README 中注明：部署到 Vercel 后，数据库连接字符串会自动注入，无需手动配置；本地开发时需在 Vercel 项目面板的 Storage 中获取连接字符串并填入 `.env.local`。

3. **数据库迁移与种子数据**：
   - 提供 `prisma/migrations` 初始迁移文件，以及一个种子脚本（`prisma/seed.ts`），用于创建示例分类和那 4 个初始资源。
   - 种子脚本应能检测环境（生产/开发），避免重复插入。
   - 在 `package.json` 中添加 `"prisma:seed": "tsx prisma/seed.ts"` 和 `"postinstall": "prisma generate"`。

4. **部署配置**：
   - 确保 `next.config.js` 正确配置了 `output: 'standalone'` 或保持默认（Vercel 自动优化）。
   - 添加 `vercel.json`（可选），但至少要保证 Prisma 的二进制文件能被正确打包。
   - 在 README 中增加专门的“部署到 Vercel”章节，步骤包括：
     1. 将代码推送到 GitHub。
     2. 在 Vercel 导入项目，选择对应的 GitHub 仓库。
     3. 在 Vercel 项目 Dashboard 中，点击 “Storage” → “Create Database” → “Prisma Postgres”，创建数据库。
     4. 等待数据库创建完成，Vercel 会自动注入环境变量 `POSTGRES_PRISMA_URL`。
     5. 回到项目 “Settings” → “Environment Variables”，添加 `ADMIN_SECRET`（自定义密码）。
     6. 重新部署一次（Vercel 会自动运行 `prisma migrate deploy` 和 `prisma db seed`，如果没有，需在构建命令中配置）。
     7. 访问生成的域名即可使用。

5. **构建与启动脚本**：
   - 修改 `package.json` 中的 `build` 脚本为：`"build": "prisma generate && next build"`。
   - 添加 `"vercel-build": "prisma generate && prisma migrate deploy && next build"`，确保 Vercel 在构建时执行迁移。

6. **代码细节调整**：
   - 所有 API 路由中使用 PrismaClient 时，应使用全局单例（防止开发环境下热重载导致过多连接）。
   - 数据库查询中注意处理 `POSTGRES_PRISMA_URL` 可能包含 `?pgbouncer=true` 后缀，这对 Prisma 是兼容的。

请根据以上补充要求，生成完整的项目代码。其他所有功能和界面设计与之前我给出的提示词保持一致（资源管理、分类树、后台管理、搜索筛选等）。最终输出应该是一个可以直接复制到本地、安装依赖、配置环境变量、部署到 Vercel 并正常工作的全栈项目。

开始生成。