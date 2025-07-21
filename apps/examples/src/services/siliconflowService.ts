import { ref } from 'vue'

// 消息类型定义
export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// 对话历史类型
export interface ChatHistory {
  messages: Message[]
}

// 响应类型
export interface ChatResponse {
  id: string
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// 硅基流动API服务
export class SiliconFlowService {
  private apiKey: string
  private apiUrl: string
  private model: string
  private chatHistory: ChatHistory
  private isLoading = ref(false)
  private error = ref<string | null>(null)

  constructor({
    apiKey = import.meta.env.VITE_SILICON_CLOUD_API,
    apiUrl = 'https://api.siliconflow.cn/v1/chat/completions',
    model = 'Qwen/QwQ-32B',
  } = {}) {
    this.apiKey = apiKey
    this.apiUrl = apiUrl
    this.model = model
    this.chatHistory = { messages: [] }
  }

  /**
   * 添加消息到对话历史
   */
  public addMessage(message: Message): void {
    this.chatHistory.messages.push(message)
  }

  /**
   * 清空对话历史
   */
  public clearHistory(): void {
    this.chatHistory.messages = []
  }

  /**
   * 获取当前对话历史
   */
  public getHistory(): Message[] {
    return [...this.chatHistory.messages]
  }

  /**
   * 设置模型
   */
  public setModel(model: string): void {
    this.model = model
  }

  /**
   * 获取加载状态
   */
  public getLoadingState() {
    return { isLoading: this.isLoading, error: this.error }
  }

  /**
   * 发送消息到API并获取响应
   */
  public async sendMessage(text: string): Promise<string> {
    try {
      // 设置加载状态
      this.isLoading.value = true
      this.error.value = null

      // 添加用户消息到历史
      this.addMessage({ role: 'user', content: text })

      // 准备请求选项
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.chatHistory.messages,
        }),
      }

      // 发送请求
      const response = await fetch(this.apiUrl, options)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`)
      }

      const data: ChatResponse = await response.json()

      // 获取AI回复
      const aiMessage = data.choices[0]?.message

      if (!aiMessage) {
        throw new Error('API返回的响应格式不正确')
      }

      // 添加AI回复到历史
      this.addMessage({
        role: 'assistant',
        content: aiMessage.content,
      })

      return aiMessage.content
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息时出错'
      this.error.value = errorMessage
      throw err
    }
    finally {
      // 设置一个短暂的延迟，确保所有数据都已处理完毕
      setTimeout(() => {
        this.isLoading.value = false
      }, 100)
    }
  }

  /**
   * 发送消息到API并获取流式响应
   * @param text 用户消息
   * @param onChunk 接收到每个文本块时的回调函数
   */
  public async sendMessageStream(text: string, onChunk: (response: { content: string, reasoningContent?: string }) => void): Promise<string> {
    try {
      // 设置加载状态
      this.isLoading.value = true
      this.error.value = null

      // 添加用户消息到历史
      this.addMessage({ role: 'user', content: text })

      // 准备请求选项
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.chatHistory.messages,
          stream: true, // 启用流式响应
        }),
      }

      // 发送请求
      const response = await fetch(this.apiUrl, options)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('响应体为空')
      }

      // 处理流式响应
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let fullContent = ''

      // 使用异步方式处理流式数据
      const processStream = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            return
          }

          // 解码二进制数据为文本
          const chunk = decoder.decode(value, { stream: true })
          // 处理SSE格式的数据
          const lines = chunk.split('\n').filter(line => line.trim() !== '')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              // 检查是否是结束标记
              if (data === '[DONE]') {
                continue
              }

              try {
                const parsed = JSON.parse(data)
                // 提取内容
                const { content = '', reasoning_content: reasoningContent = '' } = parsed.choices[0]?.delta || {}

                // 如果有任何内容要显示，调用回调函数
                if (content || reasoningContent) {
                  onChunk({
                    content,
                    reasoningContent,
                  })
                }
              }
              catch (e) {
                console.error('解析SSE数据出错:', e)
              }
            }
          }

          // 继续处理下一块数据
          processStream()
        }).catch((error) => {
          console.error('读取流数据出错:', error)
        })
      }

      // 开始处理流
      processStream()

      // 等待流处理完成
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading.value) {
            clearInterval(checkInterval)
            resolve()
          }
        }, 100)
      })

      // 添加AI回复到历史
      this.addMessage({
        role: 'assistant',
        content: fullContent,
      })

      return fullContent
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息时出错'
      this.error.value = errorMessage
      throw err
    }
    finally {
      this.isLoading.value = false
    }
  }
}

// 创建单例实例
export const siliconFlowService = new SiliconFlowService()
