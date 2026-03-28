# Lyncs Frontend

A production-focused URL shortener frontend built with React + TypeScript.

The app supports:

- Authentication (signup, login, OTP verification, forgot password, refresh/logout)
- URL shortening and dashboard management
- Redirect handling for short codes
- Analytics views
- Profile and session-aware UX

## Major Tools

### UI

- `react` + `react-dom`
- `react-router-dom` for routing
- `lucide-react` for iconography
- `@base-ui/react` and custom UI primitives in `src/components`
- `sonner` for toast notifications
- `recharts` for analytics charts
- `@tanstack/react-table` for table rendering

### Styling

- `tailwindcss` v4
- `tw-animate-css` for animation utilities
- Design tokens and theme variables in `src/index.css`
- Brand-focused component styling with reusable custom components

### Data Fetching + State

- `axios` for HTTP client + interceptors
- `@tanstack/react-query` for server state caching/invalidation
- `useSyncExternalStore`-based auth store (`src/store/auth-store.ts`) for client auth session state
- `zod` + `react-hook-form` + `@hookform/resolvers` for form validation and handling

## Architecture and Patterns

### Feature-first module structure

Code is organized by feature under `src/modules`:

- `auth`
- `urls`
- `analytics`
- `profile`
- `system`

Each feature usually contains:

- `components/` for UI
- `hooks/` for logic and side-effects
- `views/` for route-level composition
- `utils/` and `types/` for contracts/helpers

### Separation of concerns

- Route/view files are UI composition layers.
- Complex operations live in hooks.
- Shared cross-cutting behavior (session timeout, centralized logout, sync) lives in `src/modules/system`.
- API concerns are centralized in `src/services/api-service.ts`.

### Session/Auth pattern

- Cookie token handling lives in `src/lib/token.ts`.
- Auth store persists necessary auth metadata and exposes reactive state via `useSyncExternalStore`.
- API interceptors attach token, refresh on `401` once when possible, and use centralized logout for invalid sessions.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and set:

```env
VITE_API_BASE_URL=https://your-api-base-url
VITE_SHORT_URL_BASE=https://your-short-domain
VITE_SECRET_KEY=your-secret-key
VITE_INACTIVITY_TIMEOUT_MS=300000
VITE_WARNING_BEFORE_EXPIRY_MS=120000
VITE_CHECK_INTERVAL_MS=15000
```

Notes:

- If timeout envs are omitted, defaults are used.
- Do not commit real secrets.

### 3. Run locally

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

### 6. Lint

```bash
npm run lint
```

## Session Timeout

### Config

These values are configurable via env and have safe defaults:

- `VITE_INACTIVITY_TIMEOUT_MS` (default: `300000` = 5 minutes)
- `VITE_WARNING_BEFORE_EXPIRY_MS` (default: `120000` = 2 minutes)
- `VITE_CHECK_INTERVAL_MS` (default: `15000` = 15 seconds)

Implementation source:

- `src/modules/system/session/session-timeout-manager.ts`

### Event Flow

1. Authenticated layout mounts `SessionTimeoutProvider`.
2. Provider initializes `SessionTimeoutManager` and activity listeners:
   - `mousedown`, `mousemove`, `keydown`, `keypress`, `scroll`, `touchstart`, `click`
3. Near expiry, warning modal opens with live countdown.
4. User can:
   - `Stay logged in` -> extends session baseline.
   - `Logout now` -> runs centralized logout immediately.
5. On timeout, centralized logout runs automatically.
6. Logout is synchronized across tabs via:
   - `BroadcastChannel`
   - `storage` event fallback

### Centralized Logout

All logout paths use one cleanup function:

- `src/modules/system/session/centralized-logout.ts`

Cleanup includes:

- Clear auth token/cookies + auth store
- Stop timeout manager
- Clear React Query cache
- Broadcast logout event (when local)
- Redirect to `/login` once
