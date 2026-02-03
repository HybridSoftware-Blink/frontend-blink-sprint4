<template>
  <div
    :class="[
      isCollapsed ? 'w-20 px-3' : 'w-72 px-6',
      'relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 transition-[width,padding] duration-200 ease-in-out dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10',
    ]"
  >
    <!-- HEADER -->
    <div class="flex h-20 shrink-0 items-center justify-center">
      <!-- LOGO -->
      <img  
        :class="[
          'rounded-lg bg-white/5 p-1 transition-all duration-200',
          isCollapsed ? 'size-9' : 'h-12'
        ]"
        :src="blinkLogo"
        alt="Blink"
      />
    </div>

    <!-- NAV -->
    <nav class="relative flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7 items-center">
        <!-- CLIENTE SECTION -->
        <li class="w-full">
          <div
            v-if="!isCollapsed"
            class="text-xs/6 font-semibold text-gray-400 px-2 mb-2"
          >
            Cliente
          </div>
          <ul role="list" class="space-y-1 flex flex-col items-center">
            <li
              v-for="item in clienteNavigation"
              :key="item.name"
              class="w-full flex justify-center"
            >
              <a
                :href="item.href"
                :title="isCollapsed ? item.name : undefined"
                :class="[
                  item.current
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  'group relative flex items-center font-semibold rounded-md transition-colors',
                  isCollapsed
                    ? 'h-10 w-10 justify-center'
                    : 'w-full gap-x-3 p-2 text-sm/6',
                ]"
              >
                <component
                  :is="item.icon"
                  class="size-6 shrink-0"
                  aria-hidden="true"
                />

                <span v-if="!isCollapsed" class="truncate">
                  {{ item.name }}
                </span>

                <!-- BADGE (expanded) -->
                <span
                  v-if="!isCollapsed && item.count"
                  class="ml-auto w-9 min-w-max rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-white"
                >
                  {{ item.count }}
                </span>

                <!-- DOT (collapsed) -->
                <span
                  v-if="isCollapsed && item.count"
                  class="absolute right-1 top-1 block size-2 rounded-full bg-primary-500"
                />
              </a>
            </li>
          </ul>
        </li>

        <!-- ADMIN SECTION -->
        <li class="w-full">
          <div
            v-if="!isCollapsed"
            class="text-xs/6 font-semibold text-gray-400 px-2 mb-2"
          >
            Admin
          </div>
          <ul role="list" class="space-y-1 flex flex-col items-center">
            <li
              v-for="item in adminNavigation"
              :key="item.name"
              class="w-full flex justify-center"
            >
              <a
                :href="item.href"
                :title="isCollapsed ? item.name : undefined"
                :class="[
                  item.current
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  'group relative flex items-center font-semibold rounded-md transition-colors',
                  isCollapsed
                    ? 'h-10 w-10 justify-center'
                    : 'w-full gap-x-3 p-2 text-sm/6',
                ]"
              >
                <component
                  :is="item.icon"
                  class="size-6 shrink-0"
                  aria-hidden="true"
                />

                <span v-if="!isCollapsed" class="truncate">
                  {{ item.name }}
                </span>

                <!-- BADGE (expanded) -->
                <span
                  v-if="!isCollapsed && item.count"
                  class="ml-auto w-9 min-w-max rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-white"
                >
                  {{ item.count }}
                </span>

                <!-- DOT (collapsed) -->
                <span
                  v-if="isCollapsed && item.count"
                  class="absolute right-1 top-1 block size-2 rounded-full bg-primary-500"
                />
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  ChartPieIcon,
  Cog6ToothIcon,
  HomeIcon,
  MapPinIcon,
  TicketIcon,
  TruckIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

import blinkLogo from '../../assets/blink-logo.png'

type NavItem = {
  name: string
  href: string
  icon: unknown
  count?: string
  current: boolean
}

defineProps<{
  isCollapsed: boolean
}>()

const clienteNavigation: NavItem[] = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Tickets', href: '#', icon: TicketIcon, current: false },
  { name: 'Reservas', href: '#', icon: ChartPieIcon, current: false },
  { name: 'Configuración', href: '#', icon: Cog6ToothIcon, current: false },
]

const adminNavigation: NavItem[] = [
  { name: 'Usuarios', href: '#', icon: UsersIcon, current: false },
  { name: 'Vehículos', href: '#', icon: TruckIcon, count: '12', current: false },
  { name: 'Reservas', href: '#', icon: ChartPieIcon, current: false },
  { name: 'Geofencing', href: '#', icon: MapPinIcon, count: '20+', current: false },
  { name: 'Tickets', href: '#', icon: TicketIcon, current: false },
]

</script>
