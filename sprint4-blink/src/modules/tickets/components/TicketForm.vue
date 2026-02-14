<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Asunto -->
    <BaseInput
      v-model="formData.asunto"
      :label="$t('tickets.form.asunto')"
      type="text"
      :placeholder="$t('tickets.form.asuntoPlaceholder')"
      :error="formatError((errors as any).asunto)"
      required
    />


    <!-- Descripcion / Problema -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('tickets.form.descripcion') }}</label>
      <textarea
        v-model="formData.descripcion"
        rows="4"
        class="w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent border-gray-300"
        :placeholder="$t('tickets.form.descripcionPlaceholder')"
      />
      <p v-if="(errors as any).descripcion" class="text-sm text-red-600 mt-1">{{ formatError((errors as any).descripcion) }}</p>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <BaseButton type="button" variant="secondary" @click="$emit('cancel')">
        {{ $t('common.cancel') }}
      </BaseButton>
      <BaseButton type="submit" :loading="loading">
        {{ $t('tickets.actions.createTicket') }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BaseInput, BaseButton } from '@/components/base';
import type { CreateTicketData } from '@/modules/tickets/types/ticket.types';
import type { ValidationErrors } from '@/modules/tickets/utils/ticketValidation';
import { useI18n } from 'vue-i18n';

interface Props {
  loading?: boolean;
  errors?: ValidationErrors | Record<string, string>;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  errors: () => ({}),
});

const emit = defineEmits<{
  submit: [data: CreateTicketData];
  cancel: [];
}>();

const { t } = useI18n();

const formatError = (error: string): string => {
  if (!error) return '';
  if (error.startsWith('validation.') || error.startsWith('errors.')) return t(error);
  return error;
};

const formData = ref<CreateTicketData>({
  asunto: '',
  descripcion: '',
});

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
