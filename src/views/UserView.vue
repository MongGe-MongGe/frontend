<template>
  <PageContainer>
    <header
      class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10"
    >
      <h1 class="font-bold text-lg">{{ user?.handle || '@handle' }}</h1>
      <router-link v-if="isMyProfile" to="/settings" class="text-gray-900">
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
      </router-link>
      <div v-else class="w-6 h-6"></div>
    </header>

    <div class="p-4">
      <div class="flex items-center space-x-6 mb-6">
        <img v-if="user?.profileImage" :src="user.profileImage" class="w-20 h-20 bg-gray-200 rounded-full shrink-0 object-cover" alt="프로필 이미지">
        <div v-else class="w-20 h-20 bg-gray-200 rounded-full shrink-0"></div>
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
        <h2 class="font-bold text-gray-900">{{ user?.nickname || '유저명' }}</h2>
        <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">{{ (user as any)?.bio || '자기소개가 없습니다.' }}</p>
      </div>

      <div v-if="isMyProfile" class="flex space-x-2 mb-6">
        <router-link
          to="/settings/profile"
          class="flex-1 bg-gray-100 py-1.5 rounded font-bold text-sm hover:bg-gray-200 transition text-center"
        >
          프로필 편집
        </router-link>
        <button
          class="flex-1 bg-gray-100 py-1.5 rounded font-bold text-sm hover:bg-gray-200 transition"
        >
          프로필 공유
        </button>
      </div>
      <div v-else class="flex space-x-2 mb-6">
        <button
          class="flex-1 bg-blue-600 text-white py-1.5 rounded font-bold text-sm hover:bg-blue-700 transition"
        >
          팔로우
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getUserProfile } from '@/api/user'
import PageContainer from '@/components/common/PageContainer.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const user = ref<any>(null)
const isLoading = ref(true)

const isMyProfile = computed(() => {
  return authStore.user?.handle === user.value?.handle
})

const loadProfile = async () => {
  try {
    isLoading.value = true
    const handle = route.params.handle as string
    user.value = await getUserProfile(handle)
  } catch (error: any) {
    console.error('Failed to load user profile:', error)
    user.value = null
    // 유저를 찾을 수 없는 경우 (404 상태 코드인 경우)
    if (error.response?.status === 404) {
      router.push('/404')
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadProfile)
watch(() => route.params.handle, loadProfile)
</script>
