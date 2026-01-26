<script setup lang="ts">
import Sidebar from '../components/dashboard/Sidebar.vue';
import Header from '../components/dashboard/Header.vue';

interface Props {
  vehicleCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  vehicleCount: 0
});

const emit = defineEmits(['logout', 'refresh']);

const handleLogout = () => {
  emit('logout');
};

const handleRefresh = () => {
  emit('refresh');
};
</script>

<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <Sidebar @logout="handleLogout" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header :vehicle-count="vehicleCount" @refresh="handleRefresh" />
      
      <div class="flex-1 relative">
        <slot />
      </div>
    </div>
  </div>
</template>
