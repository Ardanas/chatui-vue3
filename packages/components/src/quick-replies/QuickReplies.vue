<script lang="ts">
import type { QuickReplyItemProps } from '@chatui-vue3/core'
import { defineComponent, ref, watch } from 'vue'
import QuickReply from './QuickReply.vue';

export default defineComponent({
  name: 'QuickReplies',
  props: {
    items: {
      type: Array as () => QuickReplyItemProps[],
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    QuickReply,
  },
  emits: ['click', 'scroll'],
  setup(props, { emit }) {
    const scrollerRef = ref<HTMLDivElement | null>(null)
    const enableScroll = ref(true)

    const handleClick = (item: QuickReplyItemProps, index: number) => {
      emit('click', item, index)
    }

    const handleScroll = (e: Event) => {
      if (enableScroll.value) {
        emit('scroll', e)
      }
    }

    // 当items变化时，重置滚动位置
    watch(() => props.items, () => {
      if (scrollerRef.value) {
        enableScroll.value = false
        scrollerRef.value.scrollLeft = 0

        // 延迟重新启用滚动事件
        setTimeout(() => {
          enableScroll.value = true
        }, 500)
      }
    })

    return {
      scrollerRef,
      handleClick,
      handleScroll,
    }
  },
})
</script>

<template>
  <div
    v-if="items.length"
    ref="scrollerRef"
    class="QuickReplies"
    :data-visible="visible"
    @scroll="handleScroll"
  >
    <div class="QuickReplies-inner">
      <QuickReply
        v-for="(item, index) in items"
        :key="item.name"
        :item="item"
        :index="index"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<style lang="scss">
.QuickReplies {
  padding: 10px 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  text-align: center;
  scroll-behavior: smooth;
  transition: height 0.3s ease-out;

  &[data-visible="false"] {
    height: 0;
    padding: 0;
    overflow: hidden;
  }

  &-inner {
    display: inline-block;
    padding: 0 10px;
  }
}
</style>
