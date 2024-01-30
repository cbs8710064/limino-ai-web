// uno.config.ts
import { Preset, defineConfig, presetUno, presetIcons } from 'unocss'

import transformerDirectives from '@unocss/transformer-directives'
import { presetScrollbar } from 'unocss-preset-scrollbar'
const customPreset: Preset = {
  name: 'my-preset',
  rules: [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [/^right-(\d+)$/, ([_, val]) => ({ right: val + 'px' })],
    [/^w-(\d+)$/, ([, d]: any) => ({ width: `${d / 4}rem` })],
    [/^h-(\d+)$/, ([, d]: any) => ({ height: `${d / 4}rem` })],
    [/^rounded-(\d+)$/, ([, d]: any) => ({ 'border-radius': `${d / 4}rem` })]
  ]
}

export default defineConfig({
  content: {},
  safelist: 'w-100% rounded-3'.split(' '),
  transformers: [transformerDirectives()],
  // ...UnoCSS options
  presets: [
    presetUno(),
    customPreset,

    presetIcons({
      collections: {},
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    }),

    presetScrollbar({
      scrollbarThumbColor: 'var(--scrollbar-thumb-color)',
      scrollbarTrackColor: 'var(--scrollbar-track-color)'
    })
  ]
})
