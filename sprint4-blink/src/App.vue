<script setup lang="ts">
import { ref } from 'vue';
import Login from './views/login/Register.vue';
import Signup from './views/login/Signup.vue';

const currentView = ref<'login' | 'signup'>('login');

const switchToSignup = () => {
  currentView.value = 'signup';
};

const switchToLogin = () => {
  currentView.value = 'login';
};
</script>

<template>
  <Login v-if="currentView === 'login'" @switch-to-signup="switchToSignup" />
  <Signup v-else @switch-to-login="switchToLogin" />
</template>
