<script setup lang="ts">
interface Props {
  padding?: 'sm' | 'md' | 'lg' | 'none';
  shadow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: true,
});

const cardClasses = [
  'bg-white rounded-2xl',
  props.shadow ? 'shadow-lg' : '',
  props.padding === 'sm' ? 'p-4' : '',
  props.padding === 'md' ? 'p-8' : '',
  props.padding === 'lg' ? 'p-12' : '',
].filter(Boolean).join(' ');
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
