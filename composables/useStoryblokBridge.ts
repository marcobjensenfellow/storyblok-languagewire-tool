import type { StoryblokStory, StoryblokSpace } from '~/types/storyblok'

export const useStoryblokBridge = () => {
  const currentStory = ref<StoryblokStory | null>(null)
  const currentSpace = ref<StoryblokSpace | null>(null)
  const isInitialized = ref(false)
  let resizeObserver: ResizeObserver | null = null

  const initBridge = () => {
    if (typeof window === 'undefined') return

    // Listen for messages from Storyblok
    window.addEventListener('message', (event) => {
      if (event.data.action === 'tool-init') {
        // Store current story and space information
        currentStory.value = event.data.story
        currentSpace.value = event.data.space
        isInitialized.value = true

        console.log('Tool initialized with story:', event.data.story)
        console.log('Space info:', event.data.space)

        // Update height after initialization
        setTimeout(() => updateHeight(), 100)
      }
    })

    // Notify Storyblok that the tool is ready
    if (window.parent) {
      window.parent.postMessage({
        action: 'tool-ready'
      }, '*')
    }

    // Set up ResizeObserver to automatically update height
    setupResizeObserver()

    // Initial height update
    setTimeout(() => updateHeight(), 100)
  }

  const setupResizeObserver = () => {
    if (typeof window === 'undefined') return

    // Observe changes to document body size
    resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    // Start observing the body element
    if (document.body) {
      resizeObserver.observe(document.body)
    }
  }

  const updateHeight = () => {
    if (typeof window === 'undefined' || !window.parent) return

    // Calculate actual content height
    const body = document.body
    const html = document.documentElement

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    )

    console.log('Updating iframe height to:', height)

    // Try multiple message formats that Storyblok might use
    window.parent.postMessage({
      action: 'tool-changed',
      height: height
    }, '*')

    window.parent.postMessage({
      type: 'resize',
      height: height
    }, '*')

    window.parent.postMessage({
      event: 'resize-iframe',
      height: height
    }, '*')
  }

  const getCurrentStory = () => currentStory.value
  const getCurrentSpace = () => currentSpace.value

  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  return {
    currentStory,
    currentSpace,
    isInitialized,
    initBridge,
    updateHeight,
    cleanup,
    getCurrentStory,
    getCurrentSpace
  }
}
