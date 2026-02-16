import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { authServiceMock as authService } from '../modules/auth/services/auth.service.mock';
import { authRoutes } from '../modules/auth/routes';
import { dashboardRoutes } from '../modules/dashboard/routes';
import { settingsRoutes } from '../modules/settings/routes';
import { usersRoutes } from '../modules/users/routes';
import { ticketsRoutes } from '../modules/tickets/routes';
import { vehiclesRoutes } from '../modules/vehicles/routes';
import { reservationsRoutes } from '../modules/reservations/routes';
import { mapRoutes } from '../modules/map/routes';
import { i18n } from '@/i18n';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  ...authRoutes,
  ...dashboardRoutes,
  ...settingsRoutes,
  ...usersRoutes,
  ...ticketsRoutes,
  ...vehiclesRoutes,
  ...reservationsRoutes,
  ...mapRoutes,
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
  const titleKey = to.meta.titleKey as string | undefined;
  const pageTitle = titleKey ? i18n.global.t(titleKey) : i18n.global.t('app.name');
  document.title = `${pageTitle} | ${i18n.global.t('app.name')}`;

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
