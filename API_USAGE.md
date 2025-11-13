# API 配置使用说明

## 快速开始

### 方法一：直接修改配置文件（推荐）

编辑 `src/config/apiConfig.ts` 文件：

```typescript
export const API_CONFIG = {
  baseUrl: 'https://your-api.com',  // 修改为你的 API 地址
  endpoint: '/api/chat',             // 修改为你的端点
  method: 'POST',                    // 'GET' 或 'POST'
};
```

### 方法二：使用环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=https://your-api.com
VITE_API_ENDPOINT=/api/chat
VITE_API_METHOD=POST
```

## API 接口规范

### POST 请求示例

**请求格式：**
```json
{
  "message": "用户发送的消息",
  "conversationId": "conv_1234567890"
}
```

**响应格式：**
```json
{
  "response": "AI 的回复内容",
  "conversationId": "conv_1234567890",
  "timestamp": 1234567890
}
```

或者：
```json
{
  "message": "AI 的回复内容"
}
```

### GET 请求示例

**请求 URL：**
```
https://your-api.com/api/chat?message=用户消息&conversationId=conv_1234567890
```

**响应格式：** 同 POST

## 动态配置 API

你也可以在代码中动态配置：

```typescript
import { configureChatApi } from './services/chatApi';

// 设置基础 URL
configureChatApi.setBaseUrl('https://your-api.com');

// 设置端点
configureChatApi.setEndpoint('/api/chat');

// 设置请求方法
configureChatApi.setMethod('POST'); // 或 'GET'
```

## 自定义请求参数

如果你的 API 需要额外的参数，可以在发送消息时添加：

编辑 `src/views/ChatView.tsx` 中的 `handleSendMessage` 函数：

```typescript
const response = await sendChatMessage({
  message: messageContent,
  conversationId: conversationId,
  // 添加自定义参数
  userId: 'user123',
  temperature: 0.7,
  maxTokens: 1000,
});
```

## 错误处理

当 API 调用失败时，会自动显示错误消息："抱歉，服务暂时不可用。请稍后再试。"

你可以在 `src/views/ChatView.tsx` 中自定义错误处理逻辑。

## 注意事项

1. **CORS 配置**：确保你的后端 API 允许跨域请求
2. **认证**：如果需要 Authorization header，可以在 `src/services/chatApi.ts` 中添加
3. **超时设置**：可以在 fetch 请求中添加 timeout 配置
4. **响应格式**：代码会自动适配 `response` 或 `message` 字段作为 AI 回复

