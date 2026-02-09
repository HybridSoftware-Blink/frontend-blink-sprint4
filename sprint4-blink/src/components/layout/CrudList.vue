<template>
  <div class="w-80 bg-gray-50 rounded-md border border-gray-200 p-4 min-h-0 flex flex-col">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold">{{ title }}</h3>
      <BaseButton size="sm" variant="secondary" @click="toggleCreate">
        {{ showForm ? 'Cancelar' : 'Nuevo' }}
      </BaseButton>
    </div>

    <div v-if="showForm" class="mb-4">
      <slot name="form"></slot>
    </div>

    <div class="overflow-auto flex-1">
      <ul class="space-y-2 p-1">
        <li v-for="item in paginatedItems" :key="getKey(item)" class="flex items-center justify-between">
          <div class="flex-1">
            <button @click="$emit('select', item)" class="w-full text-left p-2 rounded hover:bg-white/50">
              <div class="font-medium">{{ item.name || item.label || getKey(item) }}</div>
              <div class="text-xs text-gray-500">ID: {{ getKey(item) }}</div>
            </button>
          </div>
          <div class="ml-2">
            <BaseButton size="sm" variant="tertiary" @click="$emit('delete', item)" title="Eliminar">
              <TrashIcon class="w-4 h-4" />
            </BaseButton>
          </div>
        </li>
      </ul>
    </div>

    <div class="mt-2 flex items-center justify-between text-sm">
      <div class="text-gray-600">Mostrando {{ startItem }}-{{ endItem }} de {{ totalItems }}</div>
      <div class="flex items-center gap-2">
        <button :disabled="currentPage===1" @click="prevPage" class="px-2 py-1 bg-gray-100 rounded disabled:opacity-50">Prev</button>
        <button v-for="p in pages" :key="p" @click="goToPage(p)" :class="['px-2 py-1 rounded', p===currentPage? 'bg-blue-600 text-white' : 'bg-gray-100']">{{ p }}</button>
        <button :disabled="currentPage===totalPages" @click="nextPage" class="px-2 py-1 bg-gray-100 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BaseButton } from '../base'
import { TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  items: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 10 },
  title: { type: String, default: 'Items' },
  showForm: { type: Boolean, default: false },
  itemKey: { type: String, default: 'id' },
})

const emit = defineEmits(['select', 'delete', 'toggle-create', 'page-changed'])

const currentPage = ref(1)

const totalItems = computed(() => (props.items || []).length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / props.pageSize)))
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return (props.items || []).slice(start, start + props.pageSize)
})

const startItem = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * props.pageSize + 1))
const endItem = computed(() => Math.min(totalItems.value, currentPage.value * props.pageSize))

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    emit('page-changed', currentPage.value)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    emit('page-changed', currentPage.value)
  }
}

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
    emit('page-changed', currentPage.value)
  }
}

watch(() => props.items, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

function toggleCreate() {
  emit('toggle-create')
}

function getKey(item: any) {
  return item?.[props.itemKey] ?? item?.id ?? JSON.stringify(item)
}
</script>
