import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // 讓前端程式碼可以在 build 時讀取到 process.env.API_KEY
      // 在 GitHub Actions 中，這會讀取 Secrets
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY)
    },
    base: './', // 確保在 GitHub Pages 子路徑下能正確載入資源
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});