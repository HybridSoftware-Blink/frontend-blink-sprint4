<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput v-model="formData.name" label="Nombre" type="text" placeholder="Nombre completo" :error="errors.name"
      required />

    <BaseInput v-model="formData.email" label="Email" type="email" placeholder="correo@ejemplo.com"
      :error="errors.email" required />

    <BaseInput v-model="formData.phone" label="Teléfono" type="tel" placeholder="+34 600 000 000"
      :error="errors.phone" @keydown="onPhoneKeydown" @paste="onPhonePaste" required />
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        Rol
      </label>
      <select v-model="formData.role"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required>
        <option value="user">Usuario</option>
        <option value="admin">Administrador</option>
      </select>
      <p v-if="errors.role" class="text-sm text-red-600">{{ errors.role }}</p>
    </div>

    <BaseInput v-model="formData.password" label="Contraseña" type="password" placeholder="••••••••"
      :error="errors.password" :required="!isEditing" />

    <BaseInput v-model="formData.password_confirmation" label="Confirmar Contraseña" type="password"
      placeholder="••••••••" :error="errors.password_confirmation || passwordMismatchError"
      :required="!isEditing && !!formData.password" />

    <div class="flex justify-end space-x-3 pt-4">
      <BaseButton type="button" variant="secondary" @click="$emit('cancel')">
        Cancelar
      </BaseButton>
      <BaseButton type="submit" :loading="loading" :disabled="!!passwordMismatchError">
        {{ isEditing ? 'Actualizar' : 'Crear' }} Usuario
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BaseInput, BaseButton } from '../base';
import type { User, CreateUserData, UpdateUserData } from '../../types/user.types';
import { useUserForm } from '../../composables/useUserForm';

interface Props {
  user?: User | null;
  loading?: boolean;
  errors?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  loading: false,
  errors: () => ({}),
});

const emit = defineEmits<{
  submit: [data: CreateUserData | UpdateUserData];
  cancel: [];
}>();

const isEditing = ref(!!props.user);

const formData = ref<CreateUserData>({
  name: '',
  email: '',
  phone: '',
  role: 'user',
  password: '',
  password_confirmation: '',
});

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      isEditing.value = true;
      formData.value = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role as 'user' | 'admin',
        password: '',
        password_confirmation: '',
      };
    } else {
      isEditing.value = false;
      formData.value = {
        name: '',
        email: '',
        phone: '',
        role: 'user',
        password: '',
        password_confirmation: '',
      };
    }
  },
  { immediate: true }
);

const { passwordMismatchError, onPhoneKeydown, onPhonePaste } = useUserForm(formData);

const handleSubmit = () => {
  if (passwordMismatchError.value) return;
  
  if (isEditing.value) {
    const updateData: UpdateUserData = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      role: formData.value.role,
    };

    if (formData.value.password) {
      updateData.password = formData.value.password;
      updateData.password_confirmation = formData.value.password_confirmation;
    }

    emit('submit', updateData);
  } else {
    emit('submit', formData.value);
  }
};
</script>
