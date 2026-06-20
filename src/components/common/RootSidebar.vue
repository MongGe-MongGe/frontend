<template>
  <aside
    class="h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 shrink-0 overflow-hidden"
    :class="isExpanded ? 'w-64' : 'w-20'"
  >
    <!-- Header / Logo Area -->
    <div class="h-16 flex items-center border-b border-gray-100">
      <div class="w-20 shrink-0 flex justify-center items-center">
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!isExpanded"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            ></path>
          </svg>
        </button>
      </div>
      <h1
        class="text-xl font-extrabold text-primary whitespace-nowrap transition-opacity duration-300"
        :class="isExpanded ? 'opacity-100' : 'opacity-0'"
      >
        구루밍
      </h1>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 py-6 flex flex-col gap-2 px-2">
      <router-link
        to="/"
        class="flex items-center rounded-xl text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors overflow-hidden h-12"
        active-class="bg-blue-50 text-primary font-bold"
      >
        <div class="w-16 shrink-0 flex justify-center items-center h-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
        </div>
        <span
          class="whitespace-nowrap transition-opacity duration-300"
          :class="isExpanded ? 'opacity-100' : 'opacity-0'"
          >홈</span
        >
      </router-link>

      <router-link
        to="/explore"
        class="flex items-center rounded-xl text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors overflow-hidden h-12"
        active-class="bg-blue-50 text-primary font-bold"
      >
        <div class="w-16 shrink-0 flex justify-center items-center h-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <span
          class="whitespace-nowrap transition-opacity duration-300"
          :class="isExpanded ? 'opacity-100' : 'opacity-0'"
          >탐색</span
        >
      </router-link>

      <router-link
        to="/map"
        class="flex items-center rounded-xl text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors overflow-hidden h-12"
        active-class="bg-blue-50 text-primary font-bold"
      >
        <div class="w-16 shrink-0 flex justify-center items-center h-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            ></path>
          </svg>
        </div>
        <span
          class="whitespace-nowrap transition-opacity duration-300"
          :class="isExpanded ? 'opacity-100' : 'opacity-0'"
          >지도</span
        >
      </router-link>

      <router-link
        to="/board"
        class="flex items-center rounded-xl text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors overflow-hidden h-12"
        active-class="bg-blue-50 text-primary font-bold"
      >
        <div class="w-16 shrink-0 flex justify-center items-center h-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            ></path>
          </svg>
        </div>
        <span
          class="whitespace-nowrap transition-opacity duration-300"
          :class="isExpanded ? 'opacity-100' : 'opacity-0'"
          >게시판</span
        >
      </router-link>
    </nav>

    <!-- Bottom Auth links -->
    <div class="p-2 border-t border-gray-100 flex flex-col gap-2">
      <template v-if="authStore.token">
        <!-- 로그아웃 버튼 -->
        <button
          @click="handleLogout"
          class="flex items-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors overflow-hidden h-12 w-full text-left"
        >
          <div class="w-16 shrink-0 flex justify-center items-center h-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </div>
          <span
            class="whitespace-nowrap font-medium transition-opacity duration-300"
            :class="isExpanded ? 'opacity-100' : 'opacity-0'"
            >로그아웃</span
          >
        </button>

        <!-- 마이 페이지 버튼 -->
        <router-link
          v-if="authStore.user?.handle"
          :to="`/users/${authStore.user.handle}`"
          class="flex items-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors overflow-hidden h-12"
          active-class="bg-blue-50 text-primary font-bold"
        >
          <div class="w-16 shrink-0 flex justify-center items-center h-full">
            <img
              v-if="authStore.user?.profileImage"
              :src="authStore.user.profileImage"
              alt="프로필 이미지"
              class="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
          </div>
          <span
            class="whitespace-nowrap font-medium transition-opacity duration-300 flex items-center gap-1"
            :class="isExpanded ? 'opacity-100' : 'opacity-0'"
          >
            마이 페이지
            <Crown
              v-if="authStore.user?.role?.includes('ADMIN')"
              class="w-4 h-4 text-yellow-500 fill-yellow-500"
            />
          </span>
        </router-link>
      </template>

      <template v-else>
        <!-- 로그인 버튼 -->
        <router-link
          to="/login"
          class="flex items-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors overflow-hidden h-12"
        >
          <div class="w-16 shrink-0 flex justify-center items-center h-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              ></path>
            </svg>
          </div>
          <span
            class="whitespace-nowrap font-medium transition-opacity duration-300"
            :class="isExpanded ? 'opacity-100' : 'opacity-0'"
            >로그인</span
          >
        </router-link>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Crown } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const isExpanded = ref(false)

onMounted(() => {
  const savedState = localStorage.getItem('sidebarExpanded')
  if (savedState) {
    isExpanded.value = savedState === 'true'
  }
})

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
  localStorage.setItem('sidebarExpanded', String(isExpanded.value))
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
