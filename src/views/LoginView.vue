<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm">
      <!-- Logo + Brand -->
      <div class="flex flex-col items-center mb-8">
        <AppLogo size="xl" class="mb-4" />
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">구루밍</h1>
        <p class="mt-1 text-sm text-gray-500">나만의 맛집을 기록하고 공유하세요</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-800 mb-6">로그인</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email-address" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">이메일</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="이메일 주소를 입력하세요"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <LoadingSpinner v-if="isLoading" size="sm" class="text-white p-0" />
            <span>{{ isLoading ? '로그인 중...' : '로그인' }}</span>
          </button>
        </form>
      </div>

      <!-- Footer Link -->
      <p class="text-center text-sm text-gray-500 mt-6">
        계정이 없으신가요?
        <router-link to="/signup" class="font-semibold text-blue-600 hover:text-blue-700 ml-1">회원가입하기</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAlert } from '@/composables/useAlert'
import http from '@/api/http'
import AppLogo from '@/components/common/AppLogo.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const { showAlert } = useAlert()

const handleLogin = async () => {
  isLoading.value = true
  try {
    const response = await http.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    const data = response.data
    authStore.setAuth(data.Token || data.token, {
      id: data.id,
      nickname: data.nickname,
      email: data.email,
      handle: data.handle,
      profileImage: data.profileImage,
      role: data.role,
    })

    router.push('/')
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    showAlert(
      err.response?.data || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      'error',
    )
  } finally {
    isLoading.value = false
  }
}
</script>
