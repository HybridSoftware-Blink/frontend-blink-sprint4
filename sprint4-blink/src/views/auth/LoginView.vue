<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../services/auth.service';
import type { LoginCredentials } from '../../types/auth.types';
import BaseInput from '../../components/base/BaseInput.vue';
import BaseButton from '../../components/base/BaseButton.vue';
import BaseCard from '../../components/base/BaseCard.vue';
import AuthBackground from '../../components/auth/AuthBackground.vue';
import AuthLogo from '../../components/auth/AuthLogo.vue';
import { useToast } from '../../composables/useToast';

const router = useRouter();
const toast = useToast();

const form = reactive<LoginCredentials>({
    email: '',
    password: '',
});

const loading = ref(false);
const fieldErrors = ref<Record<string, string[]>>({});
const showPassword = ref(false);

/**
 * Maneja el envío del formulario de login
 */
const handleLogin = async () => {
    fieldErrors.value = {};
    loading.value = true;

    try {
        const response = await authService.login(form);

        toast.success(`¡Bienvenido/a ${response.user.name}!`);

        router.push('/dashboard');
    } catch (err: any) {
        if (err.errors) {
            fieldErrors.value = err.errors;
            toast.error('Por favor, corrige los errores en el formulario');
        } else {
            toast.error(err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
    } finally {
        loading.value = false;
    }
};

const getFieldError = (field: string): string => {
    return fieldErrors.value[field]?.[0] || '';
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

<template>
    <AuthBackground>
        <BaseCard>
            <AuthLogo />

            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Sign in to Blink
                </h1>
                <p class="text-gray-600">
                    Don't have an account?
                    <router-link to="/register" class="text-green-600 hover:text-green-700 font-medium">
                        Create one
                    </router-link>
                </p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">

                <BaseInput v-model="form.email" type="email" label="Email address" placeholder="example@email.com"
                    icon="email" :required="true" :disabled="loading" :error="getFieldError('email')" />

                <BaseInput v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password"
                    placeholder="••••••••" icon="password" :required="true" :disabled="loading"
                    :error="getFieldError('password')" :show-password-toggle="true"
                    @toggle-password="togglePasswordVisibility" />

                <div class="flex items-center justify-end">
                    <a href="#" class="text-sm text-green-600 hover:text-green-700 font-medium">
                        Forgot password?
                    </a>
                </div>

                <BaseButton type="submit" :disabled="loading" :loading="loading" full-width>
                    <span v-if="!loading">Sign in</span>
                    <span v-else>Loading...</span>
                </BaseButton>
            </form>
        </BaseCard>
    </AuthBackground>
</template>
