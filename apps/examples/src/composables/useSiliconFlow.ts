import type { Message } from '@/services/siliconflowService'
import { computed, readonly, ref } from 'vue'
import { siliconFlowService } from '@/services/siliconflowService'

/**
 * 硅基流动AI对话Hook
 */
export function useSiliconFlow() {
  const { isLoading, error } = siliconFlowService.getLoadingState()
  const chatHistory = ref<Message[]>([])

  // 更新本地历史记录
  const updateLocalHistory = () => {
    chatHistory.value = siliconFlowService.getHistory()
  }

  // 发送消息并获取AI回复
  const sendMessage = async (message: string) => {
    try {
      const response = await siliconFlowService.sendMessage(message)
      updateLocalHistory()
      return response
    }
    catch (error) {
      console.error('发送消息出错:', error)
      throw error
    }
  }

  // 清空聊天历史
  const clearHistory = () => {
    siliconFlowService.clearHistory()
    updateLocalHistory()
  }

  // 设置模型
  const setModel = (modelId: string) => {
    siliconFlowService.setModel(modelId)
  }

  // 计算属性：最后一条消息
  const lastMessage = computed(() => {
    const messages = chatHistory.value
    return messages.length > 0 ? messages[messages.length - 1] : null
  })

  // 初始化时获取历史记录
  updateLocalHistory()

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    chatHistory,
    lastMessage,
    sendMessage,
    clearHistory,
    setModel,
  }
}
