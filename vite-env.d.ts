/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_URL: string
  readonly VITE_APP_PROJECT_ID: string
  readonly VITE_APP_CLIENT_KEY: string
  readonly VITE_APP_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
