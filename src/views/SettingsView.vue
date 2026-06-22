<template>
  <PageContainer>
    <header
      class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10"
    >
      <div class="flex items-center">
        <button class="mr-4" @click="$router.back()">
          <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>
        <h1 class="font-bold text-lg">설정</h1>
      </div>
    </header>

    <div class="p-4 flex flex-col min-h-[calc(100vh-65px)]">
      <ul class="divide-y divide-gray-100 flex-1">
        <li>
          <router-link to="/settings/profile" class="flex justify-between items-center py-4">
            <span class="text-gray-900 font-medium">프로필 관리</span>
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </router-link>
        </li>
      </ul>

      <button
        @click="handleLogout"
        class="w-full py-4 text-center text-red-500 font-bold border-t border-gray-100 mt-auto hover:bg-red-50 transition rounded-xl"
      >
        로그아웃
      </button>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/common/PageContainer.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
