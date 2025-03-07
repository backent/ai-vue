import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
          }
        }
      }),
      vuetify({
        autoImport: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js'
      }
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    build: {
      chunkSizeWarningLimit: 1024 * 1024 // Set the limit to 1 MB
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue']
    },
    server: {
      proxy: {
        ['/api']: {
          target: 'http://localhost:8022',
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace("/api", '')
          },
        }
      }
    }
  }
});
