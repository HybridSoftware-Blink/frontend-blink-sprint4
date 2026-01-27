<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import Button from '../../components/ButtonComponent.vue';

const form = reactive({
  name: '',
  email: '',
  password: '',
  acceptTerms: false
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  acceptTerms: ''
});

const showPassword = ref(false);

const passwordStrength = computed(() => {
  const len = form.password.length;
  if (len === 0) return { text: '', color: '' };
  if (len < 6) return { text: 'Too short', color: 'text-red-600' };
  if (len < 10) return { text: 'Acceptable password', color: 'text-yellow-600' };
  return { text: 'Strong password', color: 'text-green-600' };
});

const emit = defineEmits(['switch-to-login']);

const handleSignup = () => {
  errors.name = '';
  errors.email = '';
  errors.password = '';
  errors.acceptTerms = '';
  
  if (!form.name) {
    errors.name = 'This field is required';
    return;
  }
  
  if (!form.email) {
    errors.email = 'This field is required';
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = "Please include an '@' in the email address";
    return;
  }
  
  if (!form.password) {
    errors.password = 'This field is required';
    return;
  }
  
  if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    return;
  }
  
  if (!form.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
    return;
  }
  
  console.log('Signup attempt with:', form);
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
      <div class="bg-white bg-opacity-95 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
        <div class="text-center mb-8">
          <img class="mx-auto h-16 w-auto" src="/Blink_logo.png" alt="Blink Logo" />
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your Blink account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Already have an account?
            {{ ' ' }}
            <button @click="emit('switch-to-login')" type="button" style="color: #89C242;" class="font-medium hover:brightness-75 transition-all">
              Sign in
            </button>
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSignup" novalidate>
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full name</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input 
                id="name" 
                v-model="form.name" 
                type="text"
                placeholder="John Doe"
                @input="errors.name = ''"
                class="appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
                :class="errors.name ? 'border-red-300' : 'border-gray-300'"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
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
                placeholder="example@email.com"
                @input="errors.email = ''"
                class="appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
                :class="errors.email ? 'border-red-300' : 'border-gray-300'"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
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
                placeholder="Minimum 6 characters"
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
            <div class="mt-1 flex items-center justify-between">
              <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
              <p v-else-if="form.password.length > 0" class="text-sm" :class="passwordStrength.color">{{ passwordStrength.text }}</p>
            </div>
          </div>

          <div>
            <div class="flex items-start">
              <input 
                id="acceptTerms" 
                v-model="form.acceptTerms" 
                type="checkbox" 
                style="accent-color: #89C242;" 
                class="h-4 w-4 border-gray-300 rounded cursor-pointer mt-1"
                @change="errors.acceptTerms = ''"
              />
              <label for="acceptTerms" class="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
                I accept the 
                <a href="#" style="color: #89C242;" class="hover:brightness-75 transition-all">terms and conditions</a>
                and the
                <a href="#" style="color: #89C242;" class="hover:brightness-75 transition-all">privacy policy</a>
              </label>
            </div>
            <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">{{ errors.acceptTerms }}</p>
          </div>

          <div>
            <Button type="submit" variant="primary" :full-width="true">
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
