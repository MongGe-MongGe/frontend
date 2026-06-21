<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 sticky top-0 bg-white/90 backdrop-blur">
        <h2 class="font-bold text-lg text-gray-900">{{ title }}</h2>
        <button @click="$emit('close')" class="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto p-4 flex-1">
        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="users.length === 0" class="text-center py-12 text-gray-500">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <p class="font-medium text-sm">{{ emptyMessage }}</p>
        </div>
        <div v-else class="space-y-3">
          <UserListItem v-for="u in users" :key="u.id" :user="u" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getFollowers, getFollowings } from '@/api/user'
import UserListItem from '@/components/user/UserListItem.vue'

const props = defineProps<{
  userId: string
  type: 'followers' | 'followings'
}>()

defineEmits(['close'])

const users = ref<Record<string, unknown>[]>([])
const isLoading = ref(true)

const title = computed(() => props.type === 'followers' ? '팔로워' : '팔로잉')
const emptyMessage = computed(() => props.type === 'followers' ? '팔로워가 없습니다.' : '팔로잉하는 유저가 없습니다.')

onMounted(async () => {
  try {
    isLoading.value = true
    if (props.type === 'followers') {
      users.value = await getFollowers(props.userId)
    } else {
      users.value = await getFollowings(props.userId)
    }
  } catch (e) {
    console.error('Failed to load users', e)
  } finally {
    isLoading.value = false
  }
})
</script>
