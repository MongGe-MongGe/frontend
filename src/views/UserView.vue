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
      <button
        v-else-if="user"
        @click="toggleFollow"
        :class="[
          'px-4 py-1.5 rounded-full font-bold text-xs transition',
          user?.isFollowing
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            : 'bg-blue-600 text-white hover:bg-blue-700',
        ]"
      >
        {{ user?.isFollowing ? '팔로잉' : user?.isFollower ? '맞팔로우' : '팔로우' }}
      </button>
    </header>

    <div class="p-4">
      <div class="flex items-center space-x-6 mb-6">
        <img
          :src="user?.profileImage || '/default_profile_image.png'"
          @error="(e) => (e.target as HTMLImageElement).src = '/default_profile_image.png'"
          class="w-20 h-20 bg-gray-200 rounded-full shrink-0 object-cover"
          alt="프로필 이미지"
        />
        <div class="flex-1 flex justify-between text-center">
          <div>
            <div class="font-bold text-lg">{{ reviews.length }}</div>
            <div class="text-xs text-gray-500">리뷰</div>
          </div>
          <div
            class="cursor-pointer hover:opacity-70 transition"
            @click="openFollowModal('followers')"
          >
            <div class="font-bold text-lg">{{ user?.followerCount || 0 }}</div>
            <div class="text-xs text-gray-500">팔로워</div>
          </div>
          <div
            class="cursor-pointer hover:opacity-70 transition"
            @click="openFollowModal('followings')"
          >
            <div class="font-bold text-lg">{{ user?.followingCount || 0 }}</div>
            <div class="text-xs text-gray-500">팔로잉</div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <h2 class="font-bold text-gray-900">{{ user?.nickname || '유저명' }}</h2>
        <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">
          {{ user?.bio || '자기소개가 없습니다.' }}
        </p>
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
    <div v-if="reviews.length > 0" class="grid grid-cols-3 gap-1">
      <router-link
        v-for="review in reviews"
        :key="review.id"
        :to="`/feed/user_${user?.id}/${review.id}`"
        class="aspect-square bg-gray-200 relative group overflow-hidden block"
      >
        <img
          v-if="review.images && review.images.length > 0"
          :src="review.images[0]"
          class="w-full h-full object-cover"
        />
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center px-4">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
      <h3 class="font-bold text-gray-900 text-lg mb-2">아직 작성된 리뷰가 없습니다</h3>
      <p class="text-sm text-gray-500 mb-6">
        {{
          isMyProfile
            ? '우측 하단의 작성 버튼을 눌러 첫 리뷰를 남겨보세요!'
            : '이 유저는 아직 리뷰를 작성하지 않았습니다.'
        }}
      </p>
    </div>
    
    <!-- Floating Review Write Button -->
    <ReviewWriteWidget v-if="isMyProfile" ref="writeWidget" @success="onReviewCreated" />

    <!-- Follow List Modal -->
    <FollowListModal 
      v-if="isModalOpen && user" 
      :user-id="user.id" 
      :type="modalType" 
      @close="closeFollowModal" 
    />
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFeedStore } from '@/stores/feed'
import { getUserProfile, followUser, unfollowUser } from '@/api/user'
import PageContainer from '@/components/common/PageContainer.vue'
import FollowListModal from '@/components/user/FollowListModal.vue'
import ReviewWriteWidget from '@/components/review/ReviewWriteWidget.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const feedStore = useFeedStore()

const writeWidget = ref<any>(null)

interface UserProfile {
  id: string
  nickname: string
  handle: string
  profileImage?: string
  bio?: string
  followerCount: number
  followingCount: number
  isFollowing: boolean
  isFollower: boolean
}

const user = ref<UserProfile | null>(null)
const isLoading = ref(true)
const reviews = computed(() => {
  if (!user.value) return []
  return feedStore.getContext(`user_${user.value.id}`).items
})

const onReviewCreated = () => {
  if (user.value) {
    feedStore.loadUserReviews(user.value.id, true)
  }
}

const isMyProfile = computed(() => {
  return authStore.user?.handle === user.value?.handle
})

const isModalOpen = computed(() => {
  return !!route.query.modal
})
const modalType = computed<'followers' | 'followings'>(() => {
  return (route.query.modal as 'followers' | 'followings') || 'followers'
})

const openFollowModal = (type: 'followers' | 'followings') => {
  if (!user.value) return
  router.push({ query: { ...route.query, modal: type } })
}

const closeFollowModal = () => {
  const query = { ...route.query }
  delete query.modal
  router.push({ query })
}

const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    return
  }

  if (!user.value) return

  try {
    if (user.value.isFollowing) {
      await unfollowUser(user.value.id)
      user.value.isFollowing = false
      user.value.followerCount--
    } else {
      await followUser(user.value.id)
      user.value.isFollowing = true
      user.value.followerCount++
    }
  } catch (error) {
    console.error('Follow toggle error:', error)
    alert('팔로우 상태를 변경할 수 없습니다.')
  }
}

const loadProfile = async () => {
  try {
    isLoading.value = true
    const rawHandle = route.params.handle as string
    const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`
    user.value = await getUserProfile(handle)
    
    if (user.value) {
      if (feedStore.getContext(`user_${user.value.id}`).items.length === 0) {
        await feedStore.loadUserReviews(user.value.id)
      }
    }
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
