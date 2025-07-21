<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Think',
    inheritAttrs: false,
    props: {
        isDone: {
            type: Boolean,
            default: false,
        },
        thinkTime: {
            type: Number,
            default: 0,
        },
        text: {
            type: String,
            default: '',
        }
    },
    setup(props) {
        const show = ref(true);
        const handleClick = () => {
            show.value = !show.value;
        };

        const getText = computed(() => {
            if (props.isDone) {
                const time = props.thinkTime ? `（用时${props.thinkTime}秒）` : '';
                return `已深度思考${time}`;
            }
            return '思考中...';
        });

        return {
            show,
            handleClick,
            getText,
        }
    }
})
</script>

<template>
  <div class="Think" :data-collapsed="!show">
    <div class="Think-toggle" @click="handleClick">
      <span>{{ getText }}</span>
      <span class="Icon" type="chevron-up">
        {{ '>' }}
      </span>
    </div>
    <div class="Think-content" v-if="show">
      {{ text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.Think {
  &[data-collapsed='true'] {
    .Think-toggle .Icon {
      transform: rotate(-180deg);
    }
  }
}

.Think-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 7px 14px;
  margin-bottom: 12px;
  background: var(--color-fill-2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  .Icon {
    transition: transform 0.2s ease-in-out;
    font-size: var(--font-size-sm);
  }
}

.Think-content {
  margin: 12px 0;
  padding: 4px 0 4px 8px;
  border-left: 2px solid var(--color-line-1);
  color: var(--color-text-3);
  font-size: var(--font-size-sm);

  p {
    margin: 0;
  }
}

.ReactMarkdown {
  font-size: 16px;
  font-weight: 400;
  min-height: 24px;
  user-select: text;

  p {
    font-size: 16px;
    font-weight: 400;
  }
  ol,
  ul {
    list-style: revert;
    margin: revert;
    padding: revert;
  }
  blockquote {
    border-left: 2px solid #e5e5e5;
    color: #8b8b8b;
    font-size: 14px;
    margin: 1rem 0;
    padding: 0.25rem 0 0.25rem 0.5rem;

    p {
      font-size: 14px;
    }
  }
}
</style>
