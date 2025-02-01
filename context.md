# Happilee Codebase Context

## Overview
Happilee is a wedding planning application built with Next.js for the frontend and Express for the backend API. The application helps couples plan their wedding by managing vendors, budgets, timelines, and other wedding-related tasks.

## Directory Structure

### Frontend (Root Directory)

#### `/app` - Next.js App Router
- `/dashboard` - Main dashboard views for wedding planning
- `/login` - Authentication pages
- `/onboarding` - User onboarding flow
- `layout.tsx` - Root layout with common UI elements
- `error.tsx` - Global error handling
- `loading.tsx` - Loading states

#### `/components`
- `/assistant` - AI assistant related components
- `/auth` - Authentication components
- `/budget` - Budget management components
- `/contracts` - Contract management UI
- `/dashboard` - Dashboard specific components
- `/home` - Landing page components
- `/moodboard` - Wedding style and inspiration components
- `/tutorial` - Onboarding tutorial components
- `/ui` - Reusable UI components
- `/vendors` - Vendor management components

#### `/hooks`
Custom React hooks for:
- State management
- API interactions
- UI utilities
- Mobile responsiveness

#### `/lib`
Shared utilities and helpers:
- API client functions
- Authentication utilities
- Storage helpers
- Type definitions
- Constants

#### `/styles`
- Global styles
- Tailwind configurations
- Theme definitions

#### `/public`
Static assets:
- Images
- Fonts
- Icons
- Other media files

### Backend (`/api`)
Express.js backend service:
- RESTful API endpoints
- Authentication
- Database interactions
- Business logic

## Key Features

1. **Wedding Planning Dashboard**
   - Timeline management
   - Task tracking
   - Progress overview

2. **Vendor Management**
   - Vendor directory
   - Communication tools
   - Contract management

3. **Budget Tracking**
   - Expense categories
   - Payment tracking
   - Budget analytics

4. **Design & Inspiration**
   - Moodboards
   - Style guides
   - Color schemes

5. **Guest Management**
   - Guest list
   - RSVP tracking
   - Seating arrangements

## Technical Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- ShadcnUI Components

### Backend
- Express.js
- Node.js
- RESTful API

### Infrastructure
- Docker containerization
- Development and production configurations
- Hot reloading setup
- Environment-specific optimizations

## Development Patterns

1. **Component Organization**
   - Feature-based directory structure
   - Shared UI components in `/ui`
   - Page-specific components in feature directories

2. **State Management**
   - React hooks for local state
   - Custom hooks for shared logic
   - Context for global state

3. **Styling**
   - Tailwind for utility-first CSS
   - Component-specific styles when needed
   - Global styles for common elements

4. **API Integration**
   - Centralized API client
   - Type-safe API calls
   - Error handling middleware

## Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS setup
- `tsconfig.json` - TypeScript configuration
- `docker-compose.yml` - Production Docker setup
- `docker-compose.dev.yml` - Development Docker setup
- `Dockerfile` - Container build instructions 