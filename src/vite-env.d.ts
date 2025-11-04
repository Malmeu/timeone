/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_PROJECT_ID: string
  // Plus d'autres variables d'environnement si nécessaire...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
