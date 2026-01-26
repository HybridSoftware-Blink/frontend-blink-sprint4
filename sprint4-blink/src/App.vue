<script setup lang="ts">
import { ref } from 'vue';
import Login from './views/login/register.vue';
import Signup from './views/login/signup.vue';
import DashboardMap from './views/dashboard/DashboardMap.vue';

const currentView = ref<'login' | 'signup' | 'dashboard'>('login');

const switchToSignup = () => {
  currentView.value = 'signup';
};

const switchToLogin = () => {
  currentView.value = 'login';
};

const switchToDashboard = () => {
  currentView.value = 'dashboard';
};

const handleLogout = () => {
  currentView.value = 'login';
};
</script>

<template>
  <Login v-if="currentView === 'login'" @switch-to-signup="switchToSignup" @login-success="switchToDashboard" />
  <Signup v-else-if="currentView === 'signup'" @switch-to-login="switchToLogin" @signup-success="switchToDashboard" />
  <DashboardMap v-else @logout="handleLogout" />
</template>
