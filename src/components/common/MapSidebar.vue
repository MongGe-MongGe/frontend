<template>
  <aside class="h-full w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
    <!-- Search and Filter Area -->
    <div class="flex flex-col px-4 pt-4 pb-3 border-b border-gray-100 shrink-0 gap-3">
      <form @submit.prevent="handleSearch" class="relative w-full">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full bg-gray-100 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="검색어를 입력하세요"
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
      <template v-else>
        <div
          v-for="(place, index) in paginatedResults"
          :key="index"
          @click="$emit('select-place', place)"
          :class="[
            'p-4 rounded-xl shadow-sm border cursor-pointer transition',
            selectedPlaceId === place.id
              ? 'bg-blue-50 border-blue-200'
              : 'bg-white border-gray-100 hover:bg-gray-50',
          ]"
        >
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-bold text-gray-900 truncate">{{ place.place_name }}</h3>
            <span
              v-if="parseCategories(place.category_name)[1]"
              class="text-xs text-gray-500 whitespace-nowrap"
            >
              {{ parseCategories(place.category_name)[1] }}
            </span>
          </div>
          <p class="text-xs text-gray-500 truncate">{{ place.address_name }}</p>
          <p v-if="place.phone" class="text-xs text-blue-500 mt-1">{{ place.phone }}</p>
        </div>
      </template>
    </div>

    <!-- Pagination Controls (Fixed at Bottom) -->
    <div
      class="flex justify-center items-center space-x-4 py-3 px-4 border-t border-gray-200 bg-white shrink-0"
      v-if="searchResults.length > 0 && totalPages > 1"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 text-sm rounded-md transition"
        :class="
          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
        "
      >
        이전
      </button>
      <span class="text-sm text-gray-600 font-medium">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 text-sm rounded-md transition"
        :class="
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        "
      >
        다음
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchResults: any[]
  selectedPlaceId?: string | null
}>()

const emit = defineEmits(['search', 'select-place'])

const searchQuery = ref('')

const handleSearch = () => {
  const query = searchQuery.value.trim() || '맛집'
  emit('search', query)
}

// 카테고리 파싱 함수
const parseCategories = (categoryStr: string) => {
  if (!categoryStr) return []
  return categoryStr.split('>').map((c) => c.trim())
}

// Pagination logic
const currentPage = ref(1)
const itemsPerPage = 15

const totalPages = computed(() => {
  return Math.ceil(props.searchResults.length / itemsPerPage)
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.searchResults.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 검색 결과가 변경되면 첫 페이지로 리셋
watch(
  () => props.searchResults,
  () => {
    currentPage.value = 1
  },
  { deep: true },
)
</script>
