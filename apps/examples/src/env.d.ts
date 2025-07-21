/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SILICON_CLOUD_API: string
  // 可以添加更多环境变量类型
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
