# 开发指南

本文档详细说明如何在本地开发环境运行和调试这两个项目。

## 项目架构

- **daily-agent-pages**: 前端应用（React + Vite），部署到 Cloudflare Pages
- **daily-agent-workers**: 后端服务（Cloudflare Workers），提供 GraphQL 和 REST API

## 本地开发设置

### 前置要求

1. **Node.js** (v18+)
2. **pnpm** 或 npm
3. **Wrangler CLI** (用于 Workers 开发)
4. **OpenAI API Key**

### 步骤 1: 设置后端 Workers

```bash
cd daily-agent-workers

# 安装依赖
npm install

# 创建本地环境变量文件
echo "OPENAI_API_KEY=your-openai-api-key-here" > .dev.vars

# 启动本地开发服务器（默认端口 8787）
npm run dev
```

Workers 服务将在 `http://localhost:8787` 启动。

**注意**: 
- 本地开发时，Workers 可能无法直接访问外部 API（如 OpenAI），建议使用 `wrangler dev --remote` 进行远程开发
- 或者直接部署到 Cloudflare Workers 进行测试

### 步骤 2: 设置前端 Pages

在另一个终端窗口：

```bash
cd daily-agent-pages

# 安装依赖
pnpm install

# 启动开发服务器（默认端口 5173）
pnpm dev
```

前端应用将在 `http://localhost:5173` 启动。

### 工作原理

1. **本地开发时**:
   - Vite 开发服务器配置了代理（`vite.config.ts`）
   - 所有 `/api/*` 请求会被自动代理到 `http://localhost:8787`
   - 前端代码使用相对路径，无需配置完整 URL

2. **生产环境**:
   - Cloudflare Pages Functions (`functions/api/[[path]].ts`) 会将 `/api/*` 请求代理到 Workers
   - 需要在 Pages 环境变量中设置 `WORKERS_URL`

## 测试 API

### 测试 Workers 服务

```bash
# 测试 REST API
curl http://localhost:8787/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "你好"}'

# 测试 GraphQL
curl http://localhost:8787/graphql \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { health }"
  }'
```

### 测试前端应用

1. 打开浏览器访问 `http://localhost:5173`
2. 在聊天界面输入消息
3. 检查浏览器控制台和网络请求

## 常见问题

### 1. 前端调用 `/api/chat` 一直 pending

**可能原因**:
- Workers 服务未启动
- 端口不匹配（检查 Workers 是否在 8787 端口）
- CORS 配置问题

**解决方案**:
1. 确认 Workers 服务正在运行：`curl http://localhost:8787/api/chat -X POST -H "Content-Type: application/json" -d '{"message":"test"}'`
2. 检查浏览器控制台的错误信息
3. 检查 Vite 代理配置是否正确

### 2. Workers 无法调用 OpenAI API

**可能原因**:
- 本地开发环境限制
- API Key 未设置或错误

**解决方案**:
1. 使用 `wrangler dev --remote` 进行远程开发
2. 检查 `.dev.vars` 文件中的 API Key
3. 直接部署到 Cloudflare Workers 进行测试

### 3. CORS 错误

**解决方案**:
- Workers 已配置 CORS 头，确保所有响应都包含 CORS 头
- 检查 `src/index.ts` 中的 `addCorsHeaders` 函数

## 部署

### 部署 Workers

```bash
cd daily-agent-workers

# 登录 Cloudflare
wrangler login

# 设置 API Key
wrangler secret put OPENAI_API_KEY

# 部署
npm run deploy
```

部署后会得到一个 URL，例如：`https://daily-agent-workers.your-subdomain.workers.dev`

### 部署 Pages

```bash
cd daily-agent-pages

# 构建
pnpm build

# 部署（需要先配置 wrangler.toml 或使用 Cloudflare Dashboard）
pnpm deploy
```

**重要**: 在 Cloudflare Pages 的环境变量中设置 `WORKERS_URL` 为你的 Workers URL。

## 调试技巧

1. **查看 Workers 日志**:
   ```bash
   wrangler tail
   ```

2. **查看前端网络请求**:
   - 打开浏览器开发者工具
   - 查看 Network 标签页
   - 检查 `/api/chat` 请求的详细信息

3. **本地测试 Workers**:
   ```bash
   # 使用测试脚本
   cd daily-agent-workers
   ./scripts/test-api.sh http://localhost:8787
   ```

## 环境变量

### Workers 环境变量

- **本地开发**: `.dev.vars` 文件
- **生产环境**: `wrangler secret put OPENAI_API_KEY`

### Pages 环境变量

- **本地开发**: 使用 Vite 代理，无需配置
- **生产环境**: 在 Cloudflare Dashboard 中设置 `WORKERS_URL`
