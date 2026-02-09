# Blink — Frontend (Vue 3 + Vite)

## Name and description

Blink is a modern web interface built with Vue 3 and Vite for managing users, authentication, and administrative data. It is designed as a decoupled frontend that consumes a REST API (for example, a Laravel backend). The goal is to provide a scalable, accessible, and easily extensible foundation for internal admin panels and dashboards.

## Features

- Authentication: sign in, sign up, and sign out with token management.
- User management: list, search, create, edit, and delete users.
- Dashboard with main views and key indicators.
- Settings panel for user and application configuration.
- Reusable components: buttons, cards, inputs, modals, and tables.
- Notification system (toasts) and centralized error handling.
- Form validation and UX feedback.

## Technologies

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Axios or fetch for API requests (configured in `src/shared/services/api.service.ts`)
- Modular, domain-based project structure (auth, users, dashboard, settings)

## Installation (development)

1. Clone the repository:

```bash
git clone <REPO_URL>
cd sprint4-blink
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Copy the example file and adjust the API URL:

```bash
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL
```

Example (development):

```
VITE_API_URL=/api
```

Or, if your backend runs locally:

```
VITE_API_URL=http://localhost:8001/api
```

4. Run in development mode:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Quick start

1. Open the app at the URL reported by Vite (default `http://localhost:5173`).
2. Sign up or sign in from the authentication screen.
3. Visit the Dashboard to view metrics and the Users module to manage records.
4. Use the Settings panel to change user preferences.

When signing in, the token is stored locally (for example in `localStorage`) and sent with requests as `Authorization: Bearer <token>`.

## Project structure

Summary of relevant folders and files:

- `index.html` — HTML entry.
- `src/main.ts` — application bootstrap.
- `src/App.vue` — root component.
- `src/style.css` — global styles (Tailwind configured in `tailwind.config.js`).
- `src/router/index.ts` — route definitions.
- `src/layouts/` — application layouts (AppLayout, Navbar, Sidebar).
- `src/components/base/` — base reusable components (BaseButton, BaseCard, BaseInput, BaseModal, BaseTable, BaseToast).
- `src/modules/` — domain folders:
  - `auth/` — routes, views, services and composables related to authentication.
  - `dashboard/` — main panel views.
  - `users/` — components (UserTable, UserForm), services and validators.
  - `settings/` — views and composables for settings.
- `src/shared/` — shared services (`api.service.ts`), composables (`useToast.ts`) and utilities.
- `public/` — static assets.

This structure makes it easy to work by domain and keep reusable components.
