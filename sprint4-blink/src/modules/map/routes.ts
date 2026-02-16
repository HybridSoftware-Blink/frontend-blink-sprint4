import type { RouteRecordRaw } from 'vue-router';

export const mapRoutes: RouteRecordRaw[] = [
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/modules/map/views/MapView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];
