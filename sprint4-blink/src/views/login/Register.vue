<script setup lang="ts">
import LoginComponent from '../../components/LoginComponent.vue';

const emit = defineEmits(['switch-to-signup']);

const handleSwitchToSignup = () => {
  emit('switch-to-signup');
};
</script>

<template>
  <div class="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <video 
      autoplay 
      loop 
      muted 
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/Video_fondo_login_1.mp4" type="video/mp4">
    </video>
    
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    
    <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
      <LoginComponent @switch-to-signup="handleSwitchToSignup" />
    </div>
  </div>
</template>
