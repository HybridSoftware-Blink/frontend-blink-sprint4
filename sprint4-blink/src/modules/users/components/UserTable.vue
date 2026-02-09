<template>
  <BaseTable :columns="columns" :data="users" :loading="loading" loadingText="Cargando usuarios..."
    emptyText="No hay usuarios para mostrar">
    <template #cell-name="{ value }">
      <div class="text-sm font-medium text-gray-900">{{ value }}</div>
    </template>

    <template #cell-role="{ value }">
      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
        :class="value === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
        {{ value }}
      </span>
    </template>

    <template #cell-created_at="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell-actions="{ item }">
      <div class="flex gap-2 justify-end">
        <button
          @click="$emit('view', item)"
          class="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          title="Ver"
        >
          <EyeIcon class="w-5 h-5" />
        </button>
        <button
          @click="$emit('edit', item)"
          class="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
          title="Editar"
        >
          <PencilIcon class="w-5 h-5" />
        </button>
        <button
          @click="$emit('delete', item)"
          class="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
          title="Eliminar"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { BaseTable } from '@/components/base';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { User } from '@/modules/users/types/user.types';
import type { TableColumn } from '@/components/base/BaseTable.vue';

interface Props {
  users?: User[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  users: () => [],
  loading: false,
});

defineEmits<{
  view: [user: User];
  edit: [user: User];
  delete: [user: User];
}>();

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', align: 'left' },
  { key: 'name', label: 'Nombre', align: 'left' },
  { key: 'email', label: 'Email', align: 'left' },
  { key: 'phone', label: 'Teléfono', align: 'left' },
  { key: 'role', label: 'Rol', align: 'left' },
  { key: 'created_at', label: 'Fecha de Registro', align: 'left' },
  { key: 'actions', label: 'Acciones', align: 'right' },
];

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>
