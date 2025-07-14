<script setup lang="ts">
import type { QuickReplyItemProps } from '@/composables/useQuickReplies'
import { onMounted, reactive, ref } from 'vue'
import { useCardManager } from '@/composables/useCardManager'
import { useMessages } from '@/composables/useMessages'
import { useQuickReplies } from '@/composables/useQuickReplies'
// 初始化消息列表
const { messages, appendMsg } = useMessages([])
const { cardManager } = useCardManager()

const isTyping = ref(false)
const quickRepliesVisible = ref(true)

// 导航栏配置
const navbar = reactive({
  title: 'ChatUI Vue3 演示',
  leftContent: {
    icon: 'chevron-left',
    onClick: () => {
      window.history.back()
    },
  },
})

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

    // 模拟机器人回复
    setTimeout(() => {
      let replyText = ''

      if (text.includes('你好') || text.includes('嗨') || text.includes('hi')) {
        replyText = '你好！很高兴为你服务。有什么我可以帮助你的吗？'
      }
      else if (text.includes('介绍') || text.includes('自己')) {
        replyText = '我是 ChatUI Vue3 智能助理，基于阿里巴巴 ChatUI 的 Vue3 实现。我可以帮助你了解 ChatUI Vue3 的使用方法和特性。'
      }
      else if (text.includes('做什么') || text.includes('功能')) {
        replyText = 'ChatUI Vue3 提供了一系列用于构建对话式交互界面的组件，包括：\n\n• 对话容器\n• 消息气泡\n• 输入框\n• 快捷回复\n• 头像\n• 时间戳\n\n你可以使用这些组件快速构建聊天机器人、客服系统等应用。'
      }
      else if (text.includes('代码') || text.includes('示例')) {
        replyText = '以下是一个简单的示例代码：\n\n```vue\n<template>\n  <Chat\n    :messages="messages.value"\n    :isTyping="isTyping"\n    :navbar="navbar"\n    @send="handleSend"\n  >\n    <template #messageContent="{ message }">\n      <Bubble :content="message.content.text" />\n    </template>\n  </Chat>\n</template>\n```\n\n你可以在我们的文档中找到更多示例。'
      }
      else {
        replyText = `你发送了: "${text}"，但我不太理解你的意思。你可以尝试问我关于 ChatUI Vue3 的问题，或者使用下方的快捷回复。`
      }

      appendMsg({
        type: 'text',
        content: { text: replyText },
      })
      isTyping.value = false

      // 重新显示快捷回复
      setTimeout(() => {
        quickRepliesVisible.value = true
      }, 1000)
    }, 1000)
  }
}

// 初始化快捷回复
const { quickReplies } = useQuickReplies([
  { name: '你好' },
  { name: '介绍一下自己' },
  { name: '你能做什么?' },
  { name: '帮我写代码', isNew: true },
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
      content: { text: '👋 你好，我是 ChatUI Vue3 智能助理，有什么可以帮助你的吗？' },
      createdAt: Date.now(),
      user: {
        avatar: 'https://gw.alicdn.com/imgextra/i2/O1CN01fPEB9P1ylYWgaDuVR_!!6000000006619-0-tps-132-132.jpg',
      },
    })

    setTimeout(() => {
      appendMsg({
        type: 'text',
        content: { text: '你可以点击下方的快捷回复，或者直接输入消息与我交流。' },
        createdAt: Date.now(),
      })
    }, 1000)
  }, 500)
})
</script>

<template>
  <div>
    <Chat
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
    </Chat>
  </div>
</template>

<style scoped>
.demo-page {
  background-color: var(--gray-7);
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-header {
  background-color: var(--white);
  border-bottom: 1px solid var(--gray-6);
  padding: 30px 0;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--gray-1);
}

.page-description {
  font-size: 16px;
  color: var(--gray-3);
}

.chat-container {
  max-width: 600px;
  height: 500px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--gray-6);
}

.demo-instructions {
  max-width: 600px;
  margin: 30px auto 0;
  background-color: var(--white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.demo-instructions h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--gray-1);
}

.demo-instructions ul {
  padding-left: 20px;
  margin: 0;
}

.demo-instructions li {
  margin-bottom: 8px;
  color: var(--gray-2);
}

.keyword {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--brand-4);
  color: var(--brand-1);
  border-radius: 4px;
  margin: 0 2px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .chat-container {
    height: 70vh;
    margin: 0 15px;
  }

  .demo-instructions {
    margin: 30px 15px 0;
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
html[data-color-scheme="dark"] {
  --brand-3: #343B4D;
  --brand-4: #332B26;

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
