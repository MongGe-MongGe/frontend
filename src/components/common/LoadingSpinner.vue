<template>
  <div class="flex items-center justify-center" :class="sizeClass">
    <div
      class="rounded-full border-2 border-current border-t-transparent animate-spin"
      :class="spinnerSizeClass"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const sizeClass = computed(() => ({
  'p-2': props.size === 'sm',
  'p-4': props.size === 'md',
  'p-8': props.size === 'lg',
}))

const spinnerSizeClass = computed(() => ({
  'h-4 w-4': props.size === 'sm',
  'h-6 w-6': props.size === 'md',
  'h-8 w-8': props.size === 'lg',
}))
</script>
