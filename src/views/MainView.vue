<template>
  <PageContainer>
    <div class="space-y-4 mt-4 px-4">
      <!-- Mock Feed Card -->
      <div v-for="feed in feeds" :key="feed.id" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
            <div>
              <p class="font-bold text-sm text-gray-900">{{ feed.user.nickname }}</p>
              <p class="text-xs text-gray-500">{{ feed.place.name }}</p>
            </div>
          </div>
          <button class="text-primary text-sm font-bold">팔로우</button>
        </div>
        <div
          class="aspect-square bg-gray-300 w-full flex items-center justify-center text-gray-500"
        >
          이미지 영역
        </div>
        <div class="p-4">
          <div class="flex space-x-4 mb-3">
            <button class="text-gray-600 hover:text-red-500 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </button>
            <button class="text-gray-600 hover:text-blue-500 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-900 mb-1">
            <span class="font-bold mr-1">{{ feed.user.nickname }}</span
            >{{ feed.content }}
          </p>
          <p class="text-xs text-gray-500 uppercase">{{ feed.createdAt }}</p>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageContainer from '@/components/common/PageContainer.vue'

const feeds = ref([
  {
    id: 1,
    user: { nickname: '맛집탐험가' },
    place: { name: '서울시청 카페' },
    content: '여기 커피 진짜 맛있어요! 분위기도 너무 좋고 뷰가 환상적입니다. 꼭 다시 와야겠어요.',
    createdAt: '2 HOURS AGO',
  },
  {
    id: 2,
    user: { nickname: '고양이집사' },
    place: { name: '무교동 브런치' },
    content: '주말 브런치로 딱입니다. 샌드위치가 일품이에요.',
    createdAt: '5 HOURS AGO',
  },
])
</script>
