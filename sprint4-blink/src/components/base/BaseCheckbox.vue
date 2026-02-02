<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<template>
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" :checked="modelValue" :disabled="disabled" @change="updateValue"
      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:cursor-not-allowed disabled:opacity-50" />
    <span v-if="label" class="ml-2 text-sm text-gray-700" :class="{ 'opacity-50': disabled }">
      {{ label }}
    </span>
    <span v-else class="ml-2 text-sm text-gray-700">
      <slot />
    </span>
  </label>
</template>
