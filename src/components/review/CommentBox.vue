<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
      <h3 class="font-bold text-gray-900">댓글 {{ commentCount }}개</h3>
      <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Comment List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="scrollContainer">
      <div v-if="isLoading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
      <div v-else-if="comments.length === 0" class="text-center py-8 text-sm text-gray-500">
        아직 작성된 댓글이 없습니다.
      </div>
      <div v-else v-for="comment in comments" :key="comment.id" class="flex space-x-3 group">
        <img
          :src="comment.author.profileImage || '/default_profile_image.png'"
          @error="(e) => ((e.target as HTMLImageElement).src = '/default_profile_image.png')"
          class="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-sm text-gray-900">{{ comment.author.nickname }}</span>
            <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="text-sm text-gray-800 mt-0.5 whitespace-pre-wrap break-all">
            {{ comment.content }}
          </p>
        </div>
        <div
          v-if="authStore.user?.id === comment.author.id"
          class="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            @click="handleDelete(comment.id)"
            class="text-xs text-red-500 hover:text-red-700 p-1"
          >
            삭제
          </button>
        </div>
      </div>
    </div>

    <!-- Comment Input -->
    <div class="p-3 border-t border-gray-100 bg-white">
      <div
        class="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-primary focus-within:bg-white transition-colors"
      >
        <input
          v-model="newComment"
          type="text"
          placeholder="댓글 달기..."
          class="flex-1 bg-transparent border-none focus:outline-none text-sm"
          @keyup.enter="handleSubmit"
        />
        <button
          @click="handleSubmit"
          :disabled="!newComment.trim() || isSubmitting"
          class="text-sm font-bold text-primary disabled:opacity-50 transition-opacity"
        >
          게시
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createComment, deleteComment, getCommentsByReview } from '@/api/comment'
import { useAlert } from '@/composables/useAlert'

const props = defineProps<{
  feedId: string
  commentCount: number
}>()

const emit = defineEmits(['close', 'update:commentCount'])

const authStore = useAuthStore()
const { showAlert } = useAlert()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const comments = ref<any[]>([])
const isLoading = ref(true)
const newComment = ref('')
const isSubmitting = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

const loadComments = async () => {
  try {
    isLoading.value = true
    const res = await getCommentsByReview(props.feedId, 0, 100)
    comments.value = res.content || res
  } catch (error) {
    console.error('Failed to load comments', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return

  if (!authStore.isAuthenticated) {
    showAlert('로그인이 필요합니다.', 'warning')
    return
  }

  try {
    isSubmitting.value = true
    const newCmd = await createComment(props.feedId, { content: newComment.value.trim() })
    comments.value.push(newCmd)
    newComment.value = ''
    emit('update:commentCount', props.commentCount + 1)

    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
      }
    })
  } catch (error) {
    console.error('Failed to create comment', error)
    showAlert('댓글 작성에 실패했습니다.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (commentId: string) => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return
  try {
    await deleteComment(commentId)
    comments.value = comments.value.filter((c) => c.id !== commentId)
    emit('update:commentCount', props.commentCount - 1)
  } catch (error) {
    console.error('Failed to delete comment', error)
    showAlert('댓글 삭제에 실패했습니다.', 'error')
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}.${dd}`
}

onMounted(() => {
  loadComments()
})
</script>
