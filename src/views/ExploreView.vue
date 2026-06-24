<template>
  <PageContainer>
    <div class="w-full max-w-md mx-auto border-x border-gray-100 bg-white min-h-screen relative flex flex-col">
      <div class="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <div class="relative">
          <input
            v-model="keyword"
            @keyup.enter="performSearch"
            type="text"
            class="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="유저나 식당을 검색해보세요"
          />
          <svg
            class="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <!-- Search Tabs -->
        <div class="flex mt-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 pb-2 text-center text-sm font-bold transition-colors"
            :class="
              activeTab === tab.id
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-400 border-b-2 border-transparent'
            "
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- User Search Results -->
      <div v-if="activeTab === 'users'">
        <div v-if="isLoading && users.length === 0" class="flex justify-center p-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="users.length === 0 && hasSearched" class="text-center p-10 text-gray-500">
          검색 결과가 없습니다.
        </div>
        <div v-else class="divide-y divide-gray-100">
          <UserListItem v-for="user in users" :key="user.id" :user="user" />
          <div v-if="users.length > 0 && !hasReachedEnd" class="py-4 flex justify-center">
            <button
              @click="loadMore"
              :disabled="isLoadingMore"
              class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-bold rounded-full transition disabled:opacity-50"
            >
              <span v-if="isLoadingMore">로딩중...</span>
              <span v-else>더보기</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Default Explore Content -->
      <div v-else class="p-4">
        <!-- Event Banner -->
        <div
          class="bg-gradient-to-r from-blue-400 to-primary rounded-xl p-6 text-white shadow-md mb-6"
        >
          <h2 class="text-lg font-bold">봄맞이 카페 투어 이벤트!</h2>
          <p class="text-sm mt-1 opacity-90">리뷰 남기고 아메리카노 받자</p>
        </div>

        <h3 class="font-bold text-gray-900 mb-3">인기 피드</h3>

        <!-- Tags -->
        <div class="flex space-x-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
          <button
            class="whitespace-nowrap px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-medium"
          >
            전체
          </button>
          <button
            class="whitespace-nowrap px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
          >
            #카페
          </button>
          <button
            class="whitespace-nowrap px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
          >
            #데이트
          </button>
          <button
            class="whitespace-nowrap px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
          >
            #가성비
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-3 gap-1">
          <div
            v-for="i in 12"
            :key="i"
            class="aspect-square bg-gray-300 relative group overflow-hidden cursor-pointer"
          >
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center"
            >
              <span class="text-white opacity-0 group-hover:opacity-100 font-bold transition"
                >♥ 12</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PageContainer from '@/components/common/PageContainer.vue'
import UserListItem from '@/components/user/UserListItem.vue'
import { searchUsers } from '@/api/user'

const tabs = [
  { id: 'users', name: '유저' },
  { id: 'reviews', name: '리뷰' },
  { id: 'places', name: '장소' },
]

const activeTab = ref('users')
const keyword = ref('')
const users = ref<any[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const hasSearched = ref(false)
const offset = ref(0)
const limit = 20
const hasReachedEnd = ref(false)

const performSearch = async () => {
  if (activeTab.value !== 'users' || !keyword.value.trim()) return

  isLoading.value = true
  hasSearched.value = true
  offset.value = 0
  hasReachedEnd.value = false

  try {
    const results = await searchUsers(keyword.value, limit, offset.value)
    users.value = results
    if (results.length < limit) {
      hasReachedEnd.value = true
    }
  } catch (error) {
    console.error('Failed to search users', error)
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (isLoadingMore.value || hasReachedEnd.value) return

  isLoadingMore.value = true
  offset.value += limit

  try {
    const results = await searchUsers(keyword.value, limit, offset.value)
    users.value = [...users.value, ...results]
    if (results.length < limit) {
      hasReachedEnd.value = true
    }
  } catch (error) {
    console.error('Failed to load more users', error)
    offset.value -= limit // rollback
  } finally {
    isLoadingMore.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'users' && keyword.value && !hasSearched.value) {
    performSearch()
  }
})
</script>
