<template>
  <PageContainer>
    <div v-if="feeds.length > 0" class="w-full flex flex-col items-center space-y-4 mt-4 px-4 pb-20">
      <FeedCard 
        v-for="feed in feeds" 
        :key="feed.id" 
        :feed="feed" 
        @edit="openEditModal" 
        @delete="deleteFeed"
      />
    </div>
    
    <div v-else class="flex flex-col items-center justify-center py-32 px-4 text-center h-full">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">아직 피드가 없습니다</h3>
      <p class="text-gray-500 mb-6 max-w-sm">
        관심 있는 유저를 팔로우하고<br />새로운 리뷰와 맛집 소식을 받아보세요!
      </p>
      <button
        @click="router.push('/explore')"
        class="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors shadow-sm"
      >
        유저 탐색하기
      </button>
    </div>
    <ReviewWriteWidget ref="writeWidget" @success="handleReviewSuccess" />
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFeedStore } from '@/stores/feed'
import PageContainer from '@/components/common/PageContainer.vue'
import FeedCard from '@/components/review/FeedCard.vue'
import ReviewWriteWidget from '@/components/review/ReviewWriteWidget.vue'

const router = useRouter()
const authStore = useAuthStore()
const feedStore = useFeedStore()

const writeWidget = ref<any>(null)

const feeds = computed(() => {
  return feedStore.getContext('home').items
})

const openEditModal = (feedData: any) => {
  if (writeWidget.value) {
    writeWidget.value.openModal(feedData)
  }
}

const deleteFeed = async (id: string) => {
  await feedStore.removeFeed(id)
}

const handleReviewSuccess = () => {
  // reload feeds
  feedStore.loadMyFeeds(true)
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    feedStore.loadMyFeeds(true)
  }
})
</script>
