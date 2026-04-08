import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        quietDeps: true,
        api: 'legacy',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
