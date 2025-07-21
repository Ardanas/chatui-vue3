<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RichText',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
});
</script>
<template>
  <div role="article" class="rich-text" v-html="content"></div>
</template>

<style scoped>
.rich-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
