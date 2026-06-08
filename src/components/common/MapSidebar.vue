<template>
  <aside class="h-full w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
    <!-- Search Area -->
    <div class="p-4 border-b border-gray-100 shrink-0">
      <form @submit.prevent="handleSearch" class="relative">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full bg-gray-100 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="장소, 식당 검색"
        />
        <button type="submit" class="absolute right-3 top-2.5 text-gray-500 hover:text-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </form>
    </div>

    <!-- Search Results -->
    <div class="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
      <div v-if="searchResults.length === 0" class="text-center text-gray-500 mt-10 text-sm">
        검색 결과가 없습니다.
      </div>
      <div
        v-else
        v-for="(place, index) in searchResults"
        :key="index"
        @click="$emit('select-place', place)"
        class="p-4 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-blue-50 transition"
      >
        <h3 class="font-bold text-gray-900">{{ place.place_name }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ place.address_name }}</p>
        <p v-if="place.phone" class="text-xs text-blue-500 mt-1">{{ place.phone }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchResults: any[]
}>()

const emit = defineEmits(['search', 'select-place'])

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value)
  }
}
</script>
