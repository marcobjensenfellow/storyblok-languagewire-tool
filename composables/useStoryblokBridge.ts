import type { StoryblokStory, StoryblokSpace } from '~/types/storyblok'

export const useStoryblokBridge = () => {
  const currentStory = ref<StoryblokStory | null>(null)
  const currentSpace = ref<StoryblokSpace | null>(null)
  const isInitialized = ref(false)
  let resizeObserver: ResizeObserver | null = null

  const initBridge = () => {
    if (typeof window === 'undefined') return

    console.log('Initializing Storyblok bridge...')

    // Listen for ALL messages from Storyblok to debug
    window.addEventListener('message', (event) => {
      // Skip logging requestly messages to reduce spam
      if (event.data?.source === 'requestly:client') return
      console.log('Received message:', event.data)

      // Handle different message formats
      if (event.data.action === 'tool-init' || event.data.action === 'input') {
        // Store current story and space information
        currentStory.value = event.data.story || event.data.model
        currentSpace.value = event.data.space
        isInitialized.value = true

        console.log('Tool initialized with story:', currentStory.value)
        console.log('Space info:', currentSpace.value)

        // Update height after initialization
        setTimeout(() => updateHeight(), 100)
      }

      // Alternative: Try to extract space from story URL
      if (event.data.story && !currentSpace.value) {
        tryExtractSpaceFromUrl()
      }
    })

    // Notify Storyblok that the tool is ready (multiple formats)
    if (window.parent) {
      window.parent.postMessage({
        action: 'tool-ready'
      }, '*')

      window.parent.postMessage({
        type: 'loaded'
      }, '*')

      console.log('Sent ready messages to parent')
    }

    // Try to get space from URL as fallback
    tryExtractSpaceFromUrl()

    // Set up ResizeObserver to automatically update height
    setupResizeObserver()

    // Initial height update
    setTimeout(() => updateHeight(), 100)
  }

  const tryExtractSpaceFromUrl = () => {
    if (currentSpace.value) return // Already have space

    // Try to get space ID from query params or referrer
    const urlParams = new URLSearchParams(window.location.search)
    const spaceIdParam = urlParams.get('space_id')

    if (spaceIdParam) {
      console.log('Found space_id in URL:', spaceIdParam)
      currentSpace.value = {
        id: parseInt(spaceIdParam),
        name: 'Space',
        domain: '',
        version: 1,
        language_codes: []
      }
    } else if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
      // Try to extract from parent URL
      const parentUrl = window.location.ancestorOrigins[0]
      console.log('Parent URL:', parentUrl)
    } else {
      // Hardcode your space ID as last resort
      console.log('Using hardcoded space ID: 288946579053471')
      currentSpace.value = {
        id: 288946579053471,
        name: 'Fellow Space',
        domain: '',
        version: 1,
        language_codes: ['da', 'en']
      }
    }
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

    // console.log('Updating iframe height to:', height) // Disabled to reduce console spam

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
