<script setup lang="ts">
import type { MessageId, QuickReplyItemProps } from '@chatui-vue3/core'
import { Chat, MarkdownText, Think } from '@chatui-vue3/components'
import { useMessages, useQuickReplies } from '@chatui-vue3/core'
import { onMounted, ref } from 'vue'
import ModelSelector from '@/components/ModelSelector.vue'
import { useCardManager } from '@/composables/useCardManager'
import { useSiliconFlow } from '@/composables/useSiliconFlow'
import { siliconFlowService } from '@/services/siliconflowService'
import 'github-markdown-css/github-markdown.css'

// 初始化消息列表
const { messages, appendMsg, updateMsg } = useMessages([])
const { cardManager } = useCardManager()

cardManager.register('think', Think)
cardManager.register('markdown', MarkdownText)
// 初始化硅基流动AI服务
const { setModel } = useSiliconFlow()

// 当前选择的模型
const currentModel = ref('Qwen/QwQ-32B')

// 处理模型变更
function handleModelChange(modelId: string) {
  currentModel.value = modelId
  setModel(modelId)
}

const isTyping = ref(false)
const quickRepliesVisible = ref(true)

// 导航栏配置
const navbar = {
  title: '硅基流动AI对话',
  leftContent: {
    icon: 'chevron-left',
    onClick: () => {
      window.history.back()
    },
  },
}

// 处理发送消息
function handleSend(type: string, text: string) {
  if (type === 'text' && text.trim()) {
    // 添加用户消息
    appendMsg({
      type: 'text',
      content: { text },
      position: 'right',
    })

    // 显示机器人正在输入状态
    isTyping.value = true
    quickRepliesVisible.value = false

    // 创建一个空的AI回复消息
    const baseTextMsg = {
      type: 'markdown',
      content: { text: '', class: 'markdown-body' },
    }
    const baseThinkMsg = {
      type: 'think',
      content: { text: '' },
    }
    let textMsgId: MessageId | null = null
    let thinkMsgId: MessageId | null = null
    siliconFlowService
      .sendMessageStream(text, ({ content, reasoningContent }) => {
        if (content) {
          if (!textMsgId) {
            textMsgId = appendMsg(baseTextMsg)
          }
          baseTextMsg.content.text += content
          updateMsg(textMsgId!, baseTextMsg)
        }
        else if (reasoningContent) {
          if (!thinkMsgId) {
            thinkMsgId = appendMsg(baseThinkMsg)
          }
          baseThinkMsg.content.text += reasoningContent
          updateMsg(thinkMsgId!, baseThinkMsg)
        }
      })
      .catch((err) => {
        // 处理错误情况
        console.error('AI回复出错:', err)
        appendMsg({
          type: 'text',
          content: { text: `抱歉，AI回复出现错误: ${err instanceof Error ? err.message : '未知错误'}` },
        })
      })
      .finally(() => {
        // 处理完成后的操作
        isTyping.value = false

        // 重新显示快捷回复
        setTimeout(() => {
          quickRepliesVisible.value = true
        }, 1000)
      })
  }
}

// 初始化快捷回复
const { quickReplies } = useQuickReplies([
  { name: '你好' },
  { name: '介绍一下自己' },
  { name: '你能做什么?' },
  { name: '帮我写一段Vue3代码', isNew: true },
  { name: '解释一下硅基流动API', isNew: true },
])

function handleQuickReplyClick(item: QuickReplyItemProps) {
  handleSend('text', item.name)
  quickRepliesVisible.value = false
}

// 添加欢迎消息
onMounted(() => {
  setTimeout(() => {
    appendMsg({
      type: 'text',
      content: { text: '👋 你好，我是基于硅基流动API的智能助理，有什么可以帮助你的吗？' },
      createdAt: Date.now(),
      user: {
        avatar: 'https://gw.alicdn.com/imgextra/i2/O1CN01fPEB9P1ylYWgaDuVR_!!6000000006619-0-tps-132-132.jpg',
      },
    })

    setTimeout(() => {
      appendMsg({
        type: 'text',
        content: { text: '你可以点击下方的快捷回复，或者直接输入消息与我交流。我使用的是硅基流动平台的AI能力。' },
        createdAt: Date.now(),
      })
    }, 1000)
  }, 500)
})
</script>

<template>
  <div>
    <Chat
      class="chatui"
      :messages="messages"
      :is-typing="isTyping"
      :navbar="navbar"
      :quick-replies="quickReplies"
      :quick-replies-visible="quickRepliesVisible"
      @send="handleSend"
      @quick-reply-click="handleQuickReplyClick"
    >
      <template #messageContent="{ message }">
        <component :is="cardManager.use(message.type)" v-bind="message.content" />
      </template>

      <template #navbarActions>
        <ModelSelector v-model:model-id="currentModel" @change="handleModelChange" />
      </template>
    </Chat>
  </div>
</template>

<style lang="scss" scoped>
.chatui {
  :deep() {
    .MessageContainer {
      background: #fff;
    }
    .ChatFooter {
      background: #fff;
    }
  }
}
</style>

<style lang="scss">
/**
 * 变量定义
 * 包含颜色、字体、间距等基础变量
 */

:root {
  // Brand 品牌色
  --brand-1: #ff6200;
  --brand-1-rgb: 255, 98, 0;
  --brand-2: #ffb300;
  --brand-2-rgb: 255, 179, 0;
  --brand-3: #ffe0cc;
  --brand-4: #ffefe5;
  --blue-50: #f0f7ff;

  // Text 文字色
  --gray-1: #000000;
  --gray-2: #333333;
  --gray-3: #666666;
  --gray-4: #999999;
  --gray-5: #cccccc;
  --gray-6: #e6e6e6;
  --gray-7: #f7f7f7;
  --white: #ffffff;

  // Fill 填充色
  --color-fill-1: var(--white);
  --color-fill-2: var(--gray-7);
  --color-mask: rgba(14, 17, 25, 0.5);
  --color-toast: rgba(17, 25, 45, 0.9);

  // Line 线条色
  --color-line-1: var(--gray-5);
  --color-line-2: var(--gray-4);

  // Functional 功能色
  --highlight-1: var(--brand-1);
  --highlight-2: var(--brand-2);
  --color-warning: #ff0300;
  --color-success: #1dbf1d;
  --color-link: #0080ff;
  --primary-color: var(--brand-1);

  // 尺寸
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;

  --shadow-1: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
  --shadow-2: 0 4px 10px 0 rgba(0, 0, 0, 0.08);
  --shadow-3: 0 8px 20px 0 rgba(0, 0, 0, 0.1);
  --shadow-focus: 0 0 0 3px var(--brand-4);

  // 间距
  --gutter: 20px;
  --msg-avatar-gap: 8px;
  --msg-gutter: 48px;
  --rate-width: 32px;
}

// 暗色模式
html[data-color-scheme='dark'] {
  --brand-3: #343b4d;
  --brand-4: #332b26;

  --gray-1: #f3f6f8;
  --gray-2: #cacfd7;
  --gray-3: #7c889c;
  --gray-4: #444c5a;
  --gray-5: rgba(204, 223, 255, 0.15);
  --gray-6: #2c3241;
  --gray-7: #1c222e;
  --white: #0e1119;

  --color-mask: rgba(14, 17, 25, 0.7);
  --color-toast: rgba(243, 246, 248, 0.9);

  --color-link: #409fff;
  --color-warning: #ff6666;
  --primary-color: #ff7e33;
}
</style>
