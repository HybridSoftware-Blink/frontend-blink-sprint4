import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { authService } from '../services/auth.service';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Registro',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
];

/**
 * Crear instancia del router
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * Guard global de navegación
 * Protege las rutas que requieren autenticación
 */
router.beforeEach((to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const requiresAuth = to.meta.requiresAuth;

  // Actualizar título de la página
  document.title = `${to.meta.title || 'Blink'} | Blink`;

  // Si la ruta requiere autenticación
  if (requiresAuth && !isAuthenticated) {
    // Redirigir al login
    next({ name: 'Login' });
    return;
  }

  // Si está autenticado e intenta acceder al login
  if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    // Redirigir al dashboard
    next({ name: 'Dashboard' });
    return;
  }

  // Permitir navegación
  next();
});

export default router;
