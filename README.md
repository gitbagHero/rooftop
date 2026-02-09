# Rooftop

一个基于 Next.js 的个人动态分享平台，支持发布文字和图片内容。

## 技术栈

- **前端框架**: Next.js 16.1.6 (App Router)
- **UI 库**: React 19.2.3 + Tailwind CSS 4 + shadcn/ui
- **数据库**: PostgreSQL 16 (Docker)
- **ORM**: Prisma 6.17.1
- **动画**: Framer Motion
- **语言**: TypeScript 5

## 项目结构

```
rooftop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 主站首页
│   │   ├── rooftop/           # Rooftop 动态流应用
│   │   │   ├── page.tsx       # 动态列表
│   │   │   ├── new/           # 发帖页面
│   │   │   └── p/[id]/        # 帖子详情
│   │   └── api/               # API 路由
│   ├── components/            # React 组件
│   ├── lib/                   # 工具函数和业务逻辑
│   └── middleware.ts          # 子域名路由中间件
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── migrations/            # 数据库迁移历史
├── docker-compose.dev.yml     # 开发环境配置
├── docker-compose.prod.yml    # 生产环境配置（不提交）
└── .env.local                 # 环境变量（不提交）
```

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js 20+
- Docker Desktop 或 OrbStack
- Git

### 2. 克隆项目

```bash
git clone <your-repo-url>
cd rooftop
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境变量

创建 `.env.local` 文件：

```bash
# 数据库连接
DATABASE_URL="postgresql://rooftop:rooftop_dev_password@localhost:5432/rooftop"

# 管理员 Token（用于发帖等管理操作）
ADMIN_TOKEN="your-secret-token-change-me"
```

### 5. 启动开发数据库

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 6. 初始化数据库

```bash
# 同步数据库结构
npx prisma db push

# 或创建迁移文件
npx prisma migrate dev --name init

# 生成 Prisma Client
npx prisma generate
```

### 7. 配置本地域名（可选）

编辑 `/etc/hosts` 添加：

```
127.0.0.1 gitbaghero.local
127.0.0.1 rooftop.gitbaghero.local
```

### 8. 启动开发服务器

```bash
npm run dev
```

访问：
- 主站: http://localhost:3000 或 http://gitbaghero.local:3000
- Rooftop: http://localhost:3000/rooftop 或 http://rooftop.gitbaghero.local:3000

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# Prisma 可视化界面
npx prisma studio
```

## 生产环境部署

### 1. 配置生产环境变量

在服务器上创建 `.env.local`：

```bash
DATABASE_URL="postgresql://rooftop:strong_password@postgres:5432/rooftop"
ADMIN_TOKEN="production-secret-token"
POSTGRES_PASSWORD="strong_password"
```

### 2. 启动服务

```bash
# 使用生产配置启动所有服务（数据库 + 应用）
docker compose -f docker-compose.prod.yml up -d

# 查看日志
docker compose -f docker-compose.prod.yml logs -f

# 停止服务
docker compose -f docker-compose.prod.yml down
```

### 3. 数据库迁移

```bash
# 在容器内执行迁移
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

## 数据库管理

```bash
# 查看数据库状态
docker compose -f docker-compose.dev.yml ps

# 进入数据库容器
docker compose -f docker-compose.dev.yml exec postgres psql -U rooftop -d rooftop

# 备份数据库
docker compose -f docker-compose.dev.yml exec postgres pg_dump -U rooftop rooftop > backup.sql

# 恢复数据库
docker compose -f docker-compose.dev.yml exec -T postgres psql -U rooftop rooftop < backup.sql
```

## 子域名路由

项目支持通过子域名访问 Rooftop 应用：

- `gitbaghero.pw` → 主站首页
- `rooftop.gitbaghero.pw` → Rooftop 动态流

通过 `src/middleware.ts` 实现子域名到路由的映射。

## 常见问题

### 端口冲突

如果 5432 端口被占用，修改 `docker-compose.dev.yml` 中的端口映射：

```yaml
ports:
  - '5433:5432'  # 使用 5433 端口
```

同时更新 `.env.local` 中的 `DATABASE_URL`。

### Prisma 迁移错误

如果遇到迁移冲突，可以重置数据库：

```bash
npx prisma migrate reset --force
```

### 图片上传限制

默认上传大小限制为 10MB，可在 `next.config.ts` 中调整：

```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '50mb',
  },
},
```

## License

MIT