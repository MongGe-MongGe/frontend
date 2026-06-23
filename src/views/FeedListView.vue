<template>
  <PageContainer>
    <header class="p-4 border-b border-gray-100 flex items-center sticky top-0 bg-white z-10">
      <button @click="router.back()" class="mr-4 text-gray-900">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <h1 class="font-bold text-lg text-gray-900">피드</h1>
    </header>

    <div class="w-full flex flex-col items-center py-4 px-4 space-y-6 pb-20">
      <FeedCard 
        v-for="feed in feeds" 
        :key="feed.id" 
        :feed="feed" 
        :id="`feed-${feed.id}`"
        @edit="openEditModal" 
        @delete="deleteFeed"
      />
      <div v-if="feeds.length === 0 && !isLoading" class="text-center text-gray-500 py-10">
        표시할 피드가 없습니다.
      </div>
      <div v-if="isLoading" class="text-center py-4">
        <span class="animate-spin h-6 w-6 border-2 border-gray-900 border-t-transparent rounded-full inline-block"></span>
      </div>
    </div>

    <ReviewWriteWidget ref="writeWidget" @success="handleReviewSuccess" />
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFeedStore } from '@/stores/feed'
import PageContainer from '@/components/common/PageContainer.vue'
import FeedCard from '@/components/review/FeedCard.vue'
import ReviewWriteWidget from '@/components/review/ReviewWriteWidget.vue'

const route = useRoute()
const router = useRouter()
const feedStore = useFeedStore()

const contextId = computed(() => route.params.context as string)
const targetReviewId = computed(() => route.params.targetReviewId as string)

const feeds = computed(() => feedStore.getContext(contextId.value).items)
const isLoading = computed(() => feedStore.getContext(contextId.value).isLoading)

const writeWidget = ref<any>(null)

const openEditModal = (feedData: any) => {
  if (writeWidget.value) {
    writeWidget.value.openModal(feedData)
  }
}

const deleteFeed = async (id: string) => {
  await feedStore.removeFeed(id)
}

const handleReviewSuccess = () => {
  // If we are in user context, maybe reload that user context
  if (contextId.value.startsWith('user_')) {
    const userId = contextId.value.replace('user_', '')
    feedStore.loadUserReviews(userId, true)
  } else if (contextId.value === 'home') {
    feedStore.loadMyFeeds(true)
  }
}

const loadFeedsIfNeeded = async () => {
  if (feeds.value.length === 0) {
    if (contextId.value.startsWith('user_')) {
      const userId = contextId.value.replace('user_', '')
      await feedStore.loadUserReviews(userId)
    } else if (contextId.value === 'home') {
      await feedStore.loadMyFeeds()
    }
  }
}

const scrollToTarget = () => {
  if (targetReviewId.value) {
    const el = document.getElementById(`feed-${targetReviewId.value}`)
    if (el) {
      // Offset for sticky header
      const yOffset = -60 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}

onMounted(async () => {
  await loadFeedsIfNeeded()
  await nextTick()
  // Wait a bit more for images to render to ensure correct scroll position
  setTimeout(scrollToTarget, 100)
})
</script>
