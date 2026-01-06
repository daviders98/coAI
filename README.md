# Collaborative Notes App

A small collaborative notes app built with React, Vite, and TypeScript.
The focus of this project is clean component structure, predictable state,
and avoiding unnecessary complexity.

## Setup Instructions

### Prerequisites

- Node.js >= 18
- npm

### Install Dependencies

npm install

### Run the App

npm run dev

The app will be available at:
http://localhost:5173

### Run Tests

npm run test

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Vitest
- Testing Library

## Optimization Choices

### Vite

- Vite was chosen for fast dev server startup and HMR
- Minimal configuration with only required plugins

### Minimal Dependencies

- Only essential libraries were added
- No heavy state management or real-time frameworks
- Keeps bundle size small and code easier to reason about

### Memoization

- useMemo is used where derived data (e.g. filtered notes) would otherwise
  re-compute on every render
- Prevents unnecessary work during re-renders

### Layout Stability

- Note cards use flex layouts to ensure consistent bottom alignment
- Prevents layout shifting when notes have different content lengths

## State Management

- React Context Providers used for auth and notes
- Local state managed with useState
- Simple and explicit data flow

## Persistence

- Notes stored in localStorage
- No backend required to run the app
- Enables basic persistence across reloads

## Testing

- UI and behavior tested with Vitest + Testing Library
- Hooks and providers mocked for isolation
- Browser APIs mocked for jsdom compatibility

## Future Improvements

- Replace useState with useReducer for more complex state transitions
- Migrate providers to Zustand for simpler global state management
- Add a real backend (REST or WebSocket)
- Real-time collaboration with Redis or WebSockets
- Better conflict resolution for simultaneous edits
- User presence indicators

## Notes

This project intentionally avoids over-engineering and focuses on
clarity, maintainability, and correctness over feature completeness.
