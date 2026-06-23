<template>
  <div class="relative inline-block" @mouseenter="show = true" @mouseleave="show = false">
    <slot></slot>
    <div
      v-if="show"
      class="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2"
    >
      {{ content }}
      <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  content: string
}>()

const show = ref(false)
</script>
