import { setup } from '@css-render/vue3-ssr'

import type { NuxtApp } from '#app'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const { collect } = setup(nuxtApp.vueApp)

  nuxtApp.hook('app:mounted', () => {
    const meta = document.createElement('meta')
    meta.name = 'naive-ui-style'
    document.head.appendChild(meta)
  })

  if (process.server) {
    nuxtApp.hook('app:rendered', ({ ssrContext }: { ssrContext: any }) => {
      if (!ssrContext)
        return
      const originalRenderMeta = ssrContext.renderMeta
      ssrContext.renderMeta = () => {
        if (!originalRenderMeta) {
          return {
            headTags: collect(),
          }
        }
        const originalMeta = originalRenderMeta()
        if ('then' in originalMeta) {
          return originalMeta.then((resolvedOriginalMeta: any) => {
            return {
              ...resolvedOriginalMeta,
              headTags: resolvedOriginalMeta.headTags + collect(),
            }
          })
        }
        else {
          return {
            ...originalMeta,
            headTags: originalMeta.headTags + collect(),
          }
        }
      }
    })
  }
})
