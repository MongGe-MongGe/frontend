<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <header
      class="h-16 px-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-10"
    >
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900">새 게시글 작성</h1>
      </div>
      <button
        @click="submitPost"
        :disabled="isSubmitting || !isValid"
        class="bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        <span v-if="isSubmitting" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          등록 중...
        </span>
        <span v-else>작성 완료</span>
      </button>
    </header>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
      <div class="max-w-3xl mx-auto flex flex-col gap-6">
        <!-- Category & Title -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">카테고리</label>
            <select
              v-model="category"
              class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-medium appearance-none"
            >
              <option value="Notice">공지 (Notice)</option>
              <option value="Event">이벤트 (Event)</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">제목</label>
            <input
              v-model="title"
              type="text"
              placeholder="게시글 제목을 입력하세요."
              class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <!-- Editor -->
        <div
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-1.5"
        >
          <label class="text-sm font-medium text-gray-700">내용</label>
          <TiptapEditor v-model="content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import TiptapEditor from '@/components/common/TiptapEditor.vue'

const router = useRouter()
const authStore = useAuthStore()

const category = ref('Notice')
const title = ref('')
const content = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => {
  return title.value.trim().length > 0 && content.value.replace(/<[^>]*>?/gm, '').trim().length > 0
})

const submitPost = async () => {
  if (!isValid.value || isSubmitting.value) return

  isSubmitting.value = true
  try {
    await axios.post(
      '/api/posts',
      {
        title: title.value,
        content: content.value,
        category: category.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )

    // 성공 시 게시판으로 이동
    router.replace('/board')
  } catch (e) {
    console.error('Failed to create post', e)
    alert('게시글 등록에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
