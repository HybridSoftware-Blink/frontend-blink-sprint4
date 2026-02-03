<script setup lang="ts">
interface Props {
    title?: string;
    showMenuButton?: boolean;
    showLogoutButton?: boolean;
}

withDefaults(defineProps<Props>(), {
    title: '',
    showMenuButton: true,
    showLogoutButton: true,
});

const emit = defineEmits<{
    toggleMenu: [];
    logout: [];
}>();

const handleMenuClick = () => {
    emit('toggleMenu');
};

const handleLogoutClick = () => {
    emit('logout');
};
</script>

<template>
    <nav class="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-4 py-3 sm:px-6">
        <div class="flex items-center justify-between">
            <!-- Menu button & Title -->
            <div class="flex items-center gap-4">
                <button v-if="showMenuButton" @click="handleMenuClick"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="Menú">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <h1 class="text-xl font-medium text-gray-900">
                    {{ title }}
                </h1>
            </div>

            <!-- Logout button -->
            <button v-if="showLogoutButton" @click="handleLogoutClick"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors shadow-sm">
                Cerrar Sesión
            </button>
        </div>
    </nav>
</template>
