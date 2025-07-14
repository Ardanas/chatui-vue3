// packages/components/vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',       // 组件库入口
      name: 'MyComponentLib',      // 全局变量名（UMD 格式需要）
      formats: ['es']
    },
    rollupOptions: {
      // 确保外部化处理不想打包进库的依赖
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue' // 指明全局变量名
        }
      }
    }
  }
});