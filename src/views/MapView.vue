<template>
  <div class="relative w-full h-screen flex">
    <MapSidebar
      :search-results="searchResults"
      :selected-place-id="selectedPlace?.id"
      @search="handleSearch"
      @select-place="handleSelectPlace"
    />

    <div class="flex-1 relative h-full w-full">
      <!-- Kakao Map -->
      <KakaoMap
        :lat="mapCenter.lat"
        :lng="mapCenter.lng"
        :level="4"
        :markers="mapMarkers"
        :selected-id="selectedPlace?.id"
        @marker-click="handleMarkerClick"
        @center-changed="handleCenterChanged"
      />

      <!-- Bottom Sheet (Mock) -->
      <div
        v-if="selectedPlace"
        class="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-6 z-10 transition-transform duration-300"
      >
        <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1 min-w-0 pr-4">
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl font-extrabold text-gray-900 truncate">
                {{ selectedPlace.title }}
              </h2>
              <span
                v-if="
                  selectedPlace.category_name && selectedPlace.category_name.split('>').length > 1
                "
                class="text-sm text-gray-500 whitespace-nowrap"
              >
                {{ selectedPlace.category_name.split('>')[1].trim() }}
              </span>
            </div>
            <p class="text-sm text-gray-500 truncate">
              {{ selectedPlace.address || '카테고리 정보' }}
            </p>
          </div>
          <button
            @click="selectedPlace = null"
            class="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-700 mb-6 text-sm">{{ selectedPlace.phone || '전화번호 정보 없음' }}</p>
        <div class="flex space-x-3">
          <button
            @click="openSaveModal"
            class="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            저장
          </button>
          <button
            class="flex-[2] bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-200"
          >
            식당 상세 보기
          </button>
        </div>
      </div>
    </div>

    <!-- Save Place Modal -->
    <SavePlaceModal
      v-if="isSaveModalOpen"
      :place="selectedPlace"
      @close="isSaveModalOpen = false"
      @saved="isSaveModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KakaoMap from '@/components/KakaoMap.vue'
import MapSidebar from '@/components/common/MapSidebar.vue'
import SavePlaceModal from '@/components/place/SavePlaceModal.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const mapCenter = ref({ lat: 37.5665, lng: 126.978 }) // 검색 및 최초 로드 시 설정할 맵 중심
const currentViewCenter = ref({ lat: 37.5665, lng: 126.978 }) // 현재 사용자가 보고 있는 지도의 중심 좌표
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapMarkers = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchResults = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedPlace = ref<any>(null)

const isSaveModalOpen = ref(false)

const openSaveModal = () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    return
  }
  isSaveModalOpen.value = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ps: any = null

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        mapCenter.value = center
        currentViewCenter.value = center
        initSearch()
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        initSearch() // 실패 시 기본 좌표로 검색
      },
    )
  } else {
    initSearch() // 미지원 시 기본 좌표로 검색
  }
})

const initSearch = () => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      handleSearch('맛집')
    })
  } else {
    // 스크립트가 아직 로드되지 않았다면 약간 지연 후 재시도
    setTimeout(initSearch, 500)
  }
}

const handleCenterChanged = (center: { lat: number; lng: number }) => {
  currentViewCenter.value = center
}

const handleSearch = (keyword: string) => {
  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    console.error('Kakao Places Service is not available.')
    alert('지도 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  if (!ps) {
    ps = new window.kakao.maps.services.Places()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mergedData: any[] = []
  let pendingRequests = 6 // 최대 3페이지 * 2개 카테고리

  const processResults = () => {
    if (mergedData.length === 0) {
      searchResults.value = []
      mapMarkers.value = []
      alert('검색 결과 중 식당이나 카페가 존재하지 않습니다.')
      return
    }

    // 중복 제거 (API가 같은 결과를 중복 반환하는 경우 방지)
    const uniqueMap = new Map()
    mergedData.forEach((item) => uniqueMap.set(item.id, item))
    let uniqueData = Array.from(uniqueMap.values())

    // 거리순 정렬 (API 결과에 포함된 distance 활용)
    uniqueData.sort((a, b) => Number(a.distance) - Number(b.distance))

    // 카카오 정책(최대 3페이지)에 맞게 가장 가까운 순으로 45개까지만 자르기
    uniqueData = uniqueData.slice(0, 45)

    searchResults.value = uniqueData
    mergedData = uniqueData // 재사용을 위해 할당

    // Update markers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapMarkers.value = mergedData.map((place: any) => ({
      lat: Number(place.y),
      lng: Number(place.x),
      title: place.place_name,
      address: place.address_name,
      phone: place.phone,
      category_name: place.category_name,
      id: place.id,
    }))

    // Pan to the closest result
    if (mergedData.length > 0) {
      mapCenter.value = {
        lat: Number(mergedData[0].y),
        lng: Number(mergedData[0].x),
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callback = (data: any, status: any) => {
    // ZERO_RESULT 등 오류가 반환되어도 펜딩 횟수는 차감
    if (status === window.kakao.maps.services.Status.OK) {
      mergedData = [...mergedData, ...data]
    }
    pendingRequests--
    if (pendingRequests === 0) {
      processResults()
    }
  }

  // 현재 지도 중심 좌표 기반 거리순 정렬 옵션
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchOptions: any = {
    location: new window.kakao.maps.LatLng(
      currentViewCenter.value.lat,
      currentViewCenter.value.lng,
    ),
    sort: window.kakao.maps.services.SortBy.DISTANCE,
  }

  // 음식점(FD6)과 카페(CE7) 카테고리로 좁혀서 거리순 병렬 검색 (최대 3페이지까지 호출)
  for (let page = 1; page <= 3; page++) {
    ps.keywordSearch(keyword, callback, { ...searchOptions, category_group_code: 'FD6', page })
    ps.keywordSearch(keyword, callback, { ...searchOptions, category_group_code: 'CE7', page })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSelectPlace = (place: any) => {
  mapCenter.value = {
    lat: Number(place.y),
    lng: Number(place.x),
  }
  selectedPlace.value = {
    id: place.id,
    title: place.place_name,
    address: place.address_name,
    phone: place.phone,
    category_name: place.category_name,
    lat: Number(place.y),
    lng: Number(place.x),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMarkerClick = (markerData: any) => {
  selectedPlace.value = markerData
}
</script>
