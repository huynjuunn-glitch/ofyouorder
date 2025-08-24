# Overview

This is a Korean web application called "케이크 매니저" (Cake Manager) that manages cake orders by integrating with Google Sheets. The application allows users to fetch order data from Google Sheets, filter and search through orders, and view statistics about cake orders. It features a modern React frontend with TypeScript, shadcn/ui components, and Tailwind CSS for styling.

The application is designed for personal use with client-side Google Sheets API integration, featuring Korean language UI throughout. Users can authenticate with a simple email/password system stored in localStorage, configure Google Sheets API settings, and manage cake orders with date range filtering and statistical analysis.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application uses a modern React Single Page Application (SPA) architecture built with:

- **React 18** with functional components and hooks
- **TypeScript** for type safety and better development experience
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **Zustand** for global state management
- **React Query (@tanstack/react-query)** for data fetching and caching
- **React Hook Form** with Zod validation for form handling

## UI Component System

The frontend leverages **shadcn/ui** component library built on top of:
- **Radix UI** primitives for accessible, unstyled components
- **Tailwind CSS** for styling with custom CSS variables for theming
- **class-variance-authority** for component variant management
- **Lucide React** for consistent iconography
- **React Day Picker** for date range selection

## Authentication System

Simple localStorage-based authentication designed for personal use:
- User registration and login with email/password
- JWT-like token storage in localStorage with expiration
- Session persistence and automatic logout on token expiry
- No server-side authentication required

## Data Management

**Client-side Google Sheets Integration:**
- Direct API calls to Google Sheets API v4
- No server-side proxy or database required
- API key and sheet configuration stored in localStorage
- Real-time data fetching with error handling and validation

**State Management:**
- Zustand stores for authentication and orders management
- Filtered and searched data computed in real-time
- Statistics generation from order data
- Date range filtering with React Day Picker integration

## Server Architecture

**Express.js Backend** (minimal, primarily for development):
- Serves static files and provides API structure
- Vite integration for development hot reloading
- In-memory storage interface for potential future database integration
- Modular route structure ready for expansion

**Database Schema** (Drizzle ORM ready):
- PostgreSQL configuration with Drizzle ORM
- Schema definitions in shared directory
- Migration support configured but not actively used
- Neon Database integration configured

## Build and Deployment

**Development:**
- Vite dev server with HMR and error overlay
- TypeScript checking and path aliases
- Replit integration with development banner

**Production:**
- Static build output optimized for Vercel deployment
- Client directory as root for serverless deployment
- esbuild for server bundling when needed

# External Dependencies

## Google Services
- **Google Sheets API v4** - Primary data source for cake orders
- Requires API key configuration for client-side access
- Sheet sharing must be set to "Anyone with the link" for access

## Database Infrastructure
- **Neon Database** - PostgreSQL hosting (configured but not actively used)
- **Drizzle ORM** - Type-safe database operations
- Connection via `@neondatabase/serverless` driver

## UI and Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **Google Fonts** - Noto Sans KR for Korean text support

## Development Tools
- **TypeScript** - Type checking and development experience
- **Vite** - Build tool and development server
- **ESLint/Prettier** - Code formatting and linting (implied)
- **Replit** - Development environment integration

## Form and Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

## State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching

## Date Handling
- **react-day-picker** - Date range selection component
- **date-fns** - Date utility functions

## Build and Bundling
- **esbuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing