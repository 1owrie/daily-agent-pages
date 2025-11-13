# 快速启动指南

## 本地开发（5 分钟设置）

### 1. 启动后端 Workers

```bash
cd daily-agent-workers

# 安装依赖
npm install

# 创建环境变量文件
echo "OPENAI_API_KEY=your-api-key-here" > .dev.vars

# 启动服务（端口 8787）
npm run dev
```

**注意**: 如果本地无法调用 OpenAI API，使用远程模式：
```bash
npm run dev -- --remote
```

### 2. 启动前端 Pages

在另一个终端：

```bash
cd daily-agent-pages

# 安装依赖
pnpm install

# 启动开发服务器（端口 5173）
pnpm dev
```

### 3. 访问应用

打开浏览器访问：`http://localhost:5173`

## 验证设置

### 测试后端 API

```bash
curl http://localhost:8787/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "你好"}'
```

如果返回 JSON 响应，说明后端正常。

### 测试前端

1. 在浏览器中打开 `http://localhost:5173`
2. 输入消息并发送
3. 检查浏览器控制台是否有错误

## 常见问题

### 问题：前端调用一直 pending

**检查清单**：
1. ✅ Workers 服务是否在运行？（检查 `http://localhost:8787`）
2. ✅ 浏览器控制台是否有错误？
3. ✅ 网络请求是否被发送？（查看 Network 标签）

**解决方案**：
```bash
# 测试 Workers 是否正常
curl http://localhost:8787/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# 如果失败，检查 Workers 日志
# 在 Workers 终端查看输出
```

### 问题：Workers 无法调用 OpenAI

**解决方案**：
1. 使用远程模式：`npm run dev -- --remote`
2. 或直接部署到 Cloudflare Workers 测试

## 部署到生产环境

### 部署 Workers

```bash
cd daily-agent-workers
wrangler login
wrangler secret put OPENAI_API_KEY
npm run deploy
```

记录部署后的 URL（例如：`https://daily-agent-workers.xxx.workers.dev`）

### 部署 Pages

```bash
cd daily-agent-pages
pnpm build
pnpm deploy
```

**重要**: 在 Cloudflare Pages Dashboard 中设置环境变量：
- `WORKERS_URL`: 你的 Workers URL（例如：`https://daily-agent-workers.xxx.workers.dev`）

## 下一步

- 查看 [DEVELOPMENT.md](./DEVELOPMENT.md) 了解详细开发指南
- 查看 [API_USAGE.md](./API_USAGE.md) 了解 API 使用说明


