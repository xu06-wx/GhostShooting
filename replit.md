# Ghost Shooter Game

## Overview

A React-based arcade-style ghost shooting game where players use arrow keys to shoot ghosts moving through three lanes. Players have 30 seconds to shoot as many ghosts as possible, with each successful hit increasing their score. The game features a clean, modern UI with dark aesthetics, audio feedback, and high score tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives for accessible, headless components
- **State Management**: Zustand with subscribeWithSelector middleware for reactive game state
- **3D Graphics**: React Three Fiber ecosystem (drei, postprocessing) for potential 3D enhancements

### Game Logic Architecture
- **Game State**: Centralized state management using Zustand stores
  - `useGhostGame`: Core game mechanics (ghosts, scoring, timer)
  - `useAudio`: Sound effects and music management
  - `useHighScore`: Persistent score tracking with localStorage
- **Game Flow**: Phase-based system (ready → playing → ended)
- **Input System**: Keyboard event handling for arrow key controls
- **Collision Detection**: Lane-based shooting system with immediate feedback

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database persistence
- **API Design**: RESTful endpoints with `/api` prefix for clear separation

### Data Storage Solutions
- **Database**: PostgreSQL configured via Neon Database serverless
- **ORM**: Drizzle with schema-first approach and automatic migrations
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Local Storage**: Browser localStorage for high scores and game preferences

### Authentication and Authorization
- **User Schema**: Basic username/password structure defined in Drizzle schema
- **Validation**: Zod schemas for runtime type checking and validation
- **Storage Interface**: CRUD operations abstracted for user management

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migration and schema management tools

### UI/UX Libraries
- **Radix UI**: Comprehensive set of accessible React components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Class Variance Authority**: Type-safe component variants

### Audio and Media
- **Web Audio API**: Native browser audio for sound effects
- **Asset Support**: GLTF/GLB models, MP3/OGG/WAV audio files via Vite

### Development Tools
- **Replit Integration**: Runtime error overlay for development
- **GLSL Shader Support**: For advanced visual effects
- **TypeScript**: Full type safety across frontend and backend

### Query and State Management
- **TanStack Query**: Server state management and caching
- **Zustand**: Lightweight state management with middleware support