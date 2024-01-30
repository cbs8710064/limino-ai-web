import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import legacy from '@vitejs/plugin-legacy'
// https://vitejs.dev/config/
import { visualizer } from 'rollup-plugin-visualizer'
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
        // target: 'http://192.168.4.228:8000',
        target: 'http://116.236.41.244:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    terserOptions: {
      compress: {
        // warnings: false,
        // drop_console: true, //打包时删除console
        drop_debugger: true, //打包时删除 debugger
        pure_funcs: ['console.log']
      },
      output: {
        // 去掉注释内容
        comments: true
      }
    },
    rollupOptions: {
      output: {
        // manualChunks(id, e) {
        //   // TODO 打包配置优化 console.log(id)
        //   if (id.includes('node_modules')) {
        //     return 'vendor'
        //   }
        // }
      }
    }
  },
  define: {}
})
