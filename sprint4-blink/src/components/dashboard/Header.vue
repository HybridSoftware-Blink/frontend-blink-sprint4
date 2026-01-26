<script setup lang="ts">
interface Props {
  vehicleCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  vehicleCount: 0
});

const emit = defineEmits(['refresh']);

const handleRefresh = () => {
  emit('refresh');
};
</script>

<template>
  <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <h1 class="text-2xl font-bold text-gray-900">Blink - Fleet Control</h1>
      <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
        {{ vehicleCount }} vehicles actius
      </span>
    </div>
    
    <div class="flex items-center space-x-4">
      <!-- Botó de refrescar -->
      <button @click="handleRefresh" class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="text-sm font-medium">Refrescar</span>
      </button>

      <!-- Notificacions -->
      <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      <!-- Avatar usuari -->
      <div class="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-purple-700 transition-colors">
        BL
      </div>
    </div>
  </header>
</template>
