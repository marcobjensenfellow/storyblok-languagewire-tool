<template>
  <div class="container">
    <div class="card">
      <h1>Language Wire Oversættelse</h1>

      <!-- Current Story Info -->
      <div v-if="currentStory" class="info-box">
        <div class="info-title">Nuværende side</div>
        <div>{{ currentStory.name }} ({{ currentStory.lang || 'default' }})</div>
      </div>

      <!-- Debug Info (only show if in development or if there's an issue) -->
      <div v-if="!currentSpace && !isLoadingFolders" class="info-box" style="background-color: #fff5f5; border-color: #feb2b2;">
        <div class="info-title" style="color: #c53030;">Debug Info</div>
        <div style="color: #c53030; font-size: 12px;">
          Space not loaded yet. Waiting for Storyblok to send space data...
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Target Language Selection -->
      <div class="form-group">
        <label for="target-language">Målsprog</label>
        <select
          id="target-language"
          v-model="selectedLanguage"
          :disabled="isTranslating"
        >
          <option value="">Vælg målsprog</option>
          <option
            v-for="lang in availableLanguages"
            :key="lang.code"
            :value="lang.code"
          >
            {{ lang.name }}
          </option>
        </select>
      </div>

      <!-- Target Folder Selection -->
      <div class="form-group">
        <label for="target-folder">Målmappe ({{ folders.length }} mapper)</label>
        <select
          id="target-folder"
          v-model="selectedFolder"
          :disabled="isTranslating || isLoadingFolders"
        >
          <option value="">{{ isLoadingFolders ? 'Henter mapper...' : 'Vælg mappe' }}</option>
          <option
            v-for="folder in folders"
            :key="folder.id"
            :value="folder.id"
          >
            {{ folder.name }}
          </option>
        </select>
      </div>

      <!-- Translate Button -->
      <button
        class="btn btn-primary"
        @click="handleTranslate"
        :disabled="!canTranslate || isTranslating"
      >
        <span v-if="isTranslating" class="loading"></span>
        {{ isTranslating ? 'Oversætter...' : 'Translate page' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoryblokFolder } from '~/types/storyblok'

const { currentStory, currentSpace, isInitialized, initBridge, updateHeight, cleanup } = useStoryblokBridge()

const selectedLanguage = ref('')
const selectedFolder = ref<number | ''>('')
const isTranslating = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const folders = ref<StoryblokFolder[]>([])
const isLoadingFolders = ref(false)

const availableLanguages = ref([
  { code: 'da', name: 'Dansk' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
])

const canTranslate = computed(() => {
  return selectedLanguage.value && selectedFolder.value && currentStory.value && !isTranslating.value
})

const handleTranslate = async () => {
  if (!canTranslate.value) return

  errorMessage.value = ''
  successMessage.value = ''
  isTranslating.value = true

  try {
    // Call API to initiate translation
    const response = await $fetch('/api/translate', {
      method: 'POST',
      body: {
        story_id: currentStory.value?.id,
        target_folder_id: selectedFolder.value,
        target_language: selectedLanguage.value,
        source_language: currentStory.value?.lang || 'default'
      }
    })

    if (response.success) {
      successMessage.value = `Oversættelsen er sendt til Language Wire!
        Job ID: ${response.translation_job_id}.
        Den nye side vil blive oprettet når oversættelsen er færdig.`

      // Reset form
      selectedLanguage.value = ''
      selectedFolder.value = ''

      // Update height after success message appears
      nextTick(() => updateHeight())
    } else {
      throw new Error(response.message || 'Oversættelsen fejlede')
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Der opstod en fejl under oversættelsen'
    console.error('Translation error:', error)

    // Update height after error message appears
    nextTick(() => updateHeight())
  } finally {
    isTranslating.value = false
  }
}

const fetchFolders = async () => {
  if (!currentSpace.value?.id) {
    console.log('No space ID available, cannot fetch folders')
    return
  }

  console.log('Fetching folders for space:', currentSpace.value.id)
  isLoadingFolders.value = true

  try {
    const response = await $fetch<StoryblokFolder[]>(`/api/folders?space_id=${currentSpace.value.id}`)
    folders.value = response
    console.log('Loaded folders:', response)
    console.log('Number of folders:', response.length)
    nextTick(() => updateHeight())
  } catch (error: any) {
    console.error('Error loading folders:', error)

    // Show user-friendly error
    if (error.statusCode === 401) {
      errorMessage.value = 'Access token mangler eller er ugyldig. Tjek Vercel environment variables.'
    } else {
      errorMessage.value = 'Kunne ikke hente mapper fra Storyblok. Bruger eksempel mapper.'
    }

    // Fallback to mock folders
    folders.value = [
      { id: 1, name: 'Home', slug: 'home', parent_id: null, is_folder: true },
      { id: 2, name: 'Produkter', slug: 'produkter', parent_id: null, is_folder: true },
      { id: 3, name: 'Om os', slug: 'om-os', parent_id: null, is_folder: true },
      { id: 4, name: 'Blog', slug: 'blog', parent_id: null, is_folder: true }
    ]
    console.log('Using fallback folders:', folders.value)
  } finally {
    isLoadingFolders.value = false
  }
}

onMounted(() => {
  initBridge()

  // Watch for space to be loaded, then fetch folders
  watch(() => currentSpace.value, (newSpace) => {
    if (newSpace?.id) {
      fetchFolders()
    }
  }, { immediate: true })

  // For development/testing without Storyblok
  if (import.meta.dev && !currentStory.value) {
    setTimeout(() => {
      currentStory.value = {
        id: 123456,
        name: 'Test Side',
        slug: 'test-side',
        content: {},
        full_slug: 'test-side',
        parent_id: null,
        lang: 'en'
      }
      currentSpace.value = {
        id: 288946579053471,
        name: 'Test Space',
        domain: 'test.storyblok.com',
        version: 1,
        language_codes: ['en', 'da']
      }
      updateHeight()
    }, 500)
  }

  // Watch for content changes and update height
  watch([errorMessage, successMessage], () => {
    nextTick(() => updateHeight())
  })
})

onUnmounted(() => {
  cleanup()
})
</script>
