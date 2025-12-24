# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Spaces AI is a vacation rental platform MVP built with Next.js 16. It uses AI (OpenAI) to generate property listing descriptions and supports host/guest user roles with property management features.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build (TypeScript errors are ignored via `next.config.mjs`)
- `npm run lint` - Run ESLint
- `npx prisma generate` - Regenerate Prisma client (runs automatically on `npm install`)
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio to browse data

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router (React 19)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth v5 (beta) with credentials provider and JWT sessions
- **UI**: shadcn/ui components (Radix UI + Tailwind CSS)
- **AI**: OpenAI API (gpt-3.5-turbo) for listing generation

### Key Files
- `auth.ts` - NextAuth configuration with Prisma adapter and credentials provider
- `lib/db.ts` - Prisma client singleton
- `prisma/schema.prisma` - Database schema (User, Account, Session, Listing models)

### Route Structure
- `app/` - Next.js App Router pages
  - `api/generate-listing/route.ts` - AI listing generation endpoint
  - `api/auth/[...nextauth]/route.ts` - NextAuth API routes
  - `actions/` - Server actions (register, login, create-listing)
  - `host-dashboard/` - Protected host pages with sidebar layout
  - `guest-dashboard/` - Guest-facing pages

### Path Aliases
- `@/*` maps to project root (e.g., `@/lib/db`, `@/components/ui/button`)

### Components
- `components/ui/` - shadcn/ui primitives (don't modify directly)
- `components/` - App-specific components (forms, dashboards)

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - For AI listing generation
- `AUTH_SECRET` - NextAuth secret key

## Data Flow

1. Users register/login via server actions (`app/actions/login.ts`, `register.ts`)
2. Authenticated hosts create listings at `/host-dashboard/add-property`
3. The add-property page can call `/api/generate-listing` to get AI-generated title, description, and suggested price
4. Listings are saved via `createListing` server action which associates them with the logged-in user's ID
