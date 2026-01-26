<script setup lang="ts">
import { reactive, ref } from 'vue';
import Button from '../../components/Button.vue';

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const errors = reactive({
  email: '',
  password: ''
});

const showPassword = ref(false);

const emit = defineEmits(['switch-to-signup', 'login-success']);

const handleLogin = () => {
  // Reset errors
  errors.email = '';
  errors.password = '';
  
  // Validació
  if (!form.email) {
    errors.email = 'Aquest camp és obligatori';
    return;
  }
  
  // Validació format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = "Inclou una '@' a l'adreça de correu electrònic";
    return;
  }
  
  if (!form.password) {
    errors.password = 'Aquest camp és obligatori';
    return;
  }
  
  // Validació contrasenya: mínim 8 caràcters, 1 majúscula i 1 número
  if (form.password.length < 8) {
    errors.password = 'La contrasenya ha de tenir almenys 8 caràcters';
    return;
  }
  
  if (!/[A-Z]/.test(form.password)) {
    errors.password = 'La contrasenya ha de contenir almenys una majúscula';
    return;
  }
  
  if (!/[0-9]/.test(form.password)) {
    errors.password = 'La contrasenya ha de contenir almenys un número';
    return;
  }
  
  console.log('Login attempt with:', form);
  
  // Emit login success per navegar al dashboard
  emit('login-success');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <img class="mx-auto h-16 w-auto" src="/Blink_logo.png" alt="Blink Logo" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Inicia sessió a Blink
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        No tens compte?
        {{ ' ' }}
        <button @click="emit('switch-to-signup')" type="button" style="color: #89C242;" class="font-medium hover:brightness-75 transition-all">
          Crea'n un
        </button>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleLogin" novalidate>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Correu electrònic</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                id="email" 
                v-model="form.email" 
                type="email"
                placeholder="exemple@correu.com"
                @input="errors.email = ''"
                class="appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
                :class="errors.email ? 'border-red-300' : 'border-gray-300'"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contrasenya</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                id="password" 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                @input="errors.password = ''"
                class="appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
                :class="errors.password ? 'border-red-300' : 'border-gray-300'"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.rememberMe" type="checkbox" style="accent-color: #89C242;" class="h-4 w-4 border-gray-300 rounded cursor-pointer" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 cursor-pointer select-none">Recorda'm</label>
            </div>
            <div class="text-sm">
              <a href="#" style="color: #89C242;" class="hover:brightness-75 transition-all">Has oblidat la contrasenya?</a>
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" :full-width="true">
              Iniciar sessió
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
