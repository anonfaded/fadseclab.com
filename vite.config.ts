import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'css-before-js',
      enforce: 'post',
      transformIndexHtml(html) {
        // Move CSS <link> before module <script> to prevent FOUC warning.
        // Vite places <script> before <link> by default, which causes
        // "Layout was forced before the page was fully loaded" in Firefox
        // because JS executes before stylesheets are applied.
        return html.replace(
          /(<script type="module"[^<]*<\/script>)\s*(<link rel="stylesheet"[^>]*>)/,
          '$2\n    $1',
        );
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
})
