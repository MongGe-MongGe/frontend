<template>
  <div
    class="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition cursor-pointer"
    @click="goToProfile"
  >
    <div class="flex items-center space-x-3">
      <img
        :src="user.profileImage || '/default_profile_image.png'"
        @error="(e) => ((e.target as HTMLImageElement).src = '/default_profile_image.png')"
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
        'relative px-4 py-1.5 rounded-lg text-sm font-bold transition min-w-[80px] overflow-visible',
        localIsFollowing
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          : 'bg-blue-600 text-white hover:bg-blue-700',
      ]"
    >
      {{ localIsFollowing ? '팔로잉' : user.isFollower ? '맞팔로우' : '팔로우' }}

      <div
        v-for="p in pawParticles"
        :key="p.id"
        class="absolute pointer-events-none text-pink-400 flex items-center justify-center animate-particle top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        :style="`--tx: ${p.x}px; --ty: ${p.y}px; --rot: ${p.rot}deg; --scale: ${p.scale};`"
      >
        <PawPrint class="w-4 h-4 fill-current" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { followUser, unfollowUser } from '@/api/user'
import { useAlert } from '@/composables/useAlert'
import { PawPrint } from 'lucide-vue-next'
import { usePawParticles } from '@/composables/usePawParticles'

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
const { showAlert } = useAlert()
const { pawParticles, spawnPawParticles } = usePawParticles()

const localIsFollowing = ref(props.user.isFollowing)

const isMyProfile = computed(() => {
  return authStore.user?.id === props.user.id || authStore.user?.handle === props.user.handle
})

const goToProfile = () => {
  router.push(`/users/${props.user.handle.replace('@', '')}`)
}

const isTogglingFollow = ref(false)

const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    showAlert('로그인이 필요합니다.', 'warning')
    return
  }
  if (isTogglingFollow.value) return

  const prevFollowing = localIsFollowing.value
  localIsFollowing.value = !prevFollowing
  isTogglingFollow.value = true

  if (!prevFollowing) {
    spawnPawParticles()
  }

  try {
    if (prevFollowing) {
      await unfollowUser(props.user.id)
    } else {
      await followUser(props.user.id)
    }
  } catch (error) {
    localIsFollowing.value = prevFollowing
    console.error('팔로우 전환 실패:', error)
    showAlert('팔로우 상태를 변경할 수 없습니다.', 'error')
  } finally {
    isTogglingFollow.value = false
  }
}
</script>
