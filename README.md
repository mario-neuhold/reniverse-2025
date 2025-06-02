# Reniverse 2025

A web application celebrating the genre-defying music of Ren, featuring his music videos, community reactions, and curated playlists. Built with Nuxt 3, this platform allows fans to explore Ren's powerful narratives through an interactive community experience.

## Features

- **Music Videos**: Browse and watch Ren's music videos with embedded YouTube players
- **Community Reactions**: Discover reaction videos from various content creators
- **Channel Management**: Explore curated channels and playlists
- **YouTube Integration**: Import and manage YouTube playlists
- **Responsive Design**: Modern UI built with Nuxt UI Pro and TailwindCSS
- **Real-time Data**: Powered by Supabase for dynamic content management

## Tech Stack

- **Framework**: Nuxt 3
- **Database**: Supabase
- **Styling**: TailwindCSS & Nuxt UI Pro
- **State Management**: Pinia
- **Package Manager**: pnpm
- **API Integration**: YouTube Data API v3

## Setup

Make sure to install dependencies using pnpm (recommended):

```bash
# Install dependencies
pnpm install

# Alternative package managers
npm install
yarn install
bun install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Nuxt UI Pro License (only required for production deployment)
NUXT_UI_PRO_LICENSE=your_nuxt_ui_pro_license_key

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# YouTube API (for playlist imports)
YOUTUBE_API_KEY=your_youtube_api_key
```

> **Note**: The Nuxt UI Pro license is only required for production deployment. You can run the development server without it.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# Recommended
pnpm dev

# Alternative package managers
npm run dev
yarn dev
bun run dev
```

## Production

Build the application for production:

```bash
# Recommended
pnpm build

# Alternative package managers
npm run build
yarn build
bun run build
```

Locally preview production build:

```bash
# Recommended
pnpm preview

# Alternative package managers
npm run preview
yarn preview
bun run preview
```

## Scripts

```bash
# Development & Build
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm preview       # Preview production build
pnpm generate      # Generate static site

# Linting
pnpm lint          # Check for linting errors
pnpm lint:fix      # Fix linting errors automatically

# Database & Scripts
npx tsx scripts/seed.ts        # Run database seeding script
npx tsx scripts/<script>.ts    # Run any TypeScript script in scripts/ folder
```

## Project Structure

```
├── assets/           # Static assets and CSS
├── components/       # Vue components
│   ├── AppHeader.vue
│   ├── VideoCard.vue
│   ├── ReactionCard.vue
│   └── ImportPlaylist.vue
├── layouts/          # Nuxt layouts
├── pages/            # Application pages
│   ├── index.vue     # Homepage
│   └── channels/     # Channel-related pages
├── server/           # Server-side API routes
│   └── api/
│       └── youtube/  # YouTube API integration
├── stores/           # Pinia state management
│   ├── songs.ts
│   ├── reactions.ts
│   └── channels.ts
├── types/            # TypeScript type definitions
└── scripts/          # Database scripts and utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Supabase Documentation](https://supabase.com/docs)
- [Nuxt UI Pro Documentation](https://ui.nuxt.com/pro)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
