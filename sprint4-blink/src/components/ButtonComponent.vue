<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  fullWidth: false
});

const variantClasses = {
  primary: 'bg-purple-700 hover:bg-purple-800 text-white focus:ring-purple-600',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
  success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      fullWidth ? 'w-full' : ''
    ]"
  >
    <slot />
  </button>
</template>
