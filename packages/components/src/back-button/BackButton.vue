<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'BackBottom',
  components: {
  },
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
  emits: ['click', 'didMount'],
  setup(props, { emit }) {
    const text = computed(() => {
      if (props.count === 0) {
        return '回到底部'
      }
      return props.count === 1
        ? '1 条新消息'
        : `${props.count} 条新消息`
    })

    const handleClick = () => {
      emit('click')
    }

    onMounted(() => {
      emit('didMount')
    })

    return {
      text,
      handleClick,
    }
  },
})
</script>

<template>
  <div class="BackBottom">
    <Button class="slide-in-right-item" @click="handleClick">
      {{ text }}
    </Button>
  </div>
</template>

<style lang="scss">
.BackBottom {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 10;

  .Btn {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .Icon {
    margin-left: 4px;
  }
}

.slide-in-right-item {
  animation: slide-in-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-in-right {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
