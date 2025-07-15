<script lang="ts">
import type { MessageProps, QuickReplyItemProps } from '@chatui-vue3/core'
import { defineComponent, ref, watch } from 'vue'
import { Navbar } from '../navbar';
import { MessageContainer } from '../message-container';
import { Message } from '../message';
import { QuickReplies } from '../quick-replies';
import { Composer } from '../composer';

type NavbarProps = typeof Navbar
export default defineComponent({
  name: 'Chat',
  components: {
    Navbar,
    MessageContainer,
    Message,
    QuickReplies,
    Composer
  },
  props: {
    messages: {
      type: Array as () => MessageProps[],
      default: () => [],
    },
    text: {
      type: String,
      default: '',
    },
    textOnce: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入...',
    },
    isTyping: {
      type: Boolean,
      default: false,
    },
    navbar: {
      type: Object as () => NavbarProps,
      default: () => {},
    },
    quickReplies: {
      type: Array as () => QuickReplyItemProps[],
      default: () => [],
    },
    quickRepliesVisible: {
      type: Boolean,
      default: true,
    },
    inputType: {
      type: String,
      default: 'text',
    },
    colorScheme: {
      type: String,
      default: 'light',
      validator: (value: string) => ['light', 'dark', 'auto'].indexOf(value) !== -1,
    },
    elderMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'send',
    'inputFocus',
    'inputChange',
    'inputBlur',
    'inputTypeChange',
    'quickReplyClick',
    'quickReplyScroll',
    'scroll',
    'backBottomShow',
    'backBottomClick',
  ],
  setup(props, { emit }) {
    const messagesRef = ref<any>(null)
    const composerRef = ref<any>(null)
    const currentColorScheme = ref<'light' | 'dark'>('light')

    const handleInputFocus = (e: FocusEvent) => {
      if (messagesRef.value) {
        messagesRef.value.scrollToEnd({ animated: false, force: true })
      }
      emit('inputFocus', e)
    }

    const handleInputChange = (value: string, e: Event) => {
      emit('inputChange', value, e)
    }

    const handleInputBlur = (e: FocusEvent) => {
      emit('inputBlur', e)
    }

    const handleSend = (type: string, content: string) => {
      emit('send', type, content)
    }

    const handleInputTypeChange = (inputType: string) => {
      emit('inputTypeChange', inputType)
    }

    const handleQuickReplyClick = (item: QuickReplyItemProps, index: number) => {
      emit('quickReplyClick', item, index)
    }

    const onQuickReplyScroll = () => {
      emit('quickReplyScroll')
    }

    const onScroll = (e: Event) => {
      emit('scroll', e)
    }

    const onBackBottomShow = () => {
      emit('backBottomShow')
    }

    const onBackBottomClick = () => {
      emit('backBottomClick')
    }

    // 处理颜色模式
    watch(() => props.colorScheme, (newScheme) => {
      const updateColorScheme = (scheme: 'light' | 'dark') => {
        currentColorScheme.value = scheme
        document.documentElement.dataset.colorScheme = scheme
      }

      if (newScheme === 'auto') {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleColorSchemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
          updateColorScheme(e.matches ? 'dark' : 'light')
        }

        colorSchemeQuery.addEventListener('change', handleColorSchemeChange as any)
        handleColorSchemeChange(colorSchemeQuery)
      }
      else if (newScheme === 'dark') {
        updateColorScheme('dark')
      }
      else {
        updateColorScheme('light')
      }
    }, { immediate: true })

    return {
      messagesRef,
      composerRef,
      currentColorScheme,
      handleInputFocus,
      handleInputChange,
      handleInputBlur,
      handleSend,
      handleInputTypeChange,
      handleQuickReplyClick,
      onQuickReplyScroll,
      onScroll,
      onBackBottomShow,
      onBackBottomClick,
    }
  },
})
</script>

<template>
  <div
    class="ChatApp"
    :data-elder-mode="elderMode"
    :data-color-scheme="currentColorScheme"
  >
    <Navbar v-if="navbar" v-bind="navbar" :title="navbar.title || ''" />
    <slot v-else name="navbar" />

    <MessageContainer
      ref="messagesRef"
      :messages="messages"
      :is-typing="isTyping"
      @scroll="onScroll"
      @back-bottom-show="onBackBottomShow"
      @back-bottom-click="onBackBottomClick"
    >
      <template #before>
        <slot name="beforeMessageList" />
      </template>

      <Message
        v-for="msg in messages"
        :id="msg._id"
        :key="msg._id"
        :type="msg.type"
        :content="msg.content"
        :created-at="msg.createdAt"
        :user="msg.user"
        :position="msg.position"
        :has-time="msg.hasTime"
        :status="msg.status"
      >
        <slot name="messageContent" :message="msg" />
      </Message>
    </MessageContainer>

    <div class="ChatFooter">
      <QuickReplies
        v-if="quickReplies.length > 0"
        :items="quickReplies"
        :visible="quickRepliesVisible"
        @click="handleQuickReplyClick"
        @scroll="onQuickReplyScroll"
      />

      <Composer
        ref="composerRef"
        :initial-text="text"
        :text-once="textOnce"
        :placeholder="placeholder"
        :input-type="inputType"
        @focus="handleInputFocus"
        @change="handleInputChange"
        @blur="handleInputBlur"
        @send="handleSend"
        @input-type-change="handleInputTypeChange"
      />
    </div>
  </div>
</template>

<style lang="scss">
.ChatApp {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--gray-7);
  color: var(--gray-1);
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
}

.ChatFooter {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  width: 100%;
}
</style>
