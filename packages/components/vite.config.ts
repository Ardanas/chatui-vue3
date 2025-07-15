import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      outDir: ['build/es', 'build/lib'],
      tsconfigPath: './tsconfig.app.json'
    })
  ],
  build: {
    outDir: 'build',
    // cssCodeSplit: true,
    lib: {
      entry: 'src/index.ts',       // 组件库入口
      name: 'ChatUIVue3',      // 全局变量名（UMD 格式需要）
      fileName: (format) => `chat-ui-vue3.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理不想打包进库的依赖
      external: ['vue'],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          exports: "named",
          name: "ChatUIVue3",
          dir: './build/dist'
        },
        {
          format: "es",
          entryFileNames: "[name].js",
          exports: "named",
          preserveModules: true,
          preserveModulesRoot: 'src',
          dir: './build/es'
        },
        {
          format: "cjs",
          entryFileNames: "[name].js",
          exports: "named",
          preserveModules: true,
          preserveModulesRoot: 'src',
          dir: './build/lib'
        }
      ]
    }
  }
});