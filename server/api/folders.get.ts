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
      console.warn('No Storyblok access token configured, returning mock data')
      return getMockFolders()
    }

    console.log('Fetching folders for space:', spaceId)

    // Fetch folders from Storyblok Management API
    const response = await fetch(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories?is_folder=1&per_page=100`,
      {
        headers: {
          'Authorization': accessToken
        }
      }
    )

    if (!response.ok) {
      console.error('Storyblok API error:', response.status, response.statusText)
      throw new Error(`Storyblok API returned ${response.status}`)
    }

    const data = await response.json()

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

    return folders

  } catch (error: any) {
    console.error('Error fetching folders:', error)

    // Fallback to mock data on error
    console.log('Returning mock data due to error')
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
