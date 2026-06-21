<template>
  <button 
    @click="$emit('click')"
    class="fixed bottom-8 right-8 md:bottom-12 md:right-12 bg-primary hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 flex items-center justify-center group"
    aria-label="리뷰 작성하기"
  >
    <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits(['click'])
</script>
