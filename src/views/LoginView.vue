<template>
  <div class="flex-1 flex flex-col items-center justify-center bg-white py-12 px-6">
    <div class="w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">구루밍 로그인</h2>
        <p class="mt-2 text-center text-sm text-gray-600">나만의 맛집을 기록하고 공유하세요</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">이메일</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="이메일 주소"
            />
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="비밀번호"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> 아이디 저장 </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-blue-500">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            로그인
          </button>
        </div>
      </form>
      <div class="text-center text-sm">
        계정이 없으신가요?
        <router-link to="/signup" class="font-medium text-primary hover:text-blue-500"
          >회원가입하기</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import http from '@/api/http'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  errorMessage.value = ''
  try {
    const response = await http.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    // LoginResponse
    const data = response.data
    authStore.setAuth(data.Token || data.token, {
      id: data.id,
      nickname: data.nickname,
      email: data.email,
      handle: data.handle,
      profileImage: data.profileImage,
    })

    router.push('/')
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    errorMessage.value =
      err.response?.data || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
  }
}
</script>
