<template>
  <aside class="h-full w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 relative">
    <!-- Post-it Tabs -->
    <div class="absolute -right-12 top-4 flex flex-col gap-2 z-40">
      <button
        @click="activeTab = 'search'"
        class="w-12 h-12 bg-white border-y border-r border-gray-200 rounded-r-xl flex items-center justify-center shadow-sm relative group transition-colors"
        :class="
          activeTab === 'search'
            ? 'text-primary bg-blue-50'
            : 'text-gray-400 hover:bg-gray-50 hover:text-primary'
        "
      >
        <Search class="w-5 h-5" />
        <span
          class="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none"
          >탐색</span
        >
      </button>

      <button
        @click="activeTab = 'users'"
        class="w-12 h-12 bg-white border-y border-r border-gray-200 rounded-r-xl flex items-center justify-center shadow-sm relative group transition-colors"
        :class="
          activeTab === 'users'
            ? 'text-primary bg-blue-50'
            : 'text-gray-400 hover:bg-gray-50 hover:text-primary'
        "
      >
        <Users class="w-5 h-5" />
        <span
          class="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none"
          >맛집 그룹</span
        >
      </button>

      <!-- Category Filter Buttons -->
      <div class="mt-4 flex flex-col gap-3 items-center">
        <!-- All -->
        <div class="relative group flex items-center justify-center">
          <button
            class="p-2.5 rounded-full shadow-md border border-gray-100 transition"
            :class="
              filterMode === 'all'
                ? 'text-blue-600 bg-blue-100'
                : 'text-gray-500 bg-white hover:text-blue-600 hover:bg-blue-50'
            "
            @click="$emit('update:filterMode', 'all')"
          >
            <List class="w-5 h-5" />
          </button>
          <span
            class="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none"
            >전체</span
          >
        </div>
        <!-- Restaurant -->
        <div class="relative group flex items-center justify-center">
          <button
            class="p-2.5 rounded-full shadow-md border border-gray-100 transition"
            :class="
              filterMode === 'restaurant'
                ? 'text-orange-600 bg-orange-100'
                : 'text-gray-500 bg-white hover:text-orange-600 hover:bg-orange-50'
            "
            @click="$emit('update:filterMode', 'restaurant')"
          >
            <Utensils class="w-5 h-5" />
          </button>
          <span
            class="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none"
            >식당</span
          >
        </div>
        <!-- Cafe -->
        <div class="relative group flex items-center justify-center">
          <button
            class="p-2.5 rounded-full shadow-md border border-gray-100 transition"
            :class="
              filterMode === 'cafe'
                ? 'text-amber-700 bg-amber-100'
                : 'text-gray-500 bg-white hover:text-amber-700 hover:bg-amber-50'
            "
            @click="$emit('update:filterMode', 'cafe')"
          >
            <Coffee class="w-5 h-5" />
          </button>
          <span
            class="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none"
            >카페</span
          >
        </div>
      </div>
    </div>

    <!-- Search Tab Content -->
    <template v-if="activeTab === 'search'">
      <!-- Search Area -->
      <div class="flex flex-col px-4 pt-4 pb-3 border-b border-gray-100 shrink-0 gap-3">
        <form @submit.prevent="handleSearch" class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full bg-gray-100 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="검색어를 입력하세요"
          />
          <button type="submit" class="absolute right-3 top-2.5 text-gray-500 hover:text-primary">
            <Search class="w-5 h-5" />
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
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
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
    </template>

    <!-- Users Tab Content -->
    <template v-else-if="activeTab === 'users'">
      <div class="flex flex-col px-4 pt-4 pb-3 border-b border-gray-100 shrink-0 bg-white">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-800">내 그룹만 보기</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="showMyGroupsOnly" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
            ></div>
          </label>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 bg-gray-50">
        <div v-if="isLoadingGroups" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div
          v-else-if="paginatedUserGroups.length === 0"
          class="text-center text-gray-500 mt-10 text-sm"
        >
          맛집 그룹이 없습니다.
        </div>
        <template v-else>
          <div
            v-for="group in paginatedUserGroups"
            :key="group.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
            :class="expandedGroupId === group.id ? 'ring-1 ring-primary border-primary' : ''"
          >
            <div
              class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              @click="toggleGroupAccordion(group)"
            >
              <div class="flex items-center gap-3 mb-2">
                <img
                  :src="group.user?.profileImage || '/default_profile_image.png'"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900">{{ group.user?.nickname }}</span>
                  <span class="text-xs text-gray-500">{{ group.user?.handle }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800 truncate">{{ group.name }}</h3>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    class="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium"
                    >{{ group.goodPlaceCount || 0 }}곳</span
                  >
                  <ChevronDown v-if="expandedGroupId !== group.id" class="w-4 h-4 text-gray-400" />
                  <ChevronUp v-else class="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <!-- Accordion Content -->
            <div
              v-show="expandedGroupId === group.id"
              class="border-t border-gray-100 bg-gray-50 p-3 space-y-2 max-h-[300px] overflow-y-auto no-scrollbar"
            >
              <div v-if="isLoadingGroupPlaces[group.id]" class="flex justify-center py-4">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>
              <div
                v-else-if="!groupPlacesCache[group.id] || groupPlacesCache[group.id]?.length === 0"
                class="text-center text-xs text-gray-500 py-4"
              >
                저장된 맛집이 없습니다.
              </div>
              <div
                v-else
                v-for="place in groupPlacesCache[group.id]"
                :key="place.id"
                class="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 transition"
                @click="$emit('select-place', mapPlaceToKakaoFormat(place.place || place))"
              >
                <h4 class="text-xs font-bold text-gray-900 truncate">
                  {{ (place.place || place).name || (place.place || place).placeName }}
                </h4>
                <p class="text-[10px] text-gray-500 truncate mt-0.5">
                  {{
                    (place.place || place).addressName ||
                    (place.place || place).address ||
                    (place.place || place).roadAddressName
                  }}
                </p>
                <p
                  v-if="(place.place || place).categoryName"
                  class="text-[10px] text-blue-500 mt-1"
                >
                  {{
                    parseCategories((place.place || place).categoryName)[1] ||
                    parseCategories((place.place || place).categoryName)[0]
                  }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Groups Pagination -->
      <div
        class="flex justify-center items-center space-x-4 py-3 px-4 border-t border-gray-200 bg-white shrink-0"
        v-if="filteredUserGroups.length > 0 && totalGroupPages > 1"
      >
        <button
          @click="prevGroupPage"
          :disabled="currentGroupPage === 1"
          class="px-3 py-1 text-sm rounded-md transition"
          :class="
            currentGroupPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          "
        >
          이전
        </button>
        <span class="text-sm text-gray-600 font-medium"
          >{{ currentGroupPage }} / {{ totalGroupPages }}</span
        >
        <button
          @click="nextGroupPage"
          :disabled="currentGroupPage === totalGroupPages"
          class="px-3 py-1 text-sm rounded-md transition"
          :class="
            currentGroupPage === totalGroupPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          "
        >
          다음
        </button>
      </div>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Users, ChevronDown, ChevronUp, List, Utensils, Coffee } from 'lucide-vue-next'
import { getFollowingGroups } from '@/api/group'
import { getGroupGoodPlaces } from '@/api/goodPlace'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchResults: any[]
  selectedPlaceId?: string | null
  filterMode?: 'all' | 'restaurant' | 'cafe'
}>()

const emit = defineEmits<{
  (e: 'search', query: string): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'select-place', place: any): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'select-group', places: any[]): void
  (e: 'update:filterMode', mode: 'all' | 'restaurant' | 'cafe'): void
  (e: 'tab-change', tab: 'search' | 'users'): void
}>()

const activeTab = ref<'search' | 'users'>('search')

watch(activeTab, (newTab) => {
  emit('tab-change', newTab)
  if (newTab === 'users') {
    loadUserGroups()
  }
})

// --- Search Logic ---
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

// Pagination logic for Search
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

// --- Users Groups Logic ---
const isLoadingGroups = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userGroups = ref<any[]>([])

const showMyGroupsOnly = ref(false)

const filteredUserGroups = computed(() => {
  if (!showMyGroupsOnly.value) return userGroups.value
  return userGroups.value.filter((group) => group.user?.id === authStore.user?.id)
})

const loadUserGroups = async () => {
  if (userGroups.value.length > 0 || isLoadingGroups.value) return
  if (!authStore.user?.id) return

  isLoadingGroups.value = true
  try {
    const followingGroupsRes = await getFollowingGroups()

    if (Array.isArray(followingGroupsRes)) {
      userGroups.value = followingGroupsRes
    } else {
      userGroups.value = []
    }
  } catch (error) {
    console.error('Failed to load user groups:', error)
  } finally {
    isLoadingGroups.value = false
  }
}

// Group Pagination logic
const currentGroupPage = ref(1)
const groupsPerPage = 15

const totalGroupPages = computed(() => Math.ceil(filteredUserGroups.value.length / groupsPerPage))

const paginatedUserGroups = computed(() => {
  const start = (currentGroupPage.value - 1) * groupsPerPage
  const end = start + groupsPerPage
  return filteredUserGroups.value.slice(start, end)
})

watch(showMyGroupsOnly, () => {
  currentGroupPage.value = 1
})

const nextGroupPage = () => {
  if (currentGroupPage.value < totalGroupPages.value) currentGroupPage.value++
}
const prevGroupPage = () => {
  if (currentGroupPage.value > 1) currentGroupPage.value--
}

// Accordion Logic
const expandedGroupId = ref<string | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupPlacesCache = ref<Record<string, any[]>>({})
const isLoadingGroupPlaces = ref<Record<string, boolean>>({})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleGroupAccordion = async (group: any) => {
  if (expandedGroupId.value === group.id) {
    expandedGroupId.value = null
    return
  }

  expandedGroupId.value = group.id

  if (!groupPlacesCache.value[group.id]) {
    isLoadingGroupPlaces.value[group.id] = true
    try {
      const placesRes = await getGroupGoodPlaces(group.user.id, group.id)
      // Assume API might return paginated content or an array directly
      groupPlacesCache.value[group.id] = placesRes.content || placesRes || []
    } catch (e) {
      console.error(e)
    } finally {
      isLoadingGroupPlaces.value[group.id] = false
    }
  }

  // 그룹 선택 시 그룹 내 장소들을 마커 포맷으로 변환하여 부모 컴포넌트에 전달
  emit(
    'select-group',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (groupPlacesCache.value[group.id] || []).map((p: any) => mapPlaceToKakaoFormat(p.place || p)),
  )
}

// Convert backend place format to kakao map format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapPlaceToKakaoFormat = (place: any) => {
  return {
    id: place.id || place.placeId,
    place_name: place.name || place.placeName,
    address_name: place.addressName || place.address || place.roadAddressName,
    category_name: place.categoryName || place.category,
    x: place.x || place.lng,
    y: place.y || place.lat,
    phone: place.phone,
  }
}
</script>
