# Daily Agent Pages - AI 聊天助手前端

基于 React + TypeScript + Vite + Ant Design X 构建的现代化 AI 聊天助手，通过 GraphQL 连接后端 Workers 服务。

## 📦 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **GraphQL** - API 查询语言
- **graphql-request** - GraphQL 客户端
- **Ant Design X** - 面向 AI 应用的组件库
- **Ant Design** - UI 组件库
- **Cloudflare Pages** - 部署平台

## ✨ 功能特性

### 🎯 核心功能
- ✅ 实时 AI 对话 - 通过 GraphQL 与 OpenAI 交互
- ✅ 流畅的用户体验 - 现代化的聊天界面
- ✅ 响应式设计 - 适配各种屏幕尺寸
- ✅ 本地开发支持 - Vite 代理配置
- ✅ 生产环境部署 - Cloudflare Pages

### 🎨 界面特色
- 清晰的消息气泡展示
- 实时加载状态提示
- 优雅的错误处理
- 自动滚动到最新消息

## 🚀 快速开始

### 前置要求

1. **Node.js** (推荐 v18+)
2. **pnpm** (推荐) 或 npm/yarn
3. **后端 Workers 服务** - 需要先启动 `daily-agent-workers` 服务

### 安装依赖

```bash
pnpm install
```

### 本地开发

**重要**：在启动前端之前，需要先启动后端 Workers 服务。

#### 1. 启动后端 Workers（在 `daily-agent-workers` 目录）

```bash
cd ../daily-agent-workers

# 安装依赖
npm install

# 配置环境变量
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars，添加你的 OPENAI_API_KEY

# 启动 Workers 服务（默认端口 8787）
npm run dev
```

#### 2. 启动前端（在 `daily-agent-pages` 目录）

```bash
cd ../daily-agent-pages

# 启动 Vite 开发服务器（默认端口 5173）
pnpm dev
```

访问 `http://localhost:5173` 即可查看应用。

**工作原理**：
- Vite 开发服务器配置了代理，所有 `/graphql` 请求会被自动代理到 `http://localhost:8787`（Workers 服务）
- 前端通过 GraphQL 客户端调用后端 API
- 后端通过 OpenAI API 生成 AI 回复

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist` 目录。

### 部署到 Cloudflare Pages

```bash
# 构建项目
pnpm build

# 部署到 Pages
pnpm deploy
```

**生产环境配置**：

1. 在 Cloudflare Pages 设置中配置环境变量：
   ```
   VITE_WORKERS_URL=https://daily-agent-workers.your-subdomain.workers.dev
   ```

2. 确保 Workers 服务已部署并正常运行

### 预览生产构建

```bash
pnpm preview
```

## 📁 项目结构

```
daily-agent-pages/
├── src/
│   ├── components/          # React 组件
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageList.tsx
│   │   └── MessageBubble.tsx
│   ├── views/
│   │   └── ChatView.tsx     # 主聊天视图
│   ├── services/
│   │   └── graphqlClient.ts # GraphQL 客户端
│   ├── types/
│   │   └── index.ts         # 类型定义
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts           # Vite 配置（含代理）
├── wrangler.toml            # Cloudflare Pages 配置
├── .env.example             # 环境变量示例
└── package.json
```

## 🔧 配置说明

### GraphQL 端点配置

项目支持灵活的端点配置：

#### 开发环境
- 默认通过 Vite 代理自动转发到 `http://localhost:8787/graphql`
- 在 [vite.config.ts:16-20](vite.config.ts#L16-L20) 配置代理

#### 生产环境
有两种方式配置：

1. **通过环境变量**（推荐）：
   ```bash
   # .env.production
   VITE_WORKERS_URL=https://daily-agent-workers.your-subdomain.workers.dev
   ```

2. **在 Cloudflare Pages Dashboard 中配置**：
   - 进入 Pages 项目设置
   - 添加环境变量 `VITE_WORKERS_URL`
   - 值为你的 Workers 服务 URL

### 环境变量

参考 [.env.example](.env.example)：

```env
# GraphQL 端点（可选）
VITE_GRAPHQL_ENDPOINT=http://localhost:8787/graphql

# Workers URL（生产环境）
VITE_WORKERS_URL=https://daily-agent-workers.your-subdomain.workers.dev
```

## 🔗 相关项目

- **后端服务**：[daily-agent-workers](../daily-agent-workers) - GraphQL API 和 OpenAI 集成

## 📝 开发指南

### 代码规范

```bash
# 运行 ESLint 检查
pnpm lint
```

### 技术要点

1. **GraphQL 客户端**：使用 `graphql-request` 库，配置在 [src/services/graphqlClient.ts](src/services/graphqlClient.ts)
2. **状态管理**：使用 React Hooks（useState, useEffect）
3. **类型安全**：完整的 TypeScript 类型定义
4. **响应式设计**：基于 Ant Design 组件库

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过 Issue 联系我们。

---

**祝你使用愉快！** 🎉
