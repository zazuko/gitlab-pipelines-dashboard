// Keep this in sync with .env.local, public/config.js.template and public/index.html

interface AppConfig {
  gitlab: string
  oidcClientId: string
  publicUrl: string
  selectedTags: string
  sentryDsn: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  APP_CONFIG: AppConfig
}
