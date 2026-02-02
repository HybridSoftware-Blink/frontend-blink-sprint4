## Blink (Frontend) — Vue 3 + Vite

### Conexión con el backend (Laravel)

Este frontend consume la API del backend en `/api/v1/...` (login, registro, etc.).

#### 1) Configurar la variable de entorno

Crea un fichero `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Configuración recomendada (dev):

```env
VITE_API_URL=/api
```

Esto funciona junto con el proxy de Vite (ya configurado) y evita problemas de CORS.

> Alternativa: si prefieres llamar directo al backend y tienes CORS bien configurado, puedes usar:
> `VITE_API_URL=http://localhost:8001/api`

#### 2) Levantar backend y frontend

- Backend: debe estar accesible en `http://localhost:8001` (según tu docker-compose del backend).
- Frontend:

```bash
npm install
npm run dev
```

#### 3) Endpoints que usa el frontend

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

El token se guarda en `localStorage` como `auth_token` y se envía automáticamente como:

`Authorization: Bearer <token>`
