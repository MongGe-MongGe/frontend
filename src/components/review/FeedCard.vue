<template>
  <!-- Outer wrapper to center the inner flex box -->
  <div class="flex justify-center w-full mb-6">
    <!-- Inner box that wraps feed and comment side-by-side -->
    <div
      class="flex flex-col lg:flex-row gap-4 transition-all duration-300 w-full max-w-[1250px] justify-center"
    >
      <!-- Left: Original Feed Card -->
      <div
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-full max-w-md shrink-0 mx-auto lg:mx-0"
      >
        <!-- Header -->
        <header class="flex items-center justify-between p-3 border-b border-gray-100">
          <div
            @click="goToUserProfile(feed.author.handle)"
            class="flex items-center space-x-3 cursor-pointer group"
          >
            <img
              :src="feed.author.profileImage || '/default_profile_image.png'"
              @error="(e) => ((e.target as HTMLImageElement).src = '/default_profile_image.png')"
              class="w-10 h-10 rounded-full object-cover bg-gray-200 group-hover:opacity-80 transition"
              alt="profile"
            />
            <div>
              <h3 class="font-bold text-sm text-gray-900 group-hover:underline">
                {{ feed.author.nickname }}
              </h3>
              <p class="text-xs text-gray-500">{{ feed.author.handle }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="relative">
            <button
              v-if="isMyFeed"
              @click="toggleDropdown"
              class="p-2 text-gray-500 hover:text-gray-800 transition rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal class="w-5 h-5" />
            </button>
            <button
              v-else
              @click="toggleFollow"
              :class="[
                'px-4 py-1.5 text-xs font-bold rounded-full transition',
                isFollowing
                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600',
              ]"
            >
              {{ isFollowing ? '팔로잉' : '팔로우' }}
            </button>

            <!-- Kebab Dropdown -->
            <div
              v-if="isMyFeed && isDropdownOpen"
              class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20"
            >
              <button
                @click="handleEdit"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                수정
              </button>
              <button
                @click="handleDelete"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition"
              >
                삭제
              </button>
            </div>
          </div>
        </header>

        <!-- Image Carousel -->
        <div class="relative w-full aspect-square bg-gray-100 overflow-hidden group">
          <div
            class="flex transition-transform duration-300 ease-in-out h-full w-full"
            :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
          >
            <div v-for="(img, idx) in feed.images" :key="idx" class="w-full h-full flex-shrink-0">
              <img :src="img" class="w-full h-full object-cover" alt="review image" />
            </div>
          </div>

          <!-- Prev/Next buttons -->
          <button
            v-if="currentImageIndex > 0"
            @click="currentImageIndex--"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-500/40 flex items-center justify-center text-white shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-gray-600/60"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            v-if="currentImageIndex < feed.images.length - 1"
            @click="currentImageIndex++"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-500/40 flex items-center justify-center text-white shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-gray-600/60"
          >
            <ChevronRight class="w-5 h-5" />
          </button>

          <!-- Dots -->
          <div
            v-if="feed.images.length > 1"
            class="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5"
          >
            <div
              v-for="(_, idx) in feed.images"
              :key="idx"
              class="w-1.5 h-1.5 rounded-full transition-colors border-none outline-none"
              :class="idx === currentImageIndex ? 'bg-white' : 'bg-white/50'"
            ></div>
          </div>
        </div>

        <!-- Place Info Box -->
        <div
          class="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between"
        >
          <div
            @click="goToMap"
            class="flex items-start space-x-2 cursor-pointer hover:opacity-80 transition flex-1"
          >
            <MapPin class="w-5 h-5 text-gray-400 mt-0.5" />
            <div class="flex flex-col">
              <span class="font-bold text-sm text-gray-900">{{ feed.place.name }}</span>
              <span class="text-xs text-gray-500 mt-1 flex items-center">
                <Star class="w-3 h-3 text-yellow-500 mr-1 fill-current" />
                {{ feed.ratingScore }}.0
              </span>
            </div>
          </div>
          <!-- Place Save (Bookmark) -->
          <button
            @click="openSaveModal"
            class="flex items-center group transition"
            :class="feed.place?.isSaved ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'"
          >
            <div class="p-2 rounded-full transition group-hover:bg-blue-50">
              <Bookmark class="w-5 h-5" :class="{ 'fill-current': feed.place?.isSaved }" />
            </div>
          </button>
        </div>

        <!-- Review Content -->
        <div class="px-4 py-3 text-sm">
          <span class="font-bold text-gray-900 mr-2">{{ feed.author.nickname }}</span>
          <span class="text-gray-800 whitespace-pre-wrap">{{ feed.content }}</span>
        </div>

        <!-- Twitter style Action Footer -->
        <div
          class="px-2 pb-2 flex items-center justify-between text-gray-500 border-t border-gray-50 pt-2"
        >
          <div class="flex items-center space-x-6">
            <!-- Like -->
            <button
              @click="toggleLike"
              :disabled="isLiking"
              class="flex items-center group transition relative"
              :class="{ 'opacity-60 cursor-not-allowed': isLiking }"
            >
              <div
                class="relative flex items-center justify-center p-2 rounded-full group-hover:bg-red-50 group-hover:text-red-500 transition"
                :class="localLikedByMe ? 'text-red-500' : ''"
              >
                <Heart
                  class="w-5 h-5 relative z-10"
                  :class="localLikedByMe ? 'fill-current' : ''"
                />
                <div
                  v-for="p in heartParticles"
                  :key="p.id"
                  class="absolute pointer-events-none text-red-500 flex items-center justify-center animate-particle"
                  :style="`--tx: ${p.x}px; --ty: ${p.y}px; --rot: ${p.rot}deg; --scale: ${p.scale};`"
                >
                  <Heart class="w-4 h-4 fill-current" />
                </div>
              </div>
              <span
                class="text-sm font-medium pl-1 group-hover:text-red-500 transition"
                :class="localLikedByMe ? 'text-red-500' : ''"
                >{{ localLikeCount }}</span
              >
            </button>

            <!-- Comment -->
            <button
              @click="isCommentOpen = !isCommentOpen"
              class="flex items-center group transition"
            >
              <div
                class="p-2 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition"
              >
                <MessageCircle class="w-5 h-5" />
              </div>
              <span class="text-sm font-medium pl-1 group-hover:text-blue-500 transition">{{
                feed.commentCount || 0
              }}</span>
            </button>
          </div>

          <!-- Date & User Rating Stars -->
          <div class="flex items-center px-2">
            <!-- Date -->
            <span class="text-xs text-gray-400 uppercase tracking-wider mr-3">
              {{ formatDate(feed.createdAt) }}
            </span>
            <!-- User Rating Stars -->
            <div class="flex">
              <Star
                v-for="s in 5"
                :key="s"
                class="w-4 h-4 fill-current"
                :class="s <= feed.ratingScore ? 'text-yellow-400' : 'text-gray-200'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Comment Box -->
      <Transition name="slide-out">
        <div
          v-if="isCommentOpen"
          class="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-md shrink-0 mx-auto lg:mx-0 flex flex-col overflow-hidden"
          style="height: 650px"
        >
          <CommentBox
            :feedId="feed.id"
            :commentCount="feed.commentCount"
            @close="isCommentOpen = false"
            @update:commentCount="updateCommentCount"
          />
        </div>
      </Transition>
    </div>
  </div>

  <SavePlaceModal
    v-if="isSaveModalOpen"
    :place="feed.place"
    @close="isSaveModalOpen = false"
    @saved="onPlaceSaved"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFeedStore } from '@/stores/feed'
import { useAlert } from '@/composables/useAlert'
import { useConfirm } from '@/composables/useConfirm'
import { followUser, unfollowUser } from '@/api/user'
import { likeReview, unlikeReview } from '@/api/review'
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Heart,
  MessageCircle,
  Bookmark,
} from 'lucide-vue-next'
import SavePlaceModal from '@/components/place/SavePlaceModal.vue'
import CommentBox from '@/components/review/CommentBox.vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  feed: any
}>()

const emit = defineEmits(['edit', 'delete'])

const router = useRouter()
const authStore = useAuthStore()
const feedStore = useFeedStore()
const { showAlert } = useAlert()
const { confirm } = useConfirm()

const currentImageIndex = ref(0)
const isDropdownOpen = ref(false)
const isSaveModalOpen = ref(false)
const isCommentOpen = ref(false)
const isLiking = ref(false)

const updateCommentCount = (c: number) => {
  if (props.feed) {
    // eslint-disable-next-line vue/no-mutating-props
    props.feed.commentCount = c
  }
}

const onPlaceSaved = () => {
  if (props.feed && props.feed.place) {
    // eslint-disable-next-line vue/no-mutating-props
    props.feed.place.isSaved = true
  }
}

// 로컬 좋아요 상태 (Optimistic UI용)
const localLikedByMe = ref(props.feed.likedByMe ?? false)
const localLikeCount = ref(props.feed.likeCount ?? 0)

// 서버에서 데이터가 새로 오면 로컬 상태도 동기화
watch(
  () => [props.feed.likedByMe, props.feed.likeCount],
  ([likedByMe, likeCount]) => {
    localLikedByMe.value = likedByMe ?? false
    localLikeCount.value = likeCount ?? 0
  },
)

interface HeartParticle {
  id: number
  x: number
  y: number
  rot: number
  scale: number
}
const heartParticles = ref<HeartParticle[]>([])

const spawnHeartParticles = () => {
  for (let i = 0; i < 8; i++) {
    // 1.5x wider cone (from 60-120 to 45-135 degrees)
    const angle = (Math.random() * 90 + 45) * (Math.PI / 180)
    const velocity = Math.random() * 20 + 15 // Reduced height by half
    const tx = Math.cos(angle) * velocity
    const ty = -Math.sin(angle) * velocity - 10 // Reduced base upward offset

    const id = Date.now() + i + Math.random()
    heartParticles.value.push({
      id,
      x: tx,
      y: ty,
      rot: Math.random() * 60 - 30,
      scale: Math.random() * 0.5 + 0.5,
    })

    setTimeout(() => {
      heartParticles.value = heartParticles.value.filter((p) => p.id !== id)
    }, 1000)
  }
}

const toggleLike = async () => {
  if (!authStore.isAuthenticated) {
    showAlert('로그인이 필요합니다.', 'info')
    return
  }
  if (isLiking.value) return

  const prevLiked = localLikedByMe.value
  const prevCount = localLikeCount.value

  // Optimistic update
  localLikedByMe.value = !prevLiked
  localLikeCount.value = prevLiked ? prevCount - 1 : prevCount + 1
  isLiking.value = true

  if (!prevLiked) {
    spawnHeartParticles()
  }

  try {
    const res = prevLiked ? await unlikeReview(props.feed.id) : await likeReview(props.feed.id)
    // 서버 응답 기준으로 확정
    localLikedByMe.value = res.likedByMe
    localLikeCount.value = res.likeCount
    feedStore.updateLikeLocally(props.feed.id, res.likedByMe, res.likeCount)
  } catch (error) {
    // 실패 시 롤백
    localLikedByMe.value = prevLiked
    localLikeCount.value = prevCount
    console.error('Like toggle error:', error)
    showAlert('좋아요 처리에 실패했습니다.', 'error')
  } finally {
    isLiking.value = false
  }
}

const openSaveModal = () => {
  if (!authStore.isAuthenticated) {
    showAlert('로그인이 필요합니다.', 'info')
    return
  }
  isSaveModalOpen.value = true
}

// Initialize isFollowing from the backend provided author status
const isFollowing = ref(props.feed.author.isFollowing || false)

watch(
  () => props.feed.author.isFollowing,
  (newVal) => {
    isFollowing.value = newVal || false
  },
)

const isMyFeed = computed(() => {
  return (
    authStore.user?.id === props.feed.author.id ||
    authStore.user?.handle === props.feed.author.handle
  )
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleEdit = () => {
  isDropdownOpen.value = false
  emit('edit', props.feed)
}

const handleDelete = async () => {
  isDropdownOpen.value = false
  const ok = await confirm({
    title: '리뷰 삭제',
    message: '이 리뷰를 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.',
    confirmText: '삭제',
    danger: true,
  })
  if (ok) {
    emit('delete', props.feed.id)
  }
}

const isTogglingFollow = ref(false)

const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    showAlert('로그인이 필요합니다.', 'info')
    return
  }
  if (isTogglingFollow.value) return

  const prevFollowing = isFollowing.value
  isFollowing.value = !prevFollowing
  isTogglingFollow.value = true

  try {
    if (prevFollowing) {
      await unfollowUser(props.feed.author.id)
    } else {
      await followUser(props.feed.author.id)
    }
  } catch (error) {
    isFollowing.value = prevFollowing
    console.error('Follow toggle error:', error)
    showAlert('팔로우 상태를 변경할 수 없습니다.', 'error')
  } finally {
    isTogglingFollow.value = false
  }
}

const goToUserProfile = (handle: string) => {
  router.push(`/users/${handle}`)
}

const goToMap = () => {
  if (props.feed && props.feed.place) {
    router.push({
      path: '/map',
      query: {
        placeId: props.feed.place.id,
        name: props.feed.place.name,
        x: props.feed.place.x,
        y: props.feed.place.y,
        address: props.feed.place.roadAddressName,
        category: props.feed.place.categoryName,
        isSaved: props.feed.place.isSaved ? 'true' : 'false',
      },
    })
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const yy = String(date.getFullYear()).slice(2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}.${mm}.${dd}`
}
</script>

<style scoped>
.slide-out-enter-active,
.slide-out-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

/* Mobile (column): slide down */
@media (max-width: 1023px) {
  .slide-out-enter-from,
  .slide-out-leave-to {
    opacity: 0;
    max-height: 0 !important;
    transform: translateY(-20px);
    margin-top: -1rem; /* cancel gap */
  }
  .slide-out-enter-to,
  .slide-out-leave-from {
    opacity: 1;
    max-height: 650px;
    transform: translateY(0);
  }
}

/* Desktop (row): slide right */
@media (min-width: 1024px) {
  .slide-out-enter-from,
  .slide-out-leave-to {
    opacity: 0;
    max-width: 0 !important;
    transform: translateX(-50px);
    margin-left: -1rem; /* cancel gap */
  }
  .slide-out-enter-to,
  .slide-out-leave-from {
    opacity: 1;
    max-width: 448px; /* max-w-md */
    transform: translateX(0);
  }
}

@keyframes particle {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(var(--scale));
    opacity: 0;
  }
}
.animate-particle {
  animation: particle 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
</style>
