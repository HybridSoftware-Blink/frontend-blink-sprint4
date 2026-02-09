import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Registro',
    },
  },
];
