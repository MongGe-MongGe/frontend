<template>
  <div class="relative w-full h-screen flex">
    <MapSidebar
      :search-results="searchResults"
      :selected-place-id="selectedPlace?.id"
      :filter-mode="filterMode"
      @update:filterMode="setFilterMode"
      @search="handleSearch"
      @select-place="handleSelectPlace"
      @select-group="handleSelectGroup"
      @tab-change="handleTabChange"
    />

    <div class="flex-1 relative h-full w-full">
      <!-- Kakao Map -->
      <KakaoMap
        ref="kakaoMapRef"
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
                class="p-2 rounded-full transition hover:bg-blue-50"
                :class="
                  selectedPlace.isSaved ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                "
              >
                <BookmarkIcon class="w-5 h-5" :class="{ 'fill-current': selectedPlace.isSaved }" />
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
              <div
                class="col-span-2 row-span-2 bg-gray-200 relative cursor-pointer hover:opacity-90 transition"
                @click="openImageModal(selectedPlaceImages[0])"
              >
                <img :src="selectedPlaceImages[0]" class="w-full h-full object-cover" />
              </div>
              <div
                v-if="selectedPlaceImages[1]"
                class="col-span-1 row-span-1 bg-gray-200 relative cursor-pointer hover:opacity-90 transition"
                @click="openImageModal(selectedPlaceImages[1])"
              >
                <img :src="selectedPlaceImages[1]" class="w-full h-full object-cover" />
              </div>
              <div
                v-if="selectedPlaceImages[2]"
                class="col-span-1 row-span-1 bg-gray-200 relative cursor-pointer hover:opacity-90 transition"
                @click="openImageModal(selectedPlaceImages[2])"
              >
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

            <!-- AI Review Summary -->
            <div
              v-if="selectedPlace?.reviewSummary?.summary"
              class="mb-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-gray-700 relative group"
            >
              <span class="font-bold text-blue-600 mr-1">✨ AI 요약:</span>
              {{ selectedPlace.reviewSummary.summary }}
              <button
                @click="generateSummary"
                class="absolute top-2 right-2 text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition"
                title="요약 다시 생성"
                :disabled="isGeneratingSummary"
              >
                <svg
                  v-if="!isGeneratingSummary"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div
              v-else-if="!isLoadingReviews && placeReviews.length > 0"
              class="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex flex-col items-center justify-center space-y-3"
            >
              <p class="text-gray-500 text-xs">아직 작성된 리뷰 요약이 없습니다.</p>
              <button
                @click="generateSummary"
                class="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                :disabled="isGeneratingSummary"
              >
                <svg
                  v-if="!isGeneratingSummary"
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 2L9 8H3L8 12L6 18L11 14L16 18L14 12L19 8H13L11 2Z" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{{ isGeneratingSummary ? '생성 중...' : '리뷰 요약 생성하기' }}</span>
              </button>
            </div>

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
                      {{ review.author?.handle ? review.author.handle : '' }}
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
      @saved="checkOrCreatePlace(selectedPlace)"
    />

    <!-- Image Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isImageModalOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          @click="isImageModalOpen = false"
        >
          <button
            class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            @click="isImageModalOpen = false"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <img
            :src="selectedImageForModal"
            class="max-w-full max-h-full object-contain select-none"
            @click.stop
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import KakaoMap from '@/components/KakaoMap.vue'
import MapSidebar from '@/components/common/MapSidebar.vue'
import SavePlaceModal from '@/components/place/SavePlaceModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useAlert } from '@/composables/useAlert'
import http from '@/api/http'
import { Bookmark as BookmarkIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const { showAlert } = useAlert()
const route = useRoute()
const router = useRouter()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const kakaoMapRef = ref<any>(null)

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

const isImageModalOpen = ref(false)
const selectedImageForModal = ref('')

const openImageModal = (imageUrl?: string) => {
  if (!imageUrl) return
  selectedImageForModal.value = imageUrl
  isImageModalOpen.value = true
}

const imageCache = new Map<string, string[]>()

const fetchPlaceImage = async (query: string) => {
  if (imageCache.has(query)) {
    selectedPlaceImages.value = imageCache.get(query) || []
    return
  }

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
      const images = data.items.map((item: any) => item.link)
      selectedPlaceImages.value = images
      imageCache.set(query, images)
    } else {
      imageCache.set(query, [])
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
    const res = await http.post('/api/places', {
      id: place.id,
      name: place.title || place.place_name,
      x: place.lng?.toString() || place.x?.toString(),
      y: place.lat?.toString() || place.y?.toString(),
      roadAddressName: place.address || place.address_name,
      categoryName: place.category_name,
    })
    if (selectedPlace.value && selectedPlace.value.id === place.id) {
      selectedPlace.value.isSaved = res.data.isSaved
      selectedPlace.value.reviewSummary = res.data.reviewSummary
    }
  } catch (error) {
    console.error('Failed to check/create place:', error)
  }
}

const fetchPlaceReviews = async (placeId: string) => {
  isLoadingReviews.value = true
  placeReviews.value = []
  try {
    const res = await http.get(`/api/places/${placeId}/reviews`)
    placeReviews.value = res.data?.content || []
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  } finally {
    isLoadingReviews.value = false
  }
}

const isGeneratingSummary = ref(false)

const generateSummary = async () => {
  if (!selectedPlace.value) return
  isGeneratingSummary.value = true
  try {
    const res = await http.put(`/api/places/summary/${selectedPlace.value.id}`)
    if (selectedPlace.value && selectedPlace.value.id === res.data.placeId) {
      selectedPlace.value.reviewSummary = res.data
    }
  } catch (error) {
    console.error('Failed to generate summary:', error)
    showAlert('리뷰 요약 생성에 실패했습니다.', 'error')
  } finally {
    isGeneratingSummary.value = false
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
  if (route.query.placeId && route.query.x && route.query.y) {
    const passedPlace = {
      id: route.query.placeId as string,
      title: route.query.name as string,
      place_name: route.query.name as string,
      x: route.query.x as string,
      y: route.query.y as string,
      lng: parseFloat(route.query.x as string),
      lat: parseFloat(route.query.y as string),
      address: route.query.address as string,
      roadAddressName: route.query.address as string,
      category_name: route.query.category as string,
      categoryName: route.query.category as string,
      isSaved: route.query.isSaved === 'true',
    }

    const center = { lat: passedPlace.lat, lng: passedPlace.lng }
    mapCenter.value = center
    currentViewCenter.value = center
    mapMarkers.value = [passedPlace]
    selectedPlace.value = passedPlace

    router.replace({ path: '/map' })
    initSearch(true)
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        mapCenter.value = center
        currentViewCenter.value = center
        initSearch(false)
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        initSearch(false) // 실패 시 기본 좌표로 검색
      },
    )
  } else {
    initSearch(false) // 미지원 시 기본 좌표로 검색
  }
})

const initSearch = (skipSearch = false) => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      if (!skipSearch) {
        handleSearch('맛집')
      }
    })
  } else {
    // 스크립트가 아직 로드되지 않았다면 약간 지연 후 재시도
    setTimeout(() => initSearch(skipSearch), 500)
  }
}

const handleCenterChanged = (center: { lat: number; lng: number }) => {
  currentViewCenter.value = center
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleBoundsChanged = (bounds: any) => {
  currentBounds.value = bounds
}

const filterMode = ref<'all' | 'restaurant' | 'cafe'>('all')
const currentKeyword = ref('맛집')

const activeSidebarTab = ref<'search' | 'users'>('search')

const handleTabChange = (tab: 'search' | 'users') => {
  activeSidebarTab.value = tab
  selectedPlace.value = null
  if (tab === 'users') {
    mapMarkers.value = []
  } else {
    handleSearch(currentKeyword.value)
  }
}

const setFilterMode = (mode: 'all' | 'restaurant' | 'cafe') => {
  filterMode.value = mode
  handleSearch(currentKeyword.value)
}

const handleSearch = (keyword: string) => {
  currentKeyword.value = keyword

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
  let pendingRequests = filterMode.value === 'all' ? 6 : 3

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

  // 필터에 맞게 카테고리별 병렬 검색 (최대 3페이지까지 호출)
  if (filterMode.value === 'all' || filterMode.value === 'restaurant') {
    for (let page = 1; page <= 3; page++) {
      ps.keywordSearch(keyword, callback, { ...searchOptions, category_group_code: 'FD6', page })
    }
  }

  if (filterMode.value === 'all' || filterMode.value === 'cafe') {
    for (let page = 1; page <= 3; page++) {
      ps.keywordSearch(keyword, callback, { ...searchOptions, category_group_code: 'CE7', page })
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSelectGroup = (places: any[]) => {
  const mappedPlaces = places.map((p) => ({
    ...p,
    lat: Number(p.lat || p.y),
    lng: Number(p.lng || p.x),
  }))
  mapMarkers.value = mappedPlaces
  selectedPlace.value = null

  if (mappedPlaces.length > 0) {
    // 마커가 여러 개일 경우 화면에 전부 보이도록 바운드 조절
    if (kakaoMapRef.value && kakaoMapRef.value.fitBounds) {
      kakaoMapRef.value.fitBounds(mappedPlaces)
    } else {
      mapCenter.value = {
        lat: mappedPlaces[0].lat,
        lng: mappedPlaces[0].lng,
      }
    }
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

  // 그룹 장소 선택 시 지도에 마커가 없으면 추가
  const existingMarker = mapMarkers.value.find((m) => m.id === place.id)
  if (!existingMarker) {
    mapMarkers.value = [
      ...mapMarkers.value,
      {
        lat: Number(place.y),
        lng: Number(place.x),
        title: place.place_name,
        address: place.address_name,
        phone: place.phone,
        category_name: place.category_name,
        id: place.id,
      },
    ]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMarkerClick = (markerData: any) => {
  selectedPlace.value = markerData
}
</script>
