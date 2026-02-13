import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  // Prevent navigation from opening in new window
  scrollBehavior() {
    return { top: 0 }
  }
}
