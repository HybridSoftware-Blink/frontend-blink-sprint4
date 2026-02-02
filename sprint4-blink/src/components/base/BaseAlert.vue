<script setup lang="ts">
interface Props {
  type?: 'error' | 'success' | 'warning';
  message: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  dismissible: false,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const alertClasses = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
};

const iconPaths = {
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
};
</script>

<template>
  <div :class="alertClasses[type]" class="border px-4 py-3 rounded-lg flex items-start" role="alert">
    <svg class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPaths[type]" />
    </svg>
    <p class="text-sm flex-1">{{ message }}</p>
    <button v-if="dismissible" @click="emit('dismiss')" class="ml-2 flex-shrink-0" type="button">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>
