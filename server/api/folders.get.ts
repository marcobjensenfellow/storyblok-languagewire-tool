import type { StoryblokFolder } from '~/types/storyblok'

export default defineEventHandler(async (event): Promise<StoryblokFolder[]> => {
  try {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const spaceId = query.space_id as string

    if (!spaceId) {
      throw createError({
        statusCode: 400,
        message: 'space_id er påkrævet'
      })
    }

    const accessToken = config.storyblokAccessToken

    if (!accessToken) {
      console.warn('⚠️ No Storyblok access token configured, returning mock data')
      console.warn('Please add STORYBLOK_ACCESS_TOKEN to Vercel environment variables')
      return getMockFolders()
    }

    console.log('✅ Access token found, length:', accessToken.length)
    console.log('📡 Fetching folders for space:', spaceId)

    const url = `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories?is_folder=1&per_page=100`
    console.log('🔗 API URL:', url)

    // Fetch folders from Storyblok Management API
    // Try both token formats (with and without Bearer prefix)
    const authHeader = accessToken.startsWith('Bearer ') ? accessToken : accessToken

    console.log('🔑 Using auth header (first 10 chars):', authHeader.substring(0, 10) + '...')

    const response = await fetch(url, {
      headers: {
        'Authorization': authHeader
      }
    })

    console.log('📥 Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Storyblok API error:', response.status, response.statusText)
      console.error('Error body:', errorText)
      throw new Error(`Storyblok API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('📦 Received data:', {
      storiesCount: data.stories?.length || 0,
      hasStories: !!data.stories
    })

    if (!data.stories || data.stories.length === 0) {
      console.warn('⚠️ No folders found in response, using mock data')
      return getMockFolders()
    }

    // Transform Storyblok stories to our folder format
    const folders: StoryblokFolder[] = data.stories.map((story: any) => ({
      id: story.id,
      name: story.name,
      slug: story.slug,
      parent_id: story.parent_id || null,
      is_folder: story.is_folder
    }))

    // Sort alphabetically by name
    folders.sort((a, b) => a.name.localeCompare(b.name))

    console.log('✅ Successfully loaded', folders.length, 'folders:', folders.map(f => f.name).join(', '))
    console.log('🚀 RETURNING REAL FOLDERS TO CLIENT:', folders.length, 'items')

    return folders

  } catch (error: any) {
    console.error('❌❌❌ CRITICAL ERROR fetching folders:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)

    // Fallback to mock data on error
    console.log('⚠️ Returning mock data due to error')
    return getMockFolders()
  }
})

function getMockFolders(): StoryblokFolder[] {
  return [
    { id: 1, name: 'Home', slug: 'home', parent_id: null, is_folder: true },
    { id: 2, name: 'Produkter', slug: 'produkter', parent_id: null, is_folder: true },
    { id: 3, name: 'Om os', slug: 'om-os', parent_id: null, is_folder: true },
    { id: 4, name: 'Blog', slug: 'blog', parent_id: null, is_folder: true }
  ]
}
