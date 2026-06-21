<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
        <h2 class="text-lg font-bold text-gray-900">장소 검색</h2>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Search Input -->
      <div class="p-4 border-b border-gray-100 shrink-0">
        <div class="relative">
          <input
            v-model="keyword"
            @keyup.enter="searchPlaces"
            type="text"
            placeholder="식당 또는 카페 이름을 검색하세요"
            class="w-full bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-4 transition-all"
          />
          <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Results List -->
      <div class="flex-1 overflow-y-auto bg-gray-50 p-2">
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="results.length > 0" class="space-y-2">
          <button
            v-for="place in results"
            :key="place.id"
            @click="selectPlace(place)"
            class="w-full text-left p-4 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 transition-colors"
          >
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-bold text-gray-900">{{ place.place_name }}</h3>
              <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg whitespace-nowrap ml-2">
                {{ place.category_group_name }}
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ place.address_name }}</p>
          </button>
        </div>
        <div v-else-if="searched" class="text-center py-12 text-gray-500">
          <p>검색 결과가 없습니다.</p>
        </div>
        <div v-else class="text-center py-12 text-gray-400">
          <p>리뷰를 남길 장소를 검색해주세요.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['close', 'select'])

const keyword = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)

let ps: any = null

const searchPlaces = () => {
  if (!keyword.value.trim()) return

  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    alert('지도 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  if (!ps) {
    ps = new window.kakao.maps.services.Places()
  }

  loading.value = true
  searched.value = true
  results.value = []

  let mergedData: any[] = []
  let pendingRequests = 2

  const processResults = () => {
    loading.value = false
    results.value = mergedData
  }

  const callback = (data: any, status: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
      mergedData = [...mergedData, ...data]
    }
    pendingRequests--
    if (pendingRequests === 0) {
      processResults()
    }
  }

  // 음식점(FD6)과 카페(CE7) 카테고리로 좁혀서 병렬 검색
  ps.keywordSearch(keyword.value, callback, { category_group_code: 'FD6' })
  ps.keywordSearch(keyword.value, callback, { category_group_code: 'CE7' })
}

const selectPlace = (place: any) => {
  // 백엔드 PlaceRequest 모델에 맞춰서 전달
  const placeData = {
    id: place.id,
    name: place.place_name,
    x: place.x,
    y: place.y,
    roadAddressName: place.road_address_name || place.address_name,
    categoryName: place.category_group_name || '음식점',
  }
  emit('select', placeData)
}
</script>
