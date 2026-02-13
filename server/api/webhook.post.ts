export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    console.log('Webhook received from Language Wire:', body)

    // Validate webhook signature (in production)
    // const signature = getHeader(event, 'x-languagewire-signature')
    // if (!validateSignature(signature, body)) {
    //   throw createError({ statusCode: 401, message: 'Invalid signature' })
    // }

    // Extract translation data
    const {
      job_id,
      status,
      translated_content,
      target_language,
      story_id,
      target_folder_id,
      initiated_by_user
    } = body

    // Check if translation is complete
    if (status === 'completed' && translated_content) {
      // Create new story in Storyblok with translated content
      const newStory = await createTranslatedStory({
        originalStoryId: story_id,
        translatedContent: translated_content,
        targetLanguage: target_language,
        targetFolderId: target_folder_id
      })

      if (newStory) {
        // Add comment to the new story
        await addCommentToStory({
          storyId: newStory.id,
          message: `Automatisk oversat fra Language Wire. Igangsat af @${initiated_by_user}`,
          userId: initiated_by_user
        })

        console.log(`Created translated story ${newStory.id} with comment`)

        return {
          success: true,
          message: 'Story created and comment added',
          story_id: newStory.id
        }
      }
    }

    return { success: true, message: 'Webhook processed' }

  } catch (error: any) {
    console.error('Webhook error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Webhook processing failed'
    })
  }
})

// Helper function to create translated story in Storyblok
async function createTranslatedStory(params: {
  originalStoryId: number
  translatedContent: any
  targetLanguage: string
  targetFolderId: number
}) {
  const config = useRuntimeConfig()

  // TODO: Implement actual Storyblok Management API call
  // This would use the Storyblok Management API to:
  // 1. Fetch original story metadata
  // 2. Create new story in target folder
  // 3. Set language to target_language
  // 4. Insert translated content

  console.log('Creating translated story:', params)

  // Simulate story creation
  return {
    id: Math.floor(Math.random() * 1000000),
    name: `Translated Story ${params.targetLanguage}`,
    slug: `translated-story-${params.targetLanguage}`,
    lang: params.targetLanguage
  }
}

// Helper function to add comment to story
async function addCommentToStory(params: {
  storyId: number
  message: string
  userId: string
}) {
  const config = useRuntimeConfig()

  // TODO: Implement actual Storyblok Management API call for comments
  // POST https://mapi.storyblok.com/v1/spaces/{space_id}/stories/{story_id}/comments

  console.log('Adding comment to story:', params)

  return {
    success: true,
    comment_id: Math.floor(Math.random() * 1000000)
  }
}
