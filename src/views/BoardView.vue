<template>
  <div
    class="h-full w-full max-w-[1080px] mx-auto flex flex-col bg-white border-x border-gray-100 shadow-sm"
  >
    <!-- Header -->
    <header class="h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-10">
      <div class="h-full px-4 sm:px-6 w-full flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900">게시판</h1>
        <button
          v-if="isAdmin"
          @click="goToCreate"
          class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          글쓰기
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-4 sm:p-6 w-full bg-gray-50">
      <div class="h-full w-full flex flex-row gap-6">
        <!-- Left Pane: Post List -->
        <div class="w-[400px] shrink-0 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-6 pr-2">
          <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>

          <div
            v-else-if="posts.length === 0"
            class="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 shrink-0"
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

          <div v-else class="flex flex-col gap-4 w-full shrink-0">
            <div
              v-for="post in posts"
              :key="post.id"
              class="bg-white rounded-xl p-5 shadow-sm border flex flex-col gap-2 transition-all cursor-pointer w-full"
              :class="
                selectedPost?.id === post.id
                  ? 'border-primary ring-1 ring-primary shadow-md'
                  : 'border-gray-100 hover:shadow-md'
              "
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
                  {{ post.category === 'Notice' ? '공지사항' : '이벤트' }}
                </span>
                <span class="text-xs text-gray-400">{{ formatDate(post.createdAt) }}</span>
              </div>
              <h2 class="text-lg font-bold text-gray-900 line-clamp-1">{{ post.title }}</h2>
              <div class="text-xs text-gray-400 mt-2">작성자: {{ post.authorNickname }}</div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2 shrink-0">
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

        <!-- Right Pane: Detail View -->
        <div
          class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full"
        >
          <div v-if="selectedPost" class="flex flex-col h-full overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex flex-col gap-4 shrink-0">
              <div class="flex items-center justify-between">
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  :class="
                    selectedPost.category === 'Notice'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600'
                  "
                >
                  {{ selectedPost.category === 'Notice' ? '공지사항' : '이벤트' }}
                </span>
                <div class="flex items-center gap-2">
                  <template v-if="isAdmin">
                    <button
                      @click="goToEdit(selectedPost)"
                      class="px-3 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      수정
                    </button>
                    <button
                      @click="deletePost(selectedPost)"
                      class="px-3 py-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </template>
                  <button
                    @click="selectedPost = null"
                    class="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
              </div>
              <h2 class="text-2xl font-bold text-gray-900">{{ selectedPost.title }}</h2>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span
                  >작성자:
                  <span class="font-medium text-gray-700">{{
                    selectedPost.authorNickname
                  }}</span></span
                >
                <span>{{ formatDate(selectedPost.createdAt) }}</span>
              </div>
            </div>

            <div
              class="p-6 overflow-y-auto flex-1 prose prose-sm sm:prose max-w-none prose-img:rounded-xl prose-a:text-primary"
            >
              <div v-if="selectedPost.content" v-html="selectedPost.content"></div>
              <div v-else class="text-gray-500 italic">게시글 본문이 비어있습니다.</div>
            </div>
          </div>

          <div
            v-else
            class="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/30"
          >
            <svg
              class="w-16 h-16 mb-4 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L16.5 4H12"
              ></path>
            </svg>
            <p class="font-medium">좌측 목록에서 게시글을 선택해 주세요.</p>
          </div>
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

const goToEdit = (post: Post) => {
  router.push(`/board/edit/${post.id}`)
}

const deletePost = async (post: Post) => {
  if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return

  try {
    await axios.delete(`/api/posts/${post.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    postCache.delete(post.id) // 캐시에서도 삭제
    selectedPost.value = null
    fetchPosts(currentPage.value)
  } catch (e) {
    console.error('Failed to delete post', e)
    alert('게시글 삭제에 실패했습니다.')
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
  } catch (e) {
    console.error('Failed to fetch post detail', e)
    alert('게시글을 불러오는데 실패했습니다.')
  }
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>
