<script lang="ts">
import { defineComponent } from 'vue';
import { marked } from 'marked';

export default defineComponent({
  name: 'MarkdownText',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  computed: {
    processedMarkdown() {
      if (!this.text) return '';
      const res = marked.parse(this.text, {
        gfm: true,
        breaks: true,
      });
      console.log('res===', res)
      return res
    },
  },
});
</script>

<template>
  <div v-html="processedMarkdown" class="markdown-text" />
</template>


<style scoped>
.markdown-text {
  width: 100%;
}
</style>