<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../services/auth.service';
import type { User } from '../../types/auth.types';
import { useToast } from '../../composables/useToast';
import Sidebar from '../../components/layout/Sidebar.vue';
import Navbar from '../../components/layout/Navbar.vue';

const router = useRouter();
const toast = useToast();
const user = ref<User | null>(null);
const isCollapsed = ref(true);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

onMounted(async () => {
  // Cargar usuario local (UI rápida) y validar token contra backend
  user.value = authService.getUser();

  try {
    const me = await authService.getCurrentUser();
    user.value = me;
    authService.setUser(me);
  } catch (_err) {
    toast.error('Tu sesión ha caducado. Vuelve a iniciar sesión.');
    await authService.logout();
    router.push('/login');
  }
});

/**
 * Cierra la sesión del usuario
 */
const handleLogout = async () => {
  await authService.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="shrink-0 h-screen sticky top-0">
      <Sidebar :is-collapsed="isCollapsed" class="h-full" />
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Navbar -->
      <Navbar 
        title="Dashboard" 
        @toggle-menu="toggleSidebar"
        @logout="handleLogout"
      />

      <!-- Contenido principal -->
      <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            ¡Bienvenido al Dashboard!
          </h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Información del Usuario
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><span class="font-medium">Nombre:</span> {{ user?.name }}</p>
                <p><span class="font-medium">Email:</span> {{ user?.email }}</p>
                <p><span class="font-medium">Teléfono:</span> {{ user?.phone }}</p>
                <p><span class="font-medium">Rol:</span> {{ user?.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
