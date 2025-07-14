<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SystemMessage',
  props: {
    className: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    action: {
      type: Object as () => {
        text: string
        onClick: (event: MouseEvent) => void
        once?: boolean
        disabled?: boolean
      },
      default: null,
    },
  },
  setup(props) {
    const isDisabled = ref(props.action?.disabled || false)

    const handleClick = (e: MouseEvent) => {
      if (props.action?.onClick) {
        props.action.onClick(e)
      }
      if (props.action?.once) {
        isDisabled.value = true
      }
    }

    return {
      isDisabled,
      handleClick,
    }
  },
})
</script>

<template>
  <div class="Message SystemMessage" :class="[className]">
    <div class="SystemMessage-inner">
      <span>{{ content }}</span>
      <Button
        v-if="action"
        variant="text"
        :disabled="isDisabled"
        @click="handleClick"
      >
        {{ action.text }}
      </Button>
    </div>
  </div>
</template>
