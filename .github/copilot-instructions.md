# Reniverse 2025 - AI Coding Agent Guide

## Project Overview
Reniverse is a fan platform celebrating the music of Ren, featuring music videos, community reactions, and curated playlists. The app enables fans to explore Ren's music through an interactive community experience.

## Architecture

### Core Technologies
- **Nuxt 3**: Vue-based framework for front-end and API routes
- **Supabase**: Database and authentication provider
- **Pinia**: State management
- **TailwindCSS & Nuxt UI Pro**: UI components and styling
- **TypeScript**: Type safety throughout the codebase

### Data Flow
1. **Stores**: Pinia stores (`/stores/*.ts`) manage state and Supabase interactions
2. **Components**: Vue components consume store data and handle UI interactions
3. **API Routes**: Server routes (`/server/api/*`) handle external API integrations
4. **Database**: Supabase tables for channels, songs, and reactions

### Key Components
- **VideoCard.vue/ReactionCard.vue**: Display video content from YouTube
- **ImportPlaylist.vue**: Handles YouTube playlist imports
- **AppHeader.vue**: Main navigation component

## Development Workflow

### Environment Setup
Required environment variables in `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
YOUTUBE_API_KEY=your_youtube_api_key
NUXT_UI_PRO_LICENSE=your_nuxt_ui_pro_license_key (production only)
```

### Commands
```bash
pnpm install         # Install dependencies
pnpm dev             # Start dev server
pnpm test            # Run unit tests (Vitest)
pnpm test:e2e        # Run e2e tests (Playwright)
npx tsx scripts/seed.ts  # Seed the database
```

## Testing Approach
- **Unit Tests**: Focus on component functionality, not styling
- **E2E Tests**: Test user flows with Playwright
- **Visual Testing**: Use Storybook for visual tests (planned future addition)

## Patterns & Conventions

### Store Pattern
Stores follow this structure:
```typescript
export const useSomeStore = defineStore('storeName', {
  state: () => ({}),
  getters: {},
  actions: {
    async fetchData() {
      const supabase = useSupabaseClient<Database>()
      // Data fetching pattern...
    }
  }
})
```

### Component Props Pattern
Components use TypeScript interfaces for props:
```typescript
interface Props {
  title: string
  description: string
  icon: string
}

defineProps<Props>()
```

### API Integration Pattern
Server routes handle external API calls to avoid exposing keys:
```typescript
// Example from server/api/youtube/playlist/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Process and return data...
})
```

## Important Notes
- Supabase is disabled in tests to avoid configuration dependencies
- YouTube API integration requires valid API key for playlist imports
- Run seed script to populate initial data for local development

## Commit Conventions
This project follows the [Conventional Commits](https://www.conventionalcommits.org/) pattern:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Common Types
- `feat`: A new feature
- `fix`: A bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `chore`: Other changes that don't modify source or test files

### Examples
```bash
feat(channels): add filter by category feature
fix(auth): resolve login redirect issue
refactor(tests): focus on functionality over styling
docs(readme): update setup instructions
```
