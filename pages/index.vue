<template>
  <div class="container">
    <div class="card">
      <h1 style="margin-bottom: 20px; font-size: 24px;">Language Wire Oversættelse</h1>

      <!-- Current Story Info -->
      <div v-if="currentStory" class="info-box">
        <div class="info-title">Nuværende side</div>
        <div>{{ currentStory.name }} ({{ currentStory.lang || 'default' }})</div>
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
        <label for="target-folder">Målmappe</label>
        <select
          id="target-folder"
          v-model="selectedFolder"
          :disabled="isTranslating"
        >
          <option value="">Vælg mappe</option>
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

    <!-- Info Card -->
    <div class="card" style="font-size: 14px; color: #64748b;">
      <p><strong>Hvordan virker det?</strong></p>
      <p style="margin-top: 8px;">
        1. Vælg det sprog du vil oversætte til<br>
        2. Vælg hvilken mappe den nye oversatte side skal oprettes i<br>
        3. Klik på "Translate page" for at sende siden til Language Wire<br>
        4. Når oversættelsen er klar, oprettes en ny side automatisk med en kommentar
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoryblokFolder } from '~/types/storyblok'

const { currentStory, currentSpace, isInitialized, initBridge, updateHeight } = useStoryblokBridge()

const selectedLanguage = ref('')
const selectedFolder = ref<number | ''>('')
const isTranslating = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Mock data for prototype
const folders = ref<StoryblokFolder[]>([
  { id: 1, name: 'Home', slug: 'home', parent_id: null, is_folder: true },
  { id: 2, name: 'Produkter', slug: 'produkter', parent_id: null, is_folder: true },
  { id: 3, name: 'Om os', slug: 'om-os', parent_id: null, is_folder: true },
  { id: 4, name: 'Blog', slug: 'blog', parent_id: null, is_folder: true }
])

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

onMounted(() => {
  initBridge()

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
      updateHeight()
    }, 500)
  }

  // Watch for content changes and update height
  watch([errorMessage, successMessage], () => {
    nextTick(() => updateHeight())
  })
})
</script>
