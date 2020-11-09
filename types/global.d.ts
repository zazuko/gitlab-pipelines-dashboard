// Keep this in sync with .env.local, public/config.js.template and public/index.html

type AppConfig = {
  gitlab: string;
  oidcClientId: string;
  publicUrl: string;
}

interface Window {
  APP_CONFIG: AppConfig;
}
