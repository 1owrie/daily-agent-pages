/**
 * GraphQL 客户端服务
 *
 * 负责与后端 GraphQL API 通信
 * 功能：
 * - 发送聊天消息
 * - 测试连接状态
 * - 动态切换 API 端点
 *
 * @module graphqlClient
 */

import { GraphQLClient, gql } from 'graphql-request';

// ====================================
// GraphQL 操作定义
// ====================================

/**
 * 聊天 Mutation
 *
 * 发送用户消息并获取 AI 回复
 */
const CHAT_MUTATION = gql`
  mutation Chat($message: String!, $conversationId: String) {
    chat(message: $message, conversationId: $conversationId) {
      response
      conversationId
      timestamp
    }
  }
`;

/**
 * 健康检查 Query
 *
 * 用于测试 GraphQL 服务是否正常运行
 */
const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

// ====================================
// TypeScript 接口定义
// ====================================

/**
 * 聊天请求参数
 */
export interface ChatInput {
  /** 用户发送的消息内容 */
  message: string;
  /** 对话 ID（可选），用于保持对话上下文 */
  conversationId?: string;
}

/**
 * 聊天响应数据
 */
export interface ChatResponse {
  /** AI 生成的回复文本 */
  response: string;
  /** 对话 ID */
  conversationId: string;
  /** 时间戳（毫秒） */
  timestamp: number;
}

/**
 * GraphQL 聊天客户端类
 *
 * 封装 GraphQL 请求逻辑，提供类型安全的 API
 */
class GraphQLChatClient {
  /** GraphQL 客户端实例 */
  private client: GraphQLClient;

  /** API 端点 URL */
  private endpoint: string;

  /**
   * 构造函数
   *
   * @param endpoint - GraphQL API 端点 URL
   */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.client = new GraphQLClient(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 获取当前 API 端点
   *
   * @returns 当前使用的 GraphQL API 端点 URL
   */
  getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * 更新 API 端点
   *
   * 用于动态切换不同的后端服务
   *
   * @param endpoint - 新的 GraphQL API 端点 URL
   */
  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
    this.client = new GraphQLClient(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 测试 GraphQL 连接
   *
   * 发送一个简单的查询来验证服务是否可访问
   *
   * @returns 服务器返回的问候消息
   * @throws 连接失败时抛出错误
   */
  async testConnection(): Promise<string> {
    try {
      const data = await this.client.request<{ hello: string }>(HELLO_QUERY);
      return data.hello;
    } catch (error) {
      console.error('GraphQL connection test failed:', error);
      throw error;
    }
  }

  /**
   * 发送聊天消息
   *
   * 向 AI 发送用户消息并获取回复
   *
   * @param input - 聊天请求参数
   * @returns AI 的回复数据
   * @throws 请求失败时抛出错误
   *
   * @example
   * ```typescript
   * const response = await client.sendMessage({
   *   message: "你好",
   *   conversationId: "conv_123"
   * });
   * console.log(response.response); // AI 的回复
   * ```
   */
  async sendMessage(input: ChatInput): Promise<ChatResponse> {
    try {
      const data = await this.client.request<{ chat: ChatResponse }>(CHAT_MUTATION, {
        message: input.message,
        conversationId: input.conversationId,
      });
      return data.chat;
    } catch (error) {
      console.error('GraphQL chat mutation failed:', error);
      throw error;
    }
  }
}

// ====================================
// 端点配置
// ====================================

/**
 * 获取 GraphQL API 端点
 *
 * 根据环境自动选择合适的端点：
 * 1. 优先使用环境变量 VITE_GRAPHQL_ENDPOINT
 * 2. 生产环境使用 VITE_WORKERS_URL 或默认 Workers 地址
 * 3. 开发环境使用本地 Workers 地址
 *
 * @returns GraphQL API 端点 URL
 */
const getGraphQLEndpoint = (): string => {
  // 1. 从环境变量直接读取（最高优先级）
  if (import.meta.env.VITE_GRAPHQL_ENDPOINT) {
    return import.meta.env.VITE_GRAPHQL_ENDPOINT;
  }

  // 2. 生产环境配置
  if (import.meta.env.PROD) {
    // 如果配置了 Workers URL，使用完整 URL
    if (import.meta.env.VITE_WORKERS_URL) {
      return `${import.meta.env.VITE_WORKERS_URL}/graphql`;
    }
    // 默认使用生产环境的 Workers 地址
    return 'https://agent-workers.460229242.workers.dev/graphql';
  }

  // 3. 本地开发环境
  // 使用完整的本地 URL（通过 Vite 代理转发到 Workers 端口 8787）
  return `${window.location.origin}/graphql`;
};

// ====================================
// 导出
// ====================================

/**
 * GraphQL 客户端单例实例
 *
 * 在应用启动时创建，整个应用共享同一个实例
 */
export const graphqlClient = new GraphQLChatClient(getGraphQLEndpoint());

/**
 * 发送 GraphQL 消息的便捷函数
 *
 * @param input - 聊天请求参数
 * @returns AI 回复数据
 *
 * @example
 * ```typescript
 * const response = await sendGraphQLMessage({
 *   message: "你好",
 *   conversationId: "conv_123"
 * });
 * ```
 */
export const sendGraphQLMessage = (input: ChatInput): Promise<ChatResponse> =>
  graphqlClient.sendMessage(input);

/**
 * 测试 GraphQL 连接的便捷函数
 *
 * @returns 服务器状态消息
 */
export const testGraphQLConnection = (): Promise<string> =>
  graphqlClient.testConnection();

/**
 * 动态设置 GraphQL 端点的便捷函数
 *
 * @param endpoint - 新的 API 端点 URL
 */
export const setGraphQLEndpoint = (endpoint: string): void =>
  graphqlClient.setEndpoint(endpoint);
