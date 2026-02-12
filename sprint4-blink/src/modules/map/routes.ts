import type { RouteRecordRaw } from 'vue-router';

export const mapRoutes: RouteRecordRaw[] = [
  {
    path: '/map',
    name: 'map',
    component: () => import('./views/MapView.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'map.title',
    },
  },
];
