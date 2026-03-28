# Session Timeout

## Config
These values are configurable via env and have safe defaults:

- `VITE_INACTIVITY_TIMEOUT_MS` (default: `300000` = 5 minutes)
- `VITE_WARNING_BEFORE_EXPIRY_MS` (default: `120000` = 2 minutes)
- `VITE_CHECK_INTERVAL_MS` (default: `15000` = 15 seconds)

Implementation source:
- `src/modules/system/session/session-timeout-manager.ts`

## Event Flow
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

## Centralized Logout
All logout paths use one cleanup function:
- `src/modules/system/session/centralized-logout.ts`

Cleanup includes:
- Clear auth token/cookies + auth store
- Stop timeout manager
- Clear React Query cache
- Broadcast logout event (when local)
- Redirect to `/login` once

## Manual Test Checklist
- [ ] Login and remain idle for just over `INACTIVITY_TIMEOUT_MS` -> auto logout occurs.
- [ ] Warning appears around `WARNING_BEFORE_EXPIRY_MS` before timeout.
- [ ] Countdown updates every second in warning modal.
- [ ] Click `Stay logged in` -> modal closes and timeout is extended.
- [ ] Let warning reappear again -> repeated extension still works.
- [ ] Click `Logout now` -> immediate logout + redirect.
- [ ] Trigger 401/403 from protected API -> centralized logout runs and redirects once.
- [ ] Open two authenticated tabs; logout in one tab -> other tab logs out automatically.
- [ ] After logout, no stale authenticated data remains visible (queries/state cleared).
