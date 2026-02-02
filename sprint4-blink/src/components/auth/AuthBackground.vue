<script setup lang="ts">
defineProps<{
  showLogo?: boolean;
}>();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
    <video 
      autoplay 
      loop 
      muted 
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source src="../../assets/blackground.mp4" type="video/mp4">
    </video>
    
    <!-- Contenido -->
    <div class="max-w-md w-full relative z-10">
      <slot></slot>
    </div>
  </div>
</template>
