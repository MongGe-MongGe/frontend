<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm">
      <!-- Logo + Brand -->
      <div class="flex flex-col items-center mb-8">
        <AppLogo size="xl" class="mb-4" />
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">구루밍</h1>
        <p class="mt-1 text-sm text-gray-500">비밀번호 찾기</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-800 mb-2">비밀번호 재설정 요청</h2>
        <p class="text-sm text-gray-500 mb-6">가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
        
        <form @submit.prevent="handleRequest" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email-address" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">이메일</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              v-model="email"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="이메일 주소를 입력하세요"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <LoadingSpinner v-if="isLoading" size="sm" class="text-white p-0" />
            <span>{{ isLoading ? '전송 중...' : '재설정 링크 받기' }}</span>
          </button>
        </form>

        <div v-if="successMessage" class="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
          {{ successMessage }}
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/composables/useAlert'
import http from '@/api/http'
import AppLogo from '@/components/common/AppLogo.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const email = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const { showAlert } = useAlert()
const router = useRouter()

const handleRequest = async () => {
  if (!email.value) return

  isLoading.value = true
  successMessage.value = ''
  
  try {
    const response = await http.post('/api/auth/password-reset/request', {
      email: email.value
    })
    successMessage.value = response.data || '비밀번호 재설정 메일이 전송되었습니다.'
    email.value = '' // 입력 초기화
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    showAlert(err.response?.data || '이메일 전송에 실패했습니다. 다시 시도해 주세요.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
