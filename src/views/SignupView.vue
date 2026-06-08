<template>
  <div class="flex-1 flex flex-col items-center justify-center bg-white py-12 px-6">
    <div class="w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h2>
        <p class="mt-2 text-center text-sm text-gray-600">구루밍에 오신 것을 환영합니다</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">이메일</label>
            <input
              id="email"
              type="email"
              required
              v-model="form.email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="이메일"
            />
          </div>
          <div>
            <label for="nickname" class="sr-only">닉네임</label>
            <input
              id="nickname"
              type="text"
              required
              v-model="form.nickname"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="닉네임 (2~20자)"
            />
          </div>
          <div>
            <label for="handle" class="sr-only">아이디(핸들)</label>
            <div class="relative flex">
              <span
                class="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                >@</span
              >
              <input
                id="handle"
                type="text"
                required
                v-model="form.handle"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="고유 아이디 (영문/숫자 6~20자)"
              />
            </div>
          </div>
          <div>
            <label for="phone" class="sr-only">전화번호</label>
            <input
              id="phone"
              type="tel"
              v-model="form.phone"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="전화번호 (선택)"
            />
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input
              id="password"
              type="password"
              required
              v-model="form.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="비밀번호 (8자 이상)"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="text-green-500 text-sm text-center">
          {{ successMessage }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            가입하기
          </button>
        </div>
      </form>
      <div class="text-center text-sm">
        이미 계정이 있으신가요?
        <router-link to="/login" class="font-medium text-primary hover:text-blue-500"
          >로그인하기</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'

const router = useRouter()
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  email: '',
  nickname: '',
  handle: '',
  phone: '',
  password: '',
})

const handleSignup = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // 사용자가 @를 입력하지 않았다면 자동으로 추가
  let finalHandle = form.value.handle.trim()
  if (!finalHandle.startsWith('@')) {
    finalHandle = '@' + finalHandle
  }

  try {
    const payload = { ...form.value, handle: finalHandle }
    await http.post('/api/auth/signup', payload)
    successMessage.value = '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다...'

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    errorMessage.value = err.response?.data || '회원가입에 실패했습니다. 입력값을 확인해주세요.'
  }
}
</script>
