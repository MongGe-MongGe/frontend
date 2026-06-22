<template>
  <div
    class="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition cursor-pointer"
    @click="goToProfile"
  >
    <div class="flex items-center space-x-3">
      <img
        :src="user.profileImage || '/default_profile_image.png'"
        @error="(e) => (e.target as HTMLImageElement).src = '/default_profile_image.png'"
        alt="Profile"
        class="w-12 h-12 rounded-full object-cover shrink-0"
      />

      <div class="flex flex-col text-left">
        <span class="font-bold text-gray-900 text-sm">{{ user.nickname }}</span>
        <span class="text-gray-500 text-xs">{{ user.handle }}</span>
      </div>
    </div>

    <!-- Follow Button -->
    <button
      v-if="!isMyProfile"
      @click.stop="toggleFollow"
      :class="[
        'px-4 py-1.5 rounded-lg text-sm font-bold transition min-w-[80px]',
        localIsFollowing
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          : 'bg-blue-600 text-white hover:bg-blue-700',
      ]"
    >
      {{ localIsFollowing ? '팔로잉' : user.isFollower ? '맞팔로우' : '팔로우' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { followUser, unfollowUser } from '@/api/user'

const props = defineProps<{
  user: {
    id: string
    nickname: string
    handle: string
    profileImage?: string
    isFollowing?: boolean
    isFollower?: boolean
  }
}>()

const router = useRouter()
const authStore = useAuthStore()

const localIsFollowing = ref(props.user.isFollowing)

const isMyProfile = computed(() => {
  return authStore.user?.id === props.user.id || authStore.user?.handle === props.user.handle
})

const goToProfile = () => {
  router.push(`/users/${props.user.handle.replace('@', '')}`)
}

const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    if (localIsFollowing.value) {
      await unfollowUser(props.user.id)
      localIsFollowing.value = false
    } else {
      await followUser(props.user.id)
      localIsFollowing.value = true
    }
  } catch (error) {
    console.error('Follow toggle error:', error)
    alert('팔로우 상태를 변경할 수 없습니다.')
  }
}
</script>
