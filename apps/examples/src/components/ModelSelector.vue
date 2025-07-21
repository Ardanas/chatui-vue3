<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelId', value: string): void
  (e: 'change', value: string): void
}>()

// 可用模型列表
const models = [
  { id: 'Qwen/QwQ-32B', name: 'QwQ-32B' },
  { id: 'Qwen/Qwen3-30B-A3B', name: 'Qwen3-30B' },
  { id: 'Qwen/Qwen3-14B', name: 'Qwen3-14B' },
  { id: 'Qwen/Qwen3-8B', name: 'Qwen3-8B' },
  { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek-V3' },
  { id: 'Pro/deepseek-ai/DeepSeek-V3', name: 'DeepSeek-V3 Pro' },
  { id: 'moonshotai/Kimi-K2-Instruct', name: 'Kimi-K2' },
  { id: 'Pro/moonshotai/Kimi-K2-Instruct', name: 'Kimi-K2 Pro' },
  { id: 'baidu/ERNIE-4.5-300B-A47B', name: 'ERNIE-4.5' },
]

const selectedModel = ref(props.modelId || models[0].id)

watch(() => props.modelId, (newValue) => {
  if (newValue && newValue !== selectedModel.value) {
    selectedModel.value = newValue
  }
})

watch(selectedModel, (newValue) => {
  emit('update:modelId', newValue)
  emit('change', newValue)
})
</script>

<template>
  <div class="model-selector">
    <label for="model-select">AI模型:</label>
    <select
      id="model-select"
      v-model="selectedModel"
      class="model-select"
    >
      <option
        v-for="model in models"
        :key="model.id"
        :value="model.id"
      >
        {{ model.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  font-size: 14px;
}

.model-select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--gray-5, #e0e0e0);
  background-color: var(--white, #fff);
  font-size: 14px;
  max-width: 150px;
}
</style>
