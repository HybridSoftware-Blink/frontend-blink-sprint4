<script setup lang="ts">
import { ref } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import MapView from '../../components/dashboard/MapView.vue';

// Dades estàtiques de vehicles a Amposta amb bateria i matrícula
const vehicles = ref([
  { id: 1, name: 'Vehicle A', plate: '1234 ABC', lat: 40.7095, lng: 0.5789, status: 'active' as const, battery: 85 },
  { id: 2, name: 'Vehicle B', plate: '5678 DEF', lat: 40.7115, lng: 0.5805, status: 'charging' as const, battery: 45 },
  { id: 3, name: 'Vehicle C', plate: '9012 GHI', lat: 40.7080, lng: 0.5770, status: 'idle' as const, battery: 20 }
]);

const emit = defineEmits(['logout']);

const handleLogout = () => {
  emit('logout');
};
</script>

<template>
  <DashboardLayout :vehicle-count="vehicles.length" @logout="handleLogout">
    <MapView :vehicles="vehicles" />
  </DashboardLayout>
</template>

