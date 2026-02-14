<template>
  <div class="flex flex-col h-[500px]">
    <!-- Header del ticket -->
    <div class="border-b pb-4 mb-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 class="text-lg font-semibold text-gray-900">{{ ticket.asunto }}</h4>
          <p class="text-sm text-gray-500 mt-1">{{ formatDate(ticket.created_at) }}</p>
        </div>
        <span class="inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full" :class="getEstadoClass(ticket.estado)">
          {{ ticket.estado ? t(`tickets.estados.${ticket.estado}`) : t('tickets.estados.pendiente') }}
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-3">{{ ticket.descripcion }}</p>
    </div>

    <!-- Área de mensajes -->
    <div class="flex-1 overflow-y-auto space-y-3 mb-4 px-2" ref="messagesContainer">
      <div v-if="!messages || messages.length === 0" class="text-center text-gray-500 py-8">
        {{ $t('tickets.chat.noMessages') }}
      </div>
      
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'flex',
          message.is_admin ? 'justify-start' : 'justify-end'
        ]"
      >
        <div
          :class="[
            'max-w-[70%] rounded-lg px-4 py-2',
            message.is_admin 
              ? 'bg-purple-100 text-gray-900 border border-purple-200' 
              : 'bg-blue-600 text-white'
          ]"
        >
          <p class="text-sm font-medium mb-1">
            {{ message.is_admin ? $t('tickets.chat.admin') : $t('tickets.chat.you') }}
          </p>
          <p class="text-sm whitespace-pre-wrap">{{ message.mensaje }}</p>
          <p :class="['text-xs mt-1', message.is_admin ? 'text-purple-600' : 'text-blue-100']">
            {{ formatDate(message.created_at) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Input de respuesta -->
    <div class="border-t pt-4">
      <form @submit.prevent="handleSubmit" class="space-y-3">
        <textarea
          v-model="newMessage"
          rows="3"
          class="w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
          :placeholder="$t('tickets.chat.messagePlaceholder')"
          :disabled="loading"
        />
        <div class="flex justify-end items-center gap-2">
          <BaseButton type="button" variant="secondary" @click="$emit('close')" :disabled="loading">
            {{ $t('common.close') }}
          </BaseButton>
          <BaseButton type="submit" :loading="loading" :disabled="!newMessage.trim()">
            {{ $t('tickets.chat.send') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue';
import { BaseButton } from '@/components/base';
import type { Ticket } from '@/modules/tickets/types/ticket.types';
import { useI18n } from 'vue-i18n';

interface Props {
  ticket: Ticket;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  send: [message: string];
  close: [];
}>();

const { t, locale } = useI18n();

const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const messages = computed(() => props.ticket.mensajes || []);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Scroll al cargar o cuando cambien los mensajes
watch(messages, () => {
  scrollToBottom();
}, { immediate: true });

const handleSubmit = () => {
  if (!newMessage.value.trim()) return;
  emit('send', newMessage.value.trim());
  newMessage.value = '';
};

const dateFormatter = computed(() => {
  const localeMap: Record<string, string> = {
    ca: 'ca-ES',
    es: 'es-ES',
    en: 'en-GB',
  };
  const intlLocale = localeMap[String(locale.value)] ?? 'ca-ES';

  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const formatDate = (date: string): string => {
  return dateFormatter.value.format(new Date(date));
};

const getEstadoClass = (estado: string | undefined): string => {
  const classes: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
    usado: 'bg-gray-100 text-gray-800',
  };
  return classes[String(estado)] || 'bg-gray-100 text-gray-800';
};
</script>
