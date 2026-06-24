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
        <template v-if="hasSearched">
          <!-- Search Results for Reviews -->
          <div v-if="isLoadingFeeds && searchedReviews.length === 0" class="flex justify-center p-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <div v-else-if="searchedReviews.length === 0" class="text-center p-10 text-gray-500">
            검색 결과가 없습니다.
          </div>
          <div v-else class="grid grid-cols-3 gap-1 pb-4">
            <router-link
              v-for="feed in searchedReviews"
              :key="feed.id"
              :to="`/feed/search/${feed.id}`"
              class="aspect-square bg-gray-300 relative group overflow-hidden block"
            >
              <img v-if="feed.images && feed.images.length > 0" :src="feed.images[0]" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-white font-bold">♥ {{ feed.likeCount || 0 }}</span>
              </div>
            </router-link>
          </div>
          <div v-if="searchedReviews.length > 0 && !hasReachedEnd" class="py-4 flex justify-center">
            <button
              @click="loadMore"
              :disabled="isLoadingMore"
              class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-bold rounded-full transition disabled:opacity-50"
            >
              <span v-if="isLoadingMore">로딩중...</span>
              <span v-else>더보기</span>
            </button>
          </div>
        </template>
        
        <template v-else>
          <h3 class="font-bold text-gray-900 mb-3">인기 피드</h3>
          <!-- Grid -->
          <div v-if="isLoadingFeeds" class="flex justify-center p-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <div v-else-if="popularFeeds.length === 0" class="text-center p-10 text-gray-500">
            인기 피드가 없습니다.
          </div>
          <div v-else class="grid grid-cols-3 gap-1">
            <router-link
              v-for="feed in popularFeeds"
              :key="feed.id"
              :to="`/feed/popular/${feed.id}`"
              class="aspect-square bg-gray-300 relative group overflow-hidden block"
            >
              <img v-if="feed.images && feed.images.length > 0" :src="feed.images[0]" class="w-full h-full object-cover" />
              <div
                class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span class="text-white font-bold"
                  >♥ {{ feed.likeCount || 0 }}</span
                >
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import PageContainer from '@/components/common/PageContainer.vue'
import UserListItem from '@/components/user/UserListItem.vue'
import { searchUsers } from '@/api/user'
import { useFeedStore } from '@/stores/feed'

const feedStore = useFeedStore()

const tabs = [
  { id: 'reviews', name: '리뷰' },
  { id: 'users', name: '유저' },
]

const activeTab = ref('reviews')
const keyword = ref('')
const users = ref<any[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const hasSearched = ref(false)
const offset = ref(0)
const limit = 20
const hasReachedEnd = ref(false)

const performSearch = async () => {
  if (!keyword.value.trim()) return

  isLoading.value = true
  hasSearched.value = true
  offset.value = 0
  hasReachedEnd.value = false

  try {
    if (activeTab.value === 'users') {
      const results = await searchUsers(keyword.value, limit, offset.value)
      users.value = results
      if (results.length < limit) {
        hasReachedEnd.value = true
      }
    } else if (activeTab.value === 'reviews') {
      await feedStore.loadSearchReviews(keyword.value, true)
      if (!feedStore.getContext('search').hasMore) {
        hasReachedEnd.value = true
      }
    }
  } catch (error) {
    console.error('Failed to search', error)
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (isLoadingMore.value || hasReachedEnd.value) return

  isLoadingMore.value = true
  offset.value += limit

  try {
    if (activeTab.value === 'users') {
      const results = await searchUsers(keyword.value, limit, offset.value)
      users.value = [...users.value, ...results]
      if (results.length < limit) {
        hasReachedEnd.value = true
      }
    } else if (activeTab.value === 'reviews') {
      await feedStore.loadSearchReviews(keyword.value)
      if (!feedStore.getContext('search').hasMore) {
        hasReachedEnd.value = true
      }
    }
  } catch (error) {
    console.error('Failed to load more', error)
    if (activeTab.value === 'users') offset.value -= limit // rollback
  } finally {
    isLoadingMore.value = false
  }
}

watch(activeTab, () => {
  if (keyword.value) {
    performSearch()
  }
})

const popularFeeds = computed(() => feedStore.getContext('popular').items)
const searchedReviews = computed(() => feedStore.getContext('search').items)
const isLoadingFeeds = computed(() => feedStore.getContext('popular').isLoading || feedStore.getContext('search').isLoading)

onMounted(() => {
  if (popularFeeds.value.length === 0) {
    feedStore.loadPopularReviews(true)
  }
})
</script>
