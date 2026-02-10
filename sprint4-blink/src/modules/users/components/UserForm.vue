<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Row 1: Name and Email -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput v-model="formData.name" :label="$t('users.form.name')" type="text" :placeholder="$t('users.form.namePlaceholder')"
        :error="formatError((errors as any).name)" required />

      <BaseInput v-model="formData.email" :label="$t('users.form.email')" type="email" :placeholder="$t('users.form.emailPlaceholder')"
        :error="formatError((errors as any).email)" required />
    </div>

    <!-- Row 2: Phone and Role -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput v-model="formData.phone" :label="$t('users.form.phone')" type="tel" :placeholder="$t('users.form.phonePlaceholder')"
        :error="formatError((errors as any).phone)" @keydown="onPhoneKeydown" @paste="onPhonePaste" required />
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ $t('users.form.role') }}
        </label>
        <select v-model="formData.role"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required>
          <option value="user">{{ $t('roles.user') }}</option>
          <option value="admin">{{ $t('roles.admin') }}</option>
        </select>
        <p v-if="(errors as any).role" class="text-sm text-red-600">{{ formatError((errors as any).role) }}</p>
      </div>
    </div>

    <!-- Row 3: Password and Confirmation -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput v-model="formData.password" :label="$t('users.form.password')" type="password" :placeholder="$t('users.form.passwordPlaceholder')"
        :error="formatError((errors as any).password)" :required="!isEditing" />

      <BaseInput v-model="formData.password_confirmation" :label="$t('users.form.passwordConfirmation')" type="password"
        :placeholder="$t('users.form.passwordPlaceholder')" :error="formatError((errors as any).password_confirmation || passwordMismatchError)"
        :required="!isEditing && !!formData.password" />
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <BaseButton type="button" variant="secondary" @click="$emit('cancel')">
        {{ $t('common.cancel') }}
      </BaseButton>
      <BaseButton type="submit" :loading="loading" :disabled="!!passwordMismatchError">
        {{ isEditing ? $t('users.actions.updateUser') : $t('users.actions.createUser') }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BaseInput, BaseButton } from '@/components/base';
import type { User, CreateUserData, UpdateUserData } from '@/modules/users/types/user.types';
import { useUserForm } from '@/modules/users/composables/useUserForm';
import type { ValidationErrors } from '@/modules/users/utils/userValidation';
import { useI18n } from 'vue-i18n';

interface Props {
  user?: User | null;
  loading?: boolean;
  errors?: ValidationErrors | Record<string, string>;
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

const { t } = useI18n();

const formatError = (error: string): string => {
  if (!error) return '';
  if (error.startsWith('validation.') || error.startsWith('errors.')) return t(error);
  return error;
};

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
