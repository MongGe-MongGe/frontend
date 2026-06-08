<template>
  <PageContainer>
    <header
      class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10"
    >
      <h1 class="font-bold text-lg">{{ user.handle }}</h1>
      <button class="text-gray-900">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      </button>
    </header>

    <div class="p-4">
      <div class="flex items-center space-x-6 mb-6">
        <div class="w-20 h-20 bg-gray-200 rounded-full shrink-0"></div>
        <div class="flex-1 flex justify-between text-center">
          <div>
            <div class="font-bold text-lg">12</div>
            <div class="text-xs text-gray-500">리뷰</div>
          </div>
          <div>
            <div class="font-bold text-lg">342</div>
            <div class="text-xs text-gray-500">팔로워</div>
          </div>
          <div>
            <div class="font-bold text-lg">150</div>
            <div class="text-xs text-gray-500">팔로잉</div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <h2 class="font-bold text-gray-900">{{ user.nickname }}</h2>
        <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">{{ user.bio }}</p>
      </div>

      <div class="flex space-x-2 mb-6">
        <button
          class="flex-1 bg-gray-100 py-1.5 rounded font-bold text-sm hover:bg-gray-200 transition"
        >
          프로필 편집
        </button>
        <button
          class="flex-1 bg-gray-100 py-1.5 rounded font-bold text-sm hover:bg-gray-200 transition"
        >
          프로필 공유
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-t border-gray-200">
      <button class="flex-1 py-3 text-center border-b-2 border-gray-900 font-bold">
        리뷰 피드
      </button>
      <button class="flex-1 py-3 text-center text-gray-500 font-medium hover:text-gray-700">
        맛집 그룹
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-3 gap-1">
      <div v-for="i in 9" :key="i" class="aspect-square bg-gray-300"></div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageContainer from '@/components/common/PageContainer.vue'

const user = ref({
  handle: '@food_lover',
  nickname: '푸드러버',
  bio: '세상의 모든 맛집을 찾아서 🍕🍔🍣',
})
</script>
