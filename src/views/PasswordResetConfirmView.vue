<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm">
      <!-- Logo + Brand -->
      <div class="flex flex-col items-center mb-8">
        <AppLogo size="xl" class="mb-4" />
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">구루밍</h1>
        <p class="mt-1 text-sm text-gray-500">새로운 비밀번호 설정</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-800 mb-6">비밀번호 재설정</h2>
        
        <form v-if="hasToken" @submit.prevent="handleConfirm" class="space-y-4">
          <!-- Password -->
          <div>
            <label for="new-password" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">새 비밀번호</label>
            <input
              id="new-password"
              name="newPassword"
              type="password"
              required
              v-model="newPassword"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="새 비밀번호를 입력하세요 (8자 이상)"
            />
          </div>

          <!-- Password Confirm -->
          <div>
            <label for="confirm-password" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">새 비밀번호 확인</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              v-model="confirmPassword"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </div>

          <p v-if="passwordError" class="text-red-500 text-xs">{{ passwordError }}</p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <LoadingSpinner v-if="isLoading" size="sm" class="text-white p-0" />
            <span>{{ isLoading ? '변경 중...' : '비밀번호 변경하기' }}</span>
          </button>
        </form>

        <div v-else class="text-center">
          <p class="text-red-500 font-semibold mb-4">유효하지 않은 접근입니다.</p>
          <p class="text-sm text-gray-500">메일로 받은 링크를 통해 접속해 주세요.</p>
        </div>
      </div>

      <!-- Footer Link -->
      <p class="text-center text-sm text-gray-500 mt-6">
        <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-700">로그인 화면으로 돌아가기</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAlert } from '@/composables/useAlert'
import http from '@/api/http'
import AppLogo from '@/components/common/AppLogo.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const passwordError = ref('')
const token = ref('')

const route = useRoute()
const router = useRouter()
const { showAlert } = useAlert()

const hasToken = computed(() => !!token.value)

onMounted(() => {
  // Extract token from query params
  if (route.query.token) {
    token.value = route.query.token as string
  }
})

const handleConfirm = async () => {
  passwordError.value = ''
  
  if (newPassword.value.length < 8) {
    passwordError.value = '비밀번호는 8자 이상이어야 합니다.'
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  isLoading.value = true
  
  try {
    await http.post('/api/auth/password-reset/confirm', {
      token: token.value,
      newPassword: newPassword.value
    })
    showAlert('비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해 주세요.', 'success')
    router.push('/login')
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    showAlert(err.response?.data || '비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있습니다.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
