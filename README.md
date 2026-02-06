# Workout Tracker

A React and TypeScript frontend for tracking workouts, exercises, and training progress. Built as my graduation project for the Full Stack Web Development Bootcamp at Coding Factory (Athens University of Economics and Business).

## What This Does

I built this to provide an intuitive interface for the Workout Tracker API. The application lets me view my training history on a calendar, create custom exercises organized by muscle groups, and log workouts with detailed sets including weight, reps, and notes.

The application demonstrates a modern frontend implementation with JWT authentication, React Query for server state management, and component-based architecture following React best practices.

## Tech Stack

- **React 19** - Latest version with modern hooks and concurrent features
- **TypeScript 5.9** - Type safety across the entire application
- **Vite 7** - Fast build tool with HMR for rapid development
- **TanStack Query** - Server state management with automatic caching
- **React Router 7** - Client-side routing with protected routes
- **Tailwind CSS 4** - Utility-first styling with shadcn/ui components
- **React Hook Form + Zod** - Form handling with schema validation
- **Axios** - HTTP client with interceptors for authentication

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- Workout Tracker API running (see backend [README.md](https://github.com/LamprosVasilakos/workout-tracker-backend/blob/main/README.md))

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd workout-tracker-ui
```

2. Install dependencies

```bash
npm install
```

3. Configure API endpoint

Update the base URL in `src/services/api.ts` if needed (default: `http://localhost:8080/api/v1.0`)

4. Run the application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How It Works

The application follows a component-based architecture with clear separation of concerns:

- **Pages** handle routes and orchestrate data fetching
- **Components** contain UI logic and can be reused across pages
- **Services** encapsulate all API calls using a centralized axios instance
- **Hooks** provide reusable stateful logic (authentication, custom behaviors)
- **Context** manages global state like authentication
- **Schemas** define TypeScript types and Zod validation schemas

Authentication uses JWT tokens stored in localStorage. Axios interceptors automatically attach tokens to requests and handle 401 errors by logging out users.

TanStack Query manages all server state with automatic caching, background refetching, and optimistic updates. Forms use React Hook Form with Zod schemas for validation before submission.

## Features

- Interactive calendar with workout history visualization
- Create and manage custom exercises by muscle group
- Log workouts with multiple exercises and detailed set tracking
- Support for warm-up and working set types
- Filter and search exercises
- JWT-based authentication with protected routes
- Responsive design for mobile and desktop

## Future Ideas

- Add PWA support for offline access
- Implement progress charts showing weight and volume trends
- Create workout templates for common routines
- Add social features to share workouts
- Integrate exercise video demonstrations
- Support dark mode
- Export workout history to CSV/PDF

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui base components
│   └── ...          # Feature-specific components
├── pages/           # Route/page components
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── services/        # API service layer
├── schemas/         # Zod schemas & TypeScript types
└── lib/             # Utility functions
```

## Author

**Lampros Vasilakos**  
[GitHub Profile](https://github.com/lamprosvasilakos)

**Graduation Project - Full Stack Web Development Bootcamp**  
Coding Factory | Athens University of Economics and Business

This project demonstrates frontend development skills using React, TypeScript, and modern state management patterns.
