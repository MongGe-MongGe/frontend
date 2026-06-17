<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <header
      class="h-16 px-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-10"
    >
      <h1 class="text-xl font-bold text-gray-900">게시판</h1>
      <button
        v-if="isAdmin"
        @click="goToCreate"
        class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        글쓰기
      </button>
    </header>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
      <div class="max-w-3xl mx-auto flex flex-col gap-4">
        <div v-if="loading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div
          v-else-if="posts.length === 0"
          class="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100"
        >
          <svg
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            ></path>
          </svg>
          <p class="text-gray-500 font-medium">아직 등록된 게시글이 없습니다.</p>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer"
            @click="openPost(post)"
          >
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-1 text-xs font-semibold rounded-full"
                :class="
                  post.category === 'Notice'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-green-50 text-green-600'
                "
              >
                {{ post.category === 'Notice' ? '공지' : '이벤트' }}
              </span>
              <span class="text-xs text-gray-400">{{ formatDate(post.createdAt) }}</span>
            </div>
            <h2 class="text-lg font-bold text-gray-900 line-clamp-1">{{ post.title }}</h2>
            <p class="text-sm text-gray-600 line-clamp-2" v-html="stripHtml(post.content)"></p>
            <div class="text-xs text-gray-400 mt-2">작성자: {{ post.authorNickname }}</div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            class="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors"
            :class="
              currentPage === page
                ? 'bg-primary text-white shadow-sm'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            "
          >
            {{ page }}
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Post Modal (Simple view) -->
    <div
      v-if="selectedPost"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="selectedPost = null"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
      >
        <div class="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <span
              class="px-3 py-1 text-xs font-semibold rounded-full"
              :class="
                selectedPost.category === 'Notice'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-green-50 text-green-600'
              "
            >
              {{ selectedPost.category === 'Notice' ? '공지' : '이벤트' }}
            </span>
            <h2 class="text-xl font-bold text-gray-900">{{ selectedPost.title }}</h2>
          </div>
          <button
            @click="selectedPost = null"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div
          class="p-6 overflow-y-auto bg-gray-50/50 flex-1 prose prose-sm sm:prose max-w-none prose-img:rounded-xl prose-a:text-primary"
        >
          <div v-html="selectedPost.content"></div>
        </div>
        <div
          class="p-4 bg-white border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 shrink-0"
        >
          <span
            >작성자:
            <span class="font-medium text-gray-700">{{ selectedPost.authorNickname }}</span></span
          >
          <span>{{ formatDate(selectedPost.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

interface Post {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  authorNickname: string
}

const posts = ref<Post[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const selectedPost = ref<Post | null>(null)

const fetchPosts = async (page: number) => {
  loading.value = true
  try {
    const res = await axios.get(`/api/posts`, {
      params: { page, size: 5 }, // 5개씩 가져오기
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    posts.value = res.data.posts
    currentPage.value = res.data.currentPage
    totalPages.value = res.data.totalPages
  } catch (e) {
    console.error('Failed to fetch posts', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts(1)
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchPosts(page)
  }
}

const goToCreate = () => {
  router.push('/board/create')
}

const openPost = (post: Post) => {
  selectedPost.value = post
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}
</script>
