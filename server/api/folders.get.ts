import type { StoryblokFolder } from '~/types/storyblok'

export default defineEventHandler(async (event): Promise<StoryblokFolder[]> => {
  try {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const spaceId = query.space_id

    if (!spaceId) {
      throw createError({
        statusCode: 400,
        message: 'space_id er påkrævet'
      })
    }

    // TODO: Implement actual Storyblok Management API call
    // GET https://mapi.storyblok.com/v1/spaces/{space_id}/stories
    // with params: { is_folder: 1 }

    console.log('Fetching folders for space:', spaceId)

    // For prototype, return mock data
    const mockFolders: StoryblokFolder[] = [
      { id: 1, name: 'Home', slug: 'home', parent_id: null, is_folder: true },
      { id: 2, name: 'Produkter', slug: 'produkter', parent_id: null, is_folder: true },
      { id: 3, name: 'Om os', slug: 'om-os', parent_id: null, is_folder: true },
      { id: 4, name: 'Blog', slug: 'blog', parent_id: null, is_folder: true },
      { id: 5, name: 'Nyheder', slug: 'nyheder', parent_id: 4, is_folder: true }
    ]

    return mockFolders

  } catch (error: any) {
    console.error('Error fetching folders:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Kunne ikke hente mapper'
    })
  }
})
