<template>
  <div
    class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10"
  >
    <div class="relative flex h-16 shrink-0 items-center">
      <img
        class="h-8 w-auto"
        :src="blinkLogo"
        alt="Blink"
      />
    </div>

    <nav class="relative flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <a
                :href="item.href"
                :class="[
                  item.current
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                ]"
              >
                <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                {{ item.name }}
                <span
                  v-if="item.count"
                  class="ml-auto w-9 min-w-max rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-white outline-1 -outline-offset-1 outline-white/15"
                  aria-hidden="true"
                >
                  {{ item.count }}
                </span>
              </a>
            </li>
          </ul>
        </li>

        <li>
          <div class="text-xs/6 font-semibold text-gray-400">Your teams</div>
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <li v-for="team in teams" :key="team.name">
              <a
                :href="team.href"
                :class="[
                  team.current
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                ]"
              >
                <span
                  class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[0.625rem] font-medium text-gray-400 group-hover:border-white/20 group-hover:text-white"
                >
                  {{ team.initial }}
                </span>
                <span class="truncate">{{ team.name }}</span>
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
  CalendarIcon,
  ChartPieIcon,
  FolderIcon,
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

type TeamItem = {
  id: number
  name: string
  href: string
  initial: string
  current: boolean
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, count: '5', current: true },
  { name: 'Usuarios', href: '#', icon: UsersIcon, current: false },
  { name: 'Vehículos', href: '#', icon: TruckIcon, count: '12', current: false },
  { name: 'Reservas', href: '#', icon: ChartPieIcon, current: false },
  { name: 'Geofencing', href: '#', icon: MapPinIcon, count: '20+', current: false },
  { name: 'Tickets', href: '#', icon: TicketIcon, current: false },
]

const teams: TeamItem[] = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]
</script>
