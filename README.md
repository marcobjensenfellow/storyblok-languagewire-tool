# Storyblok Language Wire Translation Tool

En Storyblok Tool plugin prototype til automatisk oversættelse af sider via Language Wire.

## Funktioner

- 🌍 Vælg målsprog fra dropdown
- 📁 Vælg målmappe for den oversatte side
- 🚀 Send side til Language Wire med ét klik
- 💬 Automatisk kommentar på ny side når oversættelsen er færdig
- 👤 Nævner brugeren der igangsatte oversættelsen

## Setup

### 1. Installation

```bash
npm install
# eller
yarn install
# eller
pnpm install
```

### 2. Miljøvariabler

Kopier `.env.example` til `.env` og udfyld værdierne:

```bash
cp .env.example .env
```

Konfigurer følgende:

```env
# Storyblok OAuth
CLIENT_ID=din_storyblok_client_id
CLIENT_SECRET=din_storyblok_client_secret

# Base URL (brug ngrok til development)
BASE_URL=https://din-ngrok-url.ngrok.io

# Language Wire API (kommer senere)
LANGUAGE_WIRE_API_KEY=din_language_wire_api_key
LANGUAGE_WIRE_API_URL=https://api.languagewire.com
```

### 3. Storyblok App Konfiguration

1. Gå til [Storyblok Partner Portal](https://app.storyblok.com/#!/me/partner)
2. Opret en ny app
3. Vælg "Tool Plugin" som type
4. Konfigurer:
   - **Index URL**: `https://din-ngrok-url.ngrok.io/`
   - **Redirect URL**: `https://din-ngrok-url.ngrok.io/api/connect/callback`
   - **Scopes**: `read_content`, `write_content`, `manage_stories`
5. Aktiver "Use App Bridge" i settings

### 4. Development med ngrok

```bash
# Start ngrok i et separat terminal vindue
ngrok http 3000

# Opdater BASE_URL i .env med ngrok URL
# Start development server
npm run dev
```

## Arkitektur

### Frontend (`/pages/index.vue`)

- Vue 3 komponent med dropdown til sprog og mapper
- Storyblok Bridge integration for at få nuværende story
- "Translate page" knap der sender request til backend

### Backend API (`/server/api/`)

- **`translate.post.ts`**: Modtager oversættelsesanmodning og sender til Language Wire
- **`webhook.post.ts`**: Modtager callback fra Language Wire når oversættelse er færdig
- **`folders.get.ts`**: Henter liste af mapper fra Storyblok

### Types (`/types/storyblok.ts`)

TypeScript interfaces for Storyblok entities og API responses

## Workflow

1. Bruger åbner Tool plugin i Storyblok editor
2. Vælger målsprog og målmappe
3. Klikker "Translate page"
4. App sender story content til Language Wire API
5. Language Wire behandler oversættelsen
6. Når færdig, sender Language Wire webhook til `/api/webhook`
7. App opretter ny story i valgt mappe med oversat indhold
8. App tilføjer kommentar: "Automatisk oversat fra Language Wire. Igangsat af @brugernavn"

## Næste Steps (Production)

### Language Wire Integration

```typescript
// I translate.post.ts
const response = await fetch(config.languageWireApiUrl + '/translations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${config.languageWireApiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source_language: body.source_language,
    target_language: body.target_language,
    content: storyContent,
    callback_url: `${config.baseUrl}/api/webhook`
  })
})
```

### Storyblok Management API Integration

```typescript
// Hent mapper
const folders = await fetch(
  `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories?is_folder=1`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
)

// Opret story
await fetch(
  `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      story: {
        name: translatedName,
        slug: translatedSlug,
        content: translatedContent,
        parent_id: targetFolderId,
        lang: targetLanguage
      }
    })
  }
)

// Tilføj kommentar
await fetch(
  `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/${storyId}/comments`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comment: {
        content: `Automatisk oversat fra Language Wire. Igangsat af @${username}`
      }
    })
  }
)
```

## Udvikling

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Nuxt 3**: Vue-baseret framework til SSR og API routes
- **Vue 3**: UI framework
- **TypeScript**: Type safety
- **Storyblok Management API**: Story og folder management
- **Language Wire API**: Oversættelsesservice

## Licens

MIT

## Support

For spørgsmål eller support, kontakt udviklingsteamet.
