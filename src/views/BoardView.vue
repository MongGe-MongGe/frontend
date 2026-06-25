<template>
  <div class="flex justify-center w-full min-h-screen pb-10 mt-6 px-4">
    <div
      class="flex flex-col lg:flex-row gap-4 transition-all duration-300 w-full max-w-[1250px] justify-center items-start"
    >
      <!-- Left Pane: Post List -->
      <div
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-full max-w-md shrink-0 flex flex-col h-[650px] mx-auto lg:mx-0"
      >
        <!-- Header -->
        <header
          class="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10 shrink-0"
        >
          <h1 class="text-lg font-bold text-gray-900">게시판</h1>
          <button
            v-if="isAdmin"
            @click="goToCreate"
            class="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            글쓰기
          </button>
        </header>

        <div
          class="flex-1 overflow-y-auto no-scrollbar p-3 bg-gray-50 flex flex-col gap-3 relative"
        >
          <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>

          <div
            v-else-if="posts.length === 0"
            class="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 shrink-0 mt-4 mx-2"
          >
            <p class="text-gray-500 text-sm font-medium">아직 등록된 게시글이 없습니다.</p>
          </div>

          <div v-else class="flex flex-col gap-3 w-full shrink-0">
            <div
              v-for="post in posts"
              :key="post.id"
              class="bg-white rounded-xl p-4 shadow-sm border flex flex-col gap-2 transition-all cursor-pointer w-full group"
              :class="
                selectedPost?.id === post.id
                  ? 'border-gray-400 ring-1 ring-gray-400 shadow-md'
                  : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
              "
              @click="openPost(post)"
            >
              <div class="flex items-center justify-between">
                <span
                  class="px-2 py-0.5 text-[10px] font-bold rounded-full"
                  :class="
                    post.category === 'Notice'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600'
                  "
                >
                  {{ post.category === 'Notice' ? '공지사항' : '이벤트' }}
                </span>
                <span class="text-xs text-gray-400">{{ formatDate(post.createdAt) }}</span>
              </div>
              <h2
                class="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors"
              >
                {{ post.title }}
              </h2>
              <div class="text-[11px] text-gray-400 mt-1">작성자: {{ post.authorNickname }}</div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-4 mb-4 gap-1 shrink-0">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors shadow-sm"
              :class="
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              "
            >
              {{ page }}
            </button>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Right Pane: Detail View -->
      <Transition name="slide-out">
        <div
          v-if="selectedPost"
          class="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-md shrink-0 mx-auto lg:mx-0 flex flex-col overflow-hidden h-[650px]"
        >
          <div class="p-5 border-b border-gray-100 flex flex-col gap-3 shrink-0 relative">
            <button
              @click="selectedPost = null"
              class="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
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
            <div class="pr-8">
              <span
                class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full mb-2"
                :class="
                  selectedPost.category === 'Notice'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-green-50 text-green-600'
                "
              >
                {{ selectedPost.category === 'Notice' ? '공지사항' : '이벤트' }}
              </span>
              <h2 class="text-xl font-bold text-gray-900 leading-tight">
                {{ selectedPost.title }}
              </h2>
            </div>

            <div class="flex justify-between items-center text-xs text-gray-500 mt-2">
              <span
                >작성자:
                <span class="font-medium text-gray-700">{{
                  selectedPost.authorNickname
                }}</span></span
              >
              <span>{{ formatDate(selectedPost.createdAt) }}</span>
            </div>

            <div v-if="isAdmin" class="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50">
              <button
                @click="goToEdit(selectedPost)"
                class="px-3 py-1 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                수정
              </button>
              <button
                @click="deletePost(selectedPost)"
                class="px-3 py-1 text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
              >
                삭제
              </button>
            </div>
          </div>

          <div
            class="p-5 overflow-y-auto flex-1 prose prose-sm max-w-none prose-img:rounded-xl prose-a:text-primary"
          >
            <div v-if="selectedPost.content" v-html="selectedPost.content"></div>
            <div v-else class="text-gray-400 italic text-sm text-center py-10">
              게시글 본문이 비어있습니다.
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAlert } from '@/composables/useAlert'
import { useConfirm } from '@/composables/useConfirm'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const { showAlert } = useAlert()
const { confirm } = useConfirm()

const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

interface Post {
  id: string
  title: string
  content?: string
  category: string
  createdAt: string
  authorNickname: string
}

const posts = ref<Post[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const selectedPost = ref<Post | null>(null)

// 이미 불러온 게시글 상세 정보를 캐싱하기 위한 Map
const postCache = new Map<string, Post>()

const fetchPosts = async (page: number) => {
  loading.value = true
  try {
    const res = await axios.get(`/api/posts`, {
      params: { page: page - 1, size: 5 }, // 백엔드 API는 0-based 페이지 사용
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    posts.value = res.data.posts
    currentPage.value = res.data.currentPage + 1 // UI는 1-based 유지
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

const goToEdit = (post: Post) => {
  router.push(`/board/edit/${post.id}`)
}

const deletePost = async (post: Post) => {
  const ok = await confirm({
    title: '게시글 삭제',
    message: '정말 이 게시글을 삭제하시겠습니까?',
    confirmText: '삭제하기',
    danger: true,
  })
  if (!ok) return

  try {
    await axios.delete(`/api/posts/${post.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    postCache.delete(post.id) // 캐시에서도 삭제
    selectedPost.value = null
    fetchPosts(currentPage.value)
  } catch (error) {
    showAlert('게시글 삭제에 실패했습니다.', 'error')
    console.error(error)
  }
}

const openPost = async (post: Post) => {
  // 이미 캐싱된 데이터가 있다면 네트워크 요청 없이 바로 렌더링
  if (postCache.has(post.id)) {
    selectedPost.value = postCache.get(post.id)!
    return
  }

  try {
    const config = authStore.token
      ? {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      : {}
    const res = await axios.get(`/api/posts/${post.id}`, config)
    postCache.set(post.id, res.data) // 불러온 데이터 캐싱
    selectedPost.value = res.data
  } catch (error) {
    showAlert('게시글을 불러오는데 실패했습니다.', 'error')
    console.error(error)
  }
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
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
</style>
