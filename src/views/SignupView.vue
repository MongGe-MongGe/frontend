<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-sm">
      <!-- Logo + Brand -->
      <div class="flex flex-col items-center mb-8">
        <AppLogo size="xl" class="mb-4" />
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">구루밍</h1>
        <p class="mt-1 text-sm text-gray-500">구루밍에 오신 것을 환영합니다</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-800 mb-6">회원가입</h2>
        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">이메일</label>
            <input
              id="email"
              type="email"
              required
              v-model="form.email"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="이메일 주소를 입력하세요"
            />
          </div>

          <!-- Nickname -->
          <div>
            <label for="nickname" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">닉네임</label>
            <input
              id="nickname"
              type="text"
              required
              v-model="form.nickname"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="닉네임 (2~20자)"
            />
          </div>

          <!-- Handle -->
          <div>
            <label for="handle" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">고유 아이디</label>
            <div class="flex">
              <span class="inline-flex items-center px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-bold">@</span>
              <input
                id="handle"
                type="text"
                required
                v-model="form.handle"
                class="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                placeholder="영문/숫자 4~20자"
              />
            </div>
          </div>

          <!-- Phone (optional) -->
          <div>
            <label for="phone" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">전화번호 <span class="normal-case font-normal text-gray-400">(선택)</span></label>
            <input
              id="phone"
              type="tel"
              v-model="form.phone"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="전화번호를 입력하세요"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호</label>
            <input
              id="password"
              type="password"
              required
              v-model="form.password"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
              placeholder="비밀번호 (8자 이상)"
            />
          </div>

          <!-- Password Confirm -->
          <div>
            <label for="password-confirm" class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호 확인</label>
            <input
              id="password-confirm"
              type="password"
              required
              v-model="form.passwordConfirm"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition"
              :class="passwordMismatch ? 'border-red-300 focus:ring-red-400' : 'focus:ring-blue-500'"
              placeholder="비밀번호를 다시 입력하세요"
            />
            <p v-if="passwordMismatch" class="mt-1.5 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading || passwordMismatch"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <LoadingSpinner v-if="isLoading" size="sm" class="text-white p-0" />
            <span>{{ isLoading ? '가입 중...' : '가입하기' }}</span>
          </button>
        </form>
      </div>

      <!-- Footer Link -->
      <p class="text-center text-sm text-gray-500 mt-6">
        이미 계정이 있으신가요?
        <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-700 ml-1">로그인하기</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/composables/useAlert'
import http from '@/api/http'
import AppLogo from '@/components/common/AppLogo.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const { showAlert } = useAlert()
const isLoading = ref(false)

const form = ref({
  email: '',
  nickname: '',
  handle: '',
  phone: '',
  password: '',
  passwordConfirm: '',
})

const passwordMismatch = computed(() => {
  return form.value.passwordConfirm.length > 0 && form.value.password !== form.value.passwordConfirm
})

const handleSignup = async () => {
  if (passwordMismatch.value) {
    showAlert('비밀번호가 일치하지 않습니다.', 'error')
    return
  }
  if (form.value.password !== form.value.passwordConfirm) {
    showAlert('비밀번호 확인을 입력해주세요.', 'error')
    return
  }

  // 사용자가 @를 입력하지 않았다면 자동으로 추가
  let finalHandle = form.value.handle.trim()
  if (!finalHandle.startsWith('@')) {
    finalHandle = '@' + finalHandle
  }

  isLoading.value = true
  try {
    const { passwordConfirm: _, ...rest } = form.value
    const payload = { ...rest, handle: finalHandle }
    await http.post('/api/auth/signup', payload)

    showAlert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.', 'success')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    showAlert(err.response?.data || '회원가입에 실패했습니다. 입력값을 확인해주세요.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
