<template>
  <PageContainer>
    <div class="bg-white p-4 sticky top-0 z-10 shadow-sm">
      <div class="relative">
        <input
          type="text"
          class="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
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
    </div>

    <div class="p-4">
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
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/common/PageContainer.vue'
</script>
