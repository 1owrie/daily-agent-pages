// Cloudflare Pages Functions 代理配置
// 将 /api/* 请求代理到 Workers

interface Env {
  WORKERS_URL?: string;
}

export async function onRequest(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 获取 Workers 的 URL
  // 可以通过环境变量配置，或者使用默认的 Workers URL
  // 在 Cloudflare Pages 的环境变量中设置 WORKERS_URL
  const workersUrl = env.WORKERS_URL || 'https://daily-agent-workers.your-subdomain.workers.dev';
  
  // 构建目标 URL（保留路径和查询参数）
  const targetUrl = `${workersUrl}${url.pathname}${url.search}`;
  
  // 创建新的请求头，移除可能导致问题的头
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  // 转发请求到 Workers
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
  });
  
  // 返回响应（CORS 头由 Workers 处理）
  return response;
}


