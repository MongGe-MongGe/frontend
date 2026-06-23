<template>
  <div class="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden max-w-2xl mx-auto shadow-sm">
    <!-- Header -->
    <header class="flex items-center justify-between p-3 border-b border-gray-100">
      <div 
        @click="goToUserProfile(feed.author.handle)" 
        class="flex items-center space-x-3 cursor-pointer group"
      >
        <img 
          :src="feed.author.profileImage || '/default_profile_image.png'" 
          @error="(e) => (e.target as HTMLImageElement).src = '/default_profile_image.png'"
          class="w-10 h-10 rounded-full object-cover bg-gray-200 group-hover:opacity-80 transition"
          alt="profile" 
        />
        <div>
          <h3 class="font-bold text-sm text-gray-900 group-hover:underline">{{ feed.author.nickname }}</h3>
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
            isFollowing ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-blue-500 text-white hover:bg-blue-600'
          ]"
        >
          {{ isFollowing ? '팔로잉' : '팔로우' }}
        </button>

        <!-- Kebab Dropdown -->
        <div 
          v-if="isMyFeed && isDropdownOpen" 
          class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20"
        >
          <button @click="handleEdit" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">수정</button>
          <button @click="handleDelete" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition">삭제</button>
        </div>
      </div>
    </header>

    <!-- Image Carousel -->
    <div class="relative w-full aspect-square bg-gray-100 overflow-hidden group">
      <div 
        class="flex transition-transform duration-300 ease-in-out h-full w-full"
        :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
      >
        <div 
          v-for="(img, idx) in feed.images" 
          :key="idx" 
          class="w-full h-full flex-shrink-0"
        >
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
      <div v-if="feed.images.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
        <div 
          v-for="(_, idx) in feed.images" 
          :key="idx" 
          class="w-1.5 h-1.5 rounded-full transition-colors border-none outline-none"
          :class="idx === currentImageIndex ? 'bg-white' : 'bg-white/50'"
        ></div>
      </div>
    </div>

    <!-- Place Info Box -->
    <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
      <div class="flex items-start space-x-2">
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
      <button @click="openSaveModal" class="flex items-center group transition text-gray-400 hover:text-blue-500">
        <div class="p-2 rounded-full group-hover:bg-blue-50 transition">
          <Bookmark class="w-5 h-5" />
        </div>
      </button>
    </div>

    <!-- Review Content -->
    <div class="px-4 py-3 text-sm">
      <span class="font-bold text-gray-900 mr-2">{{ feed.author.nickname }}</span>
      <span class="text-gray-800 whitespace-pre-wrap">{{ feed.content }}</span>
    </div>

    <!-- Twitter style Action Footer -->
    <div class="px-2 pb-2 flex items-center justify-between text-gray-500 border-t border-gray-50 pt-2">
      <div class="flex items-center space-x-6">
        <!-- Like -->
        <button class="flex items-center group transition">
          <div class="p-2 rounded-full group-hover:bg-red-50 group-hover:text-red-500 transition" :class="{'text-red-500': feed.likedByMe}">
            <Heart class="w-5 h-5" :class="{'fill-current': feed.likedByMe}" />
          </div>
          <span class="text-sm font-medium pl-1 group-hover:text-red-500 transition" :class="{'text-red-500': feed.likedByMe}">{{ feed.likeCount || 0 }}</span>
        </button>

        <!-- Comment -->
        <button class="flex items-center group transition">
          <div class="p-2 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition">
            <MessageCircle class="w-5 h-5" />
          </div>
          <span class="text-sm font-medium pl-1 group-hover:text-blue-500 transition">{{ feed.commentCount || 0 }}</span>
        </button>

        <!-- Place Save (Bookmark) was moved to Place Info Box -->
      </div>
      
      <!-- Date & User Rating Stars -->
      <div class="flex items-center px-2">
        <!-- Date -->
        <span class="text-xs text-gray-400 uppercase tracking-wider mr-3">
          {{ formatDate(feed.createdAt) }}
        </span>
        <!-- User Rating Stars -->
        <div class="flex">
          <Star v-for="s in 5" :key="s" class="w-4 h-4 fill-current" :class="s <= feed.ratingScore ? 'text-yellow-400' : 'text-gray-200'" />
        </div>
      </div>
    </div>

  </div>

  <SavePlaceModal 
    v-if="isSaveModalOpen" 
    :place="feed.place" 
    @close="isSaveModalOpen = false" 
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { followUser, unfollowUser } from '@/api/user'
import { MoreHorizontal, ChevronLeft, ChevronRight, MapPin, Star, Heart, MessageCircle, Bookmark } from 'lucide-vue-next'
import SavePlaceModal from '@/components/place/SavePlaceModal.vue'

const props = defineProps<{
  feed: any
}>()

const emit = defineEmits(['edit', 'delete'])

const router = useRouter()
const authStore = useAuthStore()

const currentImageIndex = ref(0)
const isDropdownOpen = ref(false)
const isSaveModalOpen = ref(false)

const openSaveModal = () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    return
  }
  isSaveModalOpen.value = true
}

// Initialize isFollowing from the backend provided author status
const isFollowing = ref(props.feed.author.isFollowing || false)

watch(() => props.feed.author.isFollowing, (newVal) => {
  isFollowing.value = newVal || false
})

const isMyFeed = computed(() => {
  return authStore.user?.id === props.feed.author.id || authStore.user?.handle === props.feed.author.handle
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleEdit = () => {
  isDropdownOpen.value = false
  emit('edit', props.feed)
}

const handleDelete = () => {
  isDropdownOpen.value = false
  if (confirm('이 리뷰를 삭제하시겠습니까?')) {
    emit('delete', props.feed.id)
  }
}

const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    return
  }
  try {
    if (isFollowing.value) {
      await unfollowUser(props.feed.author.id)
      isFollowing.value = false
    } else {
      await followUser(props.feed.author.id)
      isFollowing.value = true
    }
  } catch (error) {
    console.error('Follow toggle error:', error)
    alert('팔로우 상태를 변경할 수 없습니다.')
  }
}

const goToUserProfile = (handle: string) => {
  router.push(`/users/${handle}`)
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
