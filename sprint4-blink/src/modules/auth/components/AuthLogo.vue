<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
}>();

const sizeClasses = {
  sm: 'h-16',
  md: 'h-24',
  lg: 'h-32',
};
</script>

<template>
  <div class="flex justify-center mb-6">
    <img 
      src="../../assets/blink-logo.png" 
      alt="Blink Logo" 
      :class="[sizeClasses[size || 'md'], 'w-auto object-contain', 'shadow-none']"
    />
  </div>
</template>
