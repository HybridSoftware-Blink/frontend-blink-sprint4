# Blink — Frontend (Vue 3 + Vite)

## Nom i Descripció

Blink és una interfície web moderna desenvolupada amb Vue 3 i Vite per gestionar usuaris, autenticació i dades administratives. Està concebuda com a frontend desacoblat que consumeix una API REST (per exemple, un backend en Laravel). L'objectiu és proporcionar una base escalable, accessible i fàcilment extensible per a panells interns i dashboards administratius.

## Característiques

- Autenticació: inici de sessió, registre i tancament de sessió amb gestió de tokens.
- Gestió d'usuaris: llistat, cerca, creació, edició i eliminació d'usuaris.
- Dashboard amb vistes i indicadors principals.
- Panell d'ajustos per a la configuració de l'usuari i de l'aplicació.
- Components reutilitzables: botons, targetes, inputs, modals i taules.
- Sistema de notificacions (toasts) i gestió centralitzada d'errors.
- Validació de formularis i feedback per millorar l'experiència d'usuari.

## Tecnologies utilitzades

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Axios o fetch per a crides a l'API (configurat a `src/shared/services/api.service.ts`)
- Estructura modular per dominis (auth, users, dashboard, settings)

## Instal·lació (desenvolupament)

1. Clonar el repositori:

```bash
git clone <REPO_URL>
cd sprint4-blink
```

2. Instal·lar dependències:

```bash
npm install
```

3. Configurar variables d'entorn:

Copia el fitxer d'exemple i ajusta la URL de l'API:

```bash
cp .env.example .env.local
# Edita .env.local i estableix VITE_API_URL
```

Exemple (desenvolupament):

```
VITE_API_URL=/api
```

O, si el backend està en local:

```
VITE_API_URL=http://localhost:8001/api
```

4. Executar en mode desenvolupament:

```bash
npm run dev
```

5. Compilar per producció:

```bash
npm run build
```

## Ús ràpid

1. Obre l'aplicació a l'URL que indiqui Vite (per defecte `http://localhost:5173`).
2. Registra't o inicia sessió des de la pantalla d'autenticació.
3. Accedeix al Dashboard per veure mètriques i al mòdul d'Usuaris per administrar registres.
4. Utilitza el panell d'Ajustos per modificar preferències d'usuari.

Quan s'inicia sessió, el token s'emmagatzema localment (per exemple a `localStorage`) i s'envia a les peticions com `Authorization: Bearer <token>`.

## Estructura del projecte

Resum de carpetes i fitxers rellevants:

- `index.html` — entrada HTML.
- `src/main.ts` — arrencada de l'aplicació.
- `src/App.vue` — component arrel.
- `src/style.css` — estils globals (Tailwind configurat a `tailwind.config.js`).
- `src/router/index.ts` — definició de rutes.
- `src/layouts/` — layouts de l'aplicació (AppLayout, Navbar, Sidebar).
- `src/components/base/` — components base reutilitzables (BaseButton, BaseCard, BaseInput, BaseModal, BaseTable, BaseToast).
- `src/modules/` — carpetes per domini:
  - `auth/` — rutes, vistes, serveis i composables relacionats amb autenticació.
  - `dashboard/` — vistes del panell principal.
  - `users/` — components (UserTable, UserForm), serveis i validadors.
  - `settings/` — vistes i composables per a ajustos.
- `src/shared/` — serveis compartits (`api.service.ts`), composables (`useToast.ts`) i utilitats.
- `public/` — actius estàtics.

Aquesta estructura facilita treballar per dominis i mantenir components reutilitzables.
