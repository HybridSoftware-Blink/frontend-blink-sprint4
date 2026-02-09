<script setup lang="ts">
import blinkLogo from '@/assets/blink-logo.png';

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
      :src="blinkLogo" 
      alt="Blink Logo" 
      :class="[sizeClasses[size || 'md'], 'w-auto object-contain', 'shadow-none']"
    />
  </div>
</template>
