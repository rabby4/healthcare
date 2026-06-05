# Medicare — Healthcare Frontend

Next.js web app for the Medicare telemedicine platform: patients find and book verified specialists, pay online, join video consultations, and receive digital prescriptions — with role-based dashboards for super admins, admins, doctors, and patients.

- **Live app:** https://medicare-ten-plus.vercel.app
- **API:** https://healthcare-server-eta.vercel.app/api/v1 ([repo folder: `healthcare-server`](../healthcare-server))

## Tech stack

| Layer        | Technology                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------ |
| Framework    | Next.js 16 (App Router, Turbopack) + React 19                                              |
| Language     | TypeScript                                                                                 |
| UI           | Material UI (`@mui/material`, `@mui/icons-material`, X Data Grid, X Date Pickers), Emotion |
| State / data | Redux Toolkit + RTK Query (tag-based cache invalidation)                                   |
| Forms        | React Hook Form + Zod resolvers                                                            |
| HTTP         | Axios instance with automatic access-token refresh                                         |
| Video calls  | Agora (`agora-react-uikit`)                                                                |
| Toasts       | Sonner                                                                                     |
| Dates        | Day.js                                                                                     |
| Hosting      | Vercel                                                                                     |

## Getting started

```bash
cd healthcare-frontend
npm install         # .npmrc sets legacy-peer-deps (agora-react-uikit pins React ≤18)
# create .env — see below
npm run dev         # http://localhost:3000
```

The backend must be running (locally on port 5000, or point the env var at the deployed API).

### Environment variables

| Variable                      | Purpose                                                                   |
| ----------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BACKEND_API_URL` | Backend base URL, e.g. `http://localhost:5000/api/v1` or the deployed API |
| `NEXT_PUBLIC_AGORA_APP_ID`    | Agora app ID for video consultations                                      |

Both are **baked in at build time** (`NEXT_PUBLIC_*`) — set them on Vercel _before_ building, and rebuild after changing them.

### Scripts

| Script          | What it does               |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server (Turbopack)     |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint                     |

## Roles & features

| Role            | Dashboard highlights                                                                                                                                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Super admin** | Everything an admin has, plus admin management (invite/block admins)                                                                                                                                                                                 |
| **Admin**       | Platform overview (live counts, appointment trend chart, **finance: gross fees / 15% commission / doctor payout**), manage doctors (create via modal — designation is picked from specialties), specialties, schedules, appointments, reviews, users |
| **Doctor**      | Day view + up-next queue, earnings split (**gross / commission deducted / net balance**), completed appointments, unique patients, reviews & rating, claimable schedule slots, video consultations, prescriptions                                    |
| **Patient**     | Find doctors, book & pay (SSLCommerz), appointment history, prescriptions, profile with health data, reviews                                                                                                                                         |

Public pages: landing, doctor search (`/doctors`), doctor profile, login/register, password reset, payment result, video call room.

All finance figures come from the backend `GET /meta` endpoint — the commission **rate** is configured server-side only and the UI renders whatever rate the API reports.

## Auth flow

1. `userLogin` (client) POSTs credentials to the backend → receives an `accessToken`; the backend also sets an httpOnly `refreshToken` cookie (`SameSite=None; Secure` in production, since the API is on another domain).
2. A server action (`setAccessToken`) stores the access token in an `accessToken` cookie on the frontend domain; it is also mirrored to localStorage for client-side role checks.
3. The login page then performs a **full-page navigation** to `/dashboard` so the route guard sees the fresh cookie.
4. `src/proxy.ts` (Next 16 middleware) guards routes: decodes/validates the JWT, clears stale cookies, enforces role-based access (`/dashboard/admins` → super admin only, `/dashboard/doctor/*` → doctor, etc.).
5. The Axios instance auto-refreshes: on 401 it calls `/auth/refresh-token` (sends the refresh cookie) and retries with the new access token.

## Project structure

```
src/
├── app/
│   ├── (withCommonLayout)/      # Public: landing, /doctors, /doctors/[id], video, payment
│   ├── (withDashboardLayout)/
│   │   └── dashboard/           # Role dashboards; _views/ = Overview, DoctorOverview, PatientOverview
│   ├── login/  register/        # Auth pages (react-hook-form + zod)
│   └── forgot-password/  reset-password/
├── proxy.ts                     # Route guard (middleware): JWT decode + role-based access
├── components/                  # AuthShell, dashboard shell (Sidebar/Topbar/Stat/…), UI sections
├── redux/
│   ├── store.ts  api/baseApi.ts # RTK Query base (axios base query)
│   └── api/*.ts                 # Feature APIs: auth, user, admin, doctor, patient, specialties,
│                                #   schedule, doctorSchedule, appointment, payment, prescription,
│                                #   review, meta — with tag invalidation
├── services/
│   ├── actions/                 # Server actions: userLogin, registerPatient, setAccessToken, logout
│   └── auth.services.ts         # Token storage/decode helpers
├── helpers/axios/               # Axios instance + base query (401 → refresh → retry)
├── constants/  types/  utils/   # authKey, tag types, shared types, payload helpers
└── assets/                      # SVGs, images
```

## Deployment (Vercel)

1. Create the Vercel project (framework auto-detected as Next.js).
2. Set `NEXT_PUBLIC_BACKEND_API_URL` and `NEXT_PUBLIC_AGORA_APP_ID` in Settings → Environment Variables.
3. Deploy: `npx vercel --prod`.
4. On the **backend** project, make sure `CORS_ORIGINS` and `FRONTEND_URL` include this app's production URL, then redeploy the backend.

Notes:

- `.npmrc` (`legacy-peer-deps=true`) is required for Vercel's `npm install` — `agora-react-uikit` declares React 16–18 peers while the app uses React 19.
- If login succeeds but the dashboard doesn't load, it's almost always `CORS_ORIGINS` on the backend or a stale build made before the env vars existed.
