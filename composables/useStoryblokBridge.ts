import type { StoryblokStory, StoryblokSpace } from '~/types/storyblok'

export const useStoryblokBridge = () => {
  const currentStory = ref<StoryblokStory | null>(null)
  const currentSpace = ref<StoryblokSpace | null>(null)
  const isInitialized = ref(false)

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
        updateHeight()
      }
    })

    // Notify Storyblok that the tool is ready
    if (window.parent) {
      window.parent.postMessage({
        action: 'tool-ready'
      }, '*')
    }

    // Update height on content changes
    updateHeight()
  }

  const updateHeight = () => {
    if (typeof window === 'undefined') return

    // Wait for DOM to be ready
    nextTick(() => {
      const height = document.documentElement.scrollHeight

      // Send height to parent window
      if (window.parent) {
        window.parent.postMessage({
          action: 'tool-changed',
          height: height
        }, '*')
      }
    })
  }

  const getCurrentStory = () => currentStory.value
  const getCurrentSpace = () => currentSpace.value

  return {
    currentStory,
    currentSpace,
    isInitialized,
    initBridge,
    updateHeight,
    getCurrentStory,
    getCurrentSpace
  }
}
