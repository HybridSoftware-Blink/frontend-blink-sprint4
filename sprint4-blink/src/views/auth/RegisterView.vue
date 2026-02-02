<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../services/auth.service';
import type { RegisterData } from '../../types/auth.types';
import BaseInput from '../../components/base/BaseInput.vue';
import BaseButton from '../../components/base/BaseButton.vue';
import BaseCard from '../../components/base/BaseCard.vue';
import AuthBackground from '../../components/auth/AuthBackground.vue';
import AuthLogo from '../../components/auth/AuthLogo.vue';
import { useToast } from '../../composables/useToast';

const router = useRouter();
const toast = useToast();

const form = reactive<RegisterData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'user',
});

const loading = ref(false);
const fieldErrors = ref<Record<string, string[]>>({});
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

/**
 * Maneja el envío del formulario de registro
 */
const handleRegister = async () => {
    fieldErrors.value = {};
    loading.value = true;

    try {
        const response = await authService.register(form);

        toast.success(`¡Cuenta creada! Bienvenido/a ${response.user?.name ?? 'a Blink'}`);

     
        authService.clearAuth();
        router.push({ name: 'Login' });
    } catch (err: any) {
        if (err.errors) {
            fieldErrors.value = err.errors;
            toast.error('Por favor, corrige los errores en el formulario');
        } else {
            toast.error(err.message || 'Error al registrarse. Por favor, intenta de nuevo.');
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

const togglePasswordConfirmationVisibility = () => {
    showPasswordConfirmation.value = !showPasswordConfirmation.value;
};
</script>

<template>
    <AuthBackground container-class="max-w-3xl">
        <BaseCard>
            <AuthLogo />

            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Create your Blink account
                </h1>
                <p class="text-gray-600">
                    Already have an account?
                    <router-link to="/login" class="text-green-600 hover:text-green-700 font-medium">
                        Sign in
                    </router-link>
                </p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <BaseInput v-model="form.name" type="text" label="Full name" placeholder="Your name" icon="user"
                        :required="true" :disabled="loading" :error="getFieldError('name')" />

                    <BaseInput v-model="form.phone" type="tel" label="Phone" placeholder="+34 600 000 000" icon="phone"
                        :required="true" :disabled="loading" :error="getFieldError('phone')" />

                    <div class="md:col-span-2">
                        <BaseInput v-model="form.email" type="email" label="Email address" placeholder="example@email.com"
                            icon="email" :required="true" :disabled="loading" :error="getFieldError('email')" />
                    </div>

                    <BaseInput v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password"
                        placeholder="••••••••" icon="password" :required="true" :disabled="loading"
                        :error="getFieldError('password')" :show-password-toggle="true"
                        @toggle-password="togglePasswordVisibility" />

                    <BaseInput v-model="form.password_confirmation"
                        :type="showPasswordConfirmation ? 'text' : 'password'" label="Confirm password"
                        placeholder="••••••••" icon="password" :required="true" :disabled="loading"
                        :error="getFieldError('password_confirmation')" :show-password-toggle="true"
                        @toggle-password="togglePasswordConfirmationVisibility" />

                    <div class="md:col-span-2">
                        <BaseButton type="submit" :disabled="loading" :loading="loading" full-width>
                            <span v-if="!loading">Create account</span>
                            <span v-else>Loading...</span>
                        </BaseButton>
                    </div>
                </div>
            </form>
        </BaseCard>
    </AuthBackground>
</template>
