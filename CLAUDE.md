# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Spaces is a vacation rental platform MVP built with Next.js 16. It uses AI (OpenAI) to generate property listing descriptions and supports host/guest user roles with property management features.

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
- **Database**: PostgreSQL via Prisma ORM (Supabase)
- **Auth**: NextAuth v5 (beta) with credentials provider and JWT sessions
- **Payments**: Stripe Checkout with webhooks
- **Images**: Cloudinary for image uploads
- **UI**: shadcn/ui components (Radix UI + Tailwind CSS)
- **AI**: Google Gemini API (gemini-1.5-flash) for listing generation

### Key Files
- `auth.ts` - NextAuth configuration with Prisma adapter and credentials provider
- `lib/db.ts` - Prisma client singleton
- `lib/stripe.ts` - Stripe client and pricing utilities
- `prisma/schema.prisma` - Database schema (User, Listing, Booking, Payment models)

### Route Structure
- `app/` - Next.js App Router pages
  - `api/generate-listing/route.ts` - AI listing generation endpoint
  - `api/bookings/route.ts` - Booking CRUD endpoints
  - `api/checkout/route.ts` - Stripe checkout session creation
  - `api/webhooks/stripe/route.ts` - Stripe webhook handler
  - `api/upload/route.ts` - Cloudinary image upload
  - `api/auth/[...nextauth]/route.ts` - NextAuth API routes
  - `actions/` - Server actions (register, login, create-listing)
  - `host-dashboard/` - Protected host pages with sidebar layout
  - `guest-dashboard/` - Guest-facing pages
  - `booking/success|cancel` - Post-payment redirect pages

### Path Aliases
- `@/*` maps to project root (e.g., `@/lib/db`, `@/components/ui/button`)

### Components
- `components/ui/` - shadcn/ui primitives (don't modify directly)
- `components/` - App-specific components (forms, dashboards)

## Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` - PostgreSQL connection string (Supabase)
- `AUTH_SECRET` - NextAuth secret key
- `NEXT_PUBLIC_APP_URL` - App URL for redirects
- `GEMINI_API_KEY` - For AI listing generation (Google Gemini)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_UPLOAD_PRESET` - Cloudinary unsigned upload preset

## Data Flow

### Host Flow
1. Users register/login via server actions (`app/actions/login.ts`, `register.ts`)
2. Authenticated hosts create listings at `/host-dashboard/add-property`
3. The add-property page calls `/api/generate-listing` for AI-generated content
4. Images upload to Cloudinary via `/api/upload`
5. Listings saved via `createListing` server action

### Guest Booking Flow
1. Guests browse listings at `/search` with filters
2. Select dates and guests on `/listings/[id]`
3. POST to `/api/bookings` creates a pending booking
4. POST to `/api/checkout` creates Stripe checkout session
5. Stripe webhook confirms payment and updates booking status
6. Guest redirected to `/booking/success`

### Pricing
- 10% platform service fee on all bookings
- Hosts receive booking amount minus service fee

## Deployment (Vercel)

### Prerequisites
1. Vercel account linked to GitHub
2. Production database (Supabase PostgreSQL)
3. Stripe account with live keys
4. Cloudinary account (optional for MVP)

### Environment Variables for Production
Set these in Vercel project settings:
```
DATABASE_URL=<production-supabase-url>
AUTH_SECRET=<generate-new-secret-for-prod>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
OPENAI_API_KEY=<your-openai-key>
STRIPE_SECRET_KEY=<live-stripe-key>
STRIPE_PUBLISHABLE_KEY=<live-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<from-stripe-webhook-dashboard>
```

### Deployment Steps
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy
5. Configure Stripe webhook:
   - Endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`

### Post-Deployment
- Run `npx prisma db push` against production DB if schema changed
- Verify Stripe webhook is receiving events
- Test booking flow with Stripe test mode first
