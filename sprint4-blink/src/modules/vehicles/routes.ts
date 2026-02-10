import type { RouteRecordRaw } from 'vue-router';

export const vehiclesRoutes: RouteRecordRaw[] = [
  {
    path: '/vehicles',
    name: 'vehicles',
    component: () => import('./views/VehiclesView.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'vehicles.title',
    },
  },
];
