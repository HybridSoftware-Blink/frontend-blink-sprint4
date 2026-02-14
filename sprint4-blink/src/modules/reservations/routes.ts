import type { RouteRecordRaw } from 'vue-router';

export const reservationsRoutes: RouteRecordRaw[] = [
  {
    path: '/reservations',
    name: 'Reservations',
    component: () => import('./views/ReservationsView.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'reservations.title',
    },
  },
];
