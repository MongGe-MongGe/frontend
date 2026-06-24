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
        @bounds-changed="handleBoundsChanged"
      />

      <!-- Right Top Modal -->
      <div
        v-if="selectedPlace"
        class="absolute top-4 right-4 w-[calc(100%-32px)] max-w-md bg-white rounded-2xl shadow-xl p-6 z-10 transition-all duration-300 max-h-[calc(100vh-32px)] flex flex-col"
      >
        <!-- Fixed Header Area -->
        <div class="flex items-center gap-2 mb-3 shrink-0 pb-3 border-b border-gray-100">
          <h2 class="text-xl font-extrabold text-gray-900 truncate">
            {{ selectedPlace.title }}
          </h2>
          <div class="flex space-x-1 ml-auto shrink-0 items-center">
            <!-- Bookmark Button -->
            <div class="relative group flex items-center justify-center">
              <button
                @click="openSaveModal"
                class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  ></path>
                </svg>
              </button>
              <span
                class="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50"
                >저장</span
              >
            </div>

            <!-- Detail View Button -->
            <div class="relative group flex items-center justify-center">
              <button
                @click="openKakaoDetail"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </button>
              <span
                class="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50"
                >상세 보기</span
              >
            </div>

            <!-- Close Button -->
            <div class="relative group flex items-center justify-center">
              <button
                @click="selectedPlace = null"
                class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <span
                class="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50"
                >닫기</span
              >
            </div>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div
          class="overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1"
        >
          <div class="mb-4">
            <span
              v-if="
                selectedPlace.category_name && selectedPlace.category_name.split('>').length > 1
              "
              class="text-sm text-gray-500 whitespace-nowrap block mb-1"
            >
              {{ selectedPlace.category_name.split('>')[1].trim() }}
            </span>
            <p class="text-sm text-gray-500 truncate">
              {{ selectedPlace.address || '카테고리 정보' }}
            </p>
            <p class="text-gray-700 text-sm mt-1">
              {{ selectedPlace.phone || '전화번호 정보 없음' }}
            </p>
          </div>

          <!-- Image Area -->
          <div class="w-full aspect-[9/4] rounded-xl overflow-hidden mb-4 bg-gray-100 relative">
            <div v-if="isImageLoading" class="absolute inset-0 bg-gray-200 animate-pulse"></div>
            <div
              v-else-if="selectedPlaceImages.length > 0"
              class="grid grid-cols-3 grid-rows-2 gap-1 w-full h-full"
            >
              <div class="col-span-2 row-span-2 bg-gray-200 relative">
                <img :src="selectedPlaceImages[0]" class="w-full h-full object-cover" />
              </div>
              <div v-if="selectedPlaceImages[1]" class="col-span-1 row-span-1 bg-gray-200 relative">
                <img :src="selectedPlaceImages[1]" class="w-full h-full object-cover" />
              </div>
              <div v-if="selectedPlaceImages[2]" class="col-span-1 row-span-1 bg-gray-200 relative">
                <img :src="selectedPlaceImages[2]" class="w-full h-full object-cover" />
              </div>
            </div>
            <div
              v-else
              class="flex items-center justify-center w-full h-full text-gray-400 text-sm"
            >
              이미지가 없습니다
            </div>
          </div>

          <hr class="my-4 border-gray-200" />

          <!-- Reviews Area -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">리뷰</h3>
            <div v-if="isLoadingReviews" class="text-sm text-gray-500 text-center py-4">
              리뷰를 불러오는 중...
            </div>
            <div
              v-else-if="placeReviews.length === 0"
              class="text-sm text-gray-500 text-center py-4"
            >
              아직 작성된 리뷰가 없습니다.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="review in placeReviews"
                :key="review.id"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <!-- Review Header: profile + nickname -->
                <div class="flex items-center gap-2 p-3 border-b border-gray-100">
                  <img
                    :src="review.author?.profileImage || '/default_profile_image.png'"
                    @error="
                      (e: Event) =>
                        ((e.target as HTMLImageElement).src = '/default_profile_image.png')
                    "
                    class="w-9 h-9 rounded-full object-cover bg-gray-200 shrink-0"
                    alt="profile"
                  />
                  <div>
                    <p class="font-bold text-sm text-gray-900">
                      {{ review.author?.nickname || review.userNickname }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ review.author?.handle ? '@' + review.author.handle : '' }}
                    </p>
                  </div>
                </div>

                <!-- Review Images: 3:2 ratio grid same as place images -->
                <div
                  v-if="review.images && review.images.length > 0"
                  class="w-full aspect-[9/4] bg-gray-100 overflow-hidden"
                >
                  <div v-if="review.images.length === 1" class="w-full h-full">
                    <img
                      :src="review.images[0]"
                      class="w-full h-full object-cover"
                      alt="review image"
                    />
                  </div>
                  <div v-else class="grid grid-cols-3 grid-rows-2 gap-1 w-full h-full">
                    <div class="col-span-2 row-span-2 bg-gray-200">
                      <img :src="review.images[0]" class="w-full h-full object-cover" />
                    </div>
                    <div v-if="review.images[1]" class="col-span-1 row-span-1 bg-gray-200">
                      <img :src="review.images[1]" class="w-full h-full object-cover" />
                    </div>
                    <div v-if="review.images[2]" class="col-span-1 row-span-1 bg-gray-200">
                      <img :src="review.images[2]" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <!-- Review Content -->
                <div class="px-3 pt-2 pb-1 text-sm">
                  <span class="font-bold text-gray-900 mr-1">{{
                    review.author?.nickname || review.userNickname
                  }}</span>
                  <span class="text-gray-800 whitespace-pre-wrap">{{ review.content }}</span>
                </div>

                <!-- Footer: heart | date + stars -->
                <div class="px-3 py-2 flex items-center justify-between border-t border-gray-50">
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {{ review.likeCount ?? 0 }}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-400">
                      {{
                        review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString('ko-KR', {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          : ''
                      }}
                    </span>
                    <div class="flex items-center gap-0.5">
                      <svg
                        v-for="s in 5"
                        :key="s"
                        class="w-3.5 h-3.5"
                        :class="
                          s <= (review.ratingScore || 0) ? 'text-yellow-400' : 'text-gray-200'
                        "
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { ref, onMounted, watch } from 'vue'
import KakaoMap from '@/components/KakaoMap.vue'
import MapSidebar from '@/components/common/MapSidebar.vue'
import SavePlaceModal from '@/components/place/SavePlaceModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useAlert } from '@/composables/useAlert'

const authStore = useAuthStore()
const { showAlert } = useAlert()

const mapCenter = ref({ lat: 37.5665, lng: 126.978 }) // 검색 및 최초 로드 시 설정할 맵 중심
const currentViewCenter = ref({ lat: 37.5665, lng: 126.978 }) // 현재 사용자가 보고 있는 지도의 중심 좌표
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentBounds = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapMarkers = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchResults = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedPlace = ref<any>(null)
const selectedPlaceImages = ref<string[]>([])
const isImageLoading = ref(false)
const isLoadingReviews = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const placeReviews = ref<any[]>([])

const isSaveModalOpen = ref(false)

const fetchPlaceImage = async (query: string) => {
  isImageLoading.value = true
  selectedPlaceImages.value = []
  try {
    const res = await fetch(
      `/naver-api/v1/search/image?query=${encodeURIComponent(query)}&display=3`,
      {
        headers: {
          'X-Naver-Client-Id': import.meta.env.VITE_NAVER_CLIENT_ID || '',
          'X-Naver-Client-Secret': import.meta.env.VITE_NAVER_CLIENT_SECRET || '',
        },
      },
    )
    const data = await res.json()
    if (data && data.items && data.items.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectedPlaceImages.value = data.items.map((item: any) => item.link)
    }
  } catch (error) {
    console.error('Failed to fetch image:', error)
  } finally {
    isImageLoading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkOrCreatePlace = async (place: any) => {
  try {
    const backendHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (authStore.isAuthenticated && authStore.token) {
      backendHeaders['Authorization'] = `Bearer ${authStore.token}`
    }
    await fetch('/api/places', {
      method: 'POST',
      headers: backendHeaders,
      body: JSON.stringify({
        id: place.id,
        name: place.title || place.place_name,
        x: place.lng?.toString() || place.x?.toString(),
        y: place.lat?.toString() || place.y?.toString(),
        roadAddressName: place.address || place.address_name,
        categoryName: place.category_name,
      }),
    })
  } catch (error) {
    console.error('Failed to check/create place:', error)
  }
}

const fetchPlaceReviews = async (placeId: string) => {
  isLoadingReviews.value = true
  placeReviews.value = []
  try {
    const res = await fetch(`/api/places/${placeId}/reviews`)
    if (res.ok) {
      const data = await res.json()
      placeReviews.value = data.content || []
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  } finally {
    isLoadingReviews.value = false
  }
}

const openKakaoDetail = () => {
  if (selectedPlace.value && selectedPlace.value.id) {
    window.open(`https://place.map.kakao.com/${selectedPlace.value.id}`, '_blank')
  }
}

watch(selectedPlace, async (newPlace) => {
  if (newPlace) {
    if (newPlace.title) {
      fetchPlaceImage(newPlace.title)
    }
    await checkOrCreatePlace(newPlace)
    fetchPlaceReviews(newPlace.id)
  } else {
    selectedPlaceImages.value = []
    placeReviews.value = []
  }
})

const openSaveModal = () => {
  if (!authStore.isAuthenticated) {
    showAlert('로그인이 필요합니다.', 'warning')
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleBoundsChanged = (bounds: any) => {
  currentBounds.value = bounds
}

const handleSearch = (keyword: string) => {
  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    console.error('Kakao Places Service is not available.')
    showAlert('지도 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'warning')
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
      showAlert('검색 결과 중 식당이나 카페가 존재하지 않습니다.', 'info')
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

  // 지도 중심 좌표 기반 검색 옵션 (정확도순 정렬로 뷰포트 내외부 골고루 분산)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchOptions: any = {
    location: new window.kakao.maps.LatLng(
      currentViewCenter.value.lat,
      currentViewCenter.value.lng,
    ),
    sort: window.kakao.maps.services.SortBy.ACCURACY,
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
