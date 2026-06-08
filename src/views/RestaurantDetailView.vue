<template>
  <div class="bg-gray-50 flex-1 pb-20">
    <!-- Header Image & Info -->
    <header class="relative h-64 bg-gray-300">
      <button
        @click="$router.back()"
        class="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow z-10 hover:bg-white transition"
      >
        <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>
      <div class="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-5">
        <h1 class="text-3xl font-extrabold text-white">{{ place.name }}</h1>
        <p class="text-white/90 text-sm mt-2">{{ place.category }} • 평균 평점 4.5 • 리뷰 128</p>
      </div>
    </header>

    <!-- Tabs -->
    <div class="flex bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <button class="flex-1 py-3 font-bold border-b-2 border-primary text-primary text-center">
        식당 정보
      </button>
      <button class="flex-1 py-3 font-medium text-gray-500 text-center hover:text-gray-700">
        상세 정보
      </button>
      <button class="flex-1 py-3 font-medium text-gray-500 text-center hover:text-gray-700">
        식당 리뷰
      </button>
    </div>

    <!-- Info Content -->
    <div class="p-5 bg-white mt-2 shadow-sm">
      <h3 class="font-bold text-gray-900 mb-3 text-lg">기본 정보</h3>
      <p class="text-gray-700 text-sm flex items-start mb-4">
        <svg
          class="w-5 h-5 mr-3 text-gray-400 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <span>
          {{ place.address }}
          <button class="text-primary text-xs ml-2 font-bold hover:underline">복사</button>
        </span>
      </p>
      <p class="text-gray-700 text-sm flex items-start mb-4">
        <svg
          class="w-5 h-5 mr-3 text-gray-400 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        {{ place.description }}
      </p>

      <!-- Mini Map Placeholder -->
      <div
        class="w-full h-32 bg-gray-200 rounded-lg mt-4 flex items-center justify-center text-gray-500 text-sm font-medium"
      >
        지도 영역
      </div>
    </div>

    <!-- Fixed Action Button (Write Review) -->
    <div class="fixed bottom-20 right-4 z-20">
      <button
        class="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition shadow-blue-300"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const place = ref({
  name: '서울시청 카페',
  category: '카페',
  address: '서울 중구 세종대로 110',
  description: '최고급 원두를 사용하는 도심 속 힐링 카페입니다.',
})
</script>
