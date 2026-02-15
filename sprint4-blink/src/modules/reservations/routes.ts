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
  {
    path: '/browse-vehicles',
    name: 'BrowseVehicles',
    component: () => import('./views/BrowseVehiclesView.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'bookings.browseVehicles.title',
    },
  },
  {
    path: '/my-calendar',
    name: 'MyCalendar',
    component: () => import('./views/MyCalendarView.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'bookings.myCalendar.title',
    },
  },
];
