export interface StoryblokFolder {
  id: number
  name: string
  slug: string
  parent_id: number | null
  is_folder: boolean
}

export interface StoryblokStory {
  id: number
  name: string
  slug: string
  content: any
  full_slug: string
  parent_id: number | null
  lang: string
  default_lang_code?: string
}

export interface StoryblokSpace {
  id: number
  name: string
  domain: string
  version: number
  language_codes: string[]
}

export interface TranslationRequest {
  story_id: number
  target_folder_id: number
  target_language: string
  source_language: string
}

export interface TranslationResponse {
  success: boolean
  message: string
  new_story_id?: number
  translation_job_id?: string
}
