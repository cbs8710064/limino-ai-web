import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import legacy from '@vitejs/plugin-legacy'
// https://vitejs.dev/config/
import { visualizer } from 'rollup-plugin-visualizer'

console.log('import.meta.env', process.env.NODE_ENV)
const isProd = process.env.NODE_ENV === 'production' ? true : false
export default defineConfig({
  base: '/',
  plugins: [
    legacy({
      targets: ['since 2013'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    }),
    vue(),
    vueJsx(),
    UnoCSS(),
    Components({
      resolvers: [
        // AntDesignVueResolver({
        //   importStyle: false
        // })
      ]
    }),
    // splitVendorChunkPlugin(),
    visualizer({
      emitFile: true,
      filename: 'stats.html'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    headers: {
      // 'Cross-Origin-Opener-Policy': 'same-origin',
      // 'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    proxy: {
      '/api': {
        // target: 'http://192.168.5.18:8000',
        target: 'http://116.236.41.244:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  esbuild: {
    drop: isProd ? ['console', 'debugger'] : []
  },
  build: {
    terserOptions: {
      compress: {
        // warnings: false,
        // drop_console: isProd ? true : false,
        // drop_debugger: isProd ? true : false,
        // pure_funcs: ['console.log','console.warn']
      },
      output: {
        // 去掉注释内容
        comments: true
      }
    },
    rollupOptions: {
      output: {
        // manualChunks(id, e) {
        // TODO 打包配置优化 console.log(id)
        //   if (id.includes('node_modules')) {
        //     return 'vendor'
        //   }
        // }
      }
    }
  },
  define: {}
})
