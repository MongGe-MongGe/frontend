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

        <!-- Stepper Progress -->
        <div class="mb-6">
          <div
            class="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase mb-2"
          >
            <span>단계 {{ currentStep }} / {{ totalSteps }}</span>
            <span v-if="currentStep === 1">이메일</span>
            <span v-if="currentStep === 2">닉네임</span>
            <span v-if="currentStep === 3">고유 아이디</span>
            <span v-if="currentStep === 4">전화번호</span>
            <span v-if="currentStep === 5">비밀번호</span>
          </div>
          <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div
              class="h-full bg-blue-600 transition-all duration-300"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            ></div>
          </div>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Step 1 -->
          <div v-show="currentStep === 1" class="space-y-4">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                >이메일</label
              >
              <input
                id="email"
                type="email"
                required
                v-model="form.email"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition"
                :class="
                  emailError
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-blue-500'
                "
                placeholder="이메일 주소를 입력하세요"
              />
              <p v-if="emailError" class="mt-1.5 text-xs text-red-500">{{ emailError }}</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-show="currentStep === 2" class="space-y-4">
            <!-- Nickname -->
            <div>
              <label
                for="nickname"
                class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                >닉네임</label
              >
              <input
                id="nickname"
                type="text"
                required
                v-model="form.nickname"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition"
                :class="
                  nicknameError
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-blue-500'
                "
                placeholder="닉네임 (2~20자)"
              />
              <p v-if="nicknameError" class="mt-1.5 text-xs text-red-500">{{ nicknameError }}</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div v-show="currentStep === 3" class="space-y-4">
            <!-- Handle -->
            <div>
              <label
                for="handle"
                class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                >고유 아이디</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 py-3 rounded-l-xl border border-r-0 bg-gray-100 text-gray-500 text-sm font-bold"
                  :class="handleError ? 'border-red-300' : 'border-gray-200'"
                  >@</span
                >
                <input
                  id="handle"
                  type="text"
                  required
                  v-model="form.handle"
                  class="flex-1 px-4 py-3 rounded-r-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition"
                  :class="
                    handleError
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-gray-200 focus:ring-blue-500'
                  "
                  placeholder="영문/숫자 4~20자"
                />
              </div>
              <p v-if="handleError" class="mt-1.5 text-xs text-red-500">{{ handleError }}</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div v-show="currentStep === 4" class="space-y-4">
            <!-- Phone (optional) -->
            <div>
              <label
                for="phone"
                class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                >전화번호 <span class="normal-case font-normal text-gray-400">(선택)</span></label
              >
              <input
                id="phone"
                type="tel"
                v-model="form.phone"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition"
                :class="
                  phoneError
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-blue-500'
                "
                placeholder="숫자만 입력하세요"
              />
              <p v-if="phoneError" class="mt-1.5 text-xs text-red-500">{{ phoneError }}</p>
            </div>
          </div>

          <!-- Step 5 -->
          <div v-show="currentStep === 5" class="space-y-4">
            <!-- Password -->
            <div>
              <label
                for="password"
                class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                >비밀번호</label
              >
              <input
                id="password"
                type="password"
                required
                v-model="form.password"
                class="w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition"
                :class="
                  passwordFormatError
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-blue-500'
                "
                placeholder="비밀번호 (8자 이상)"
              />
              <p v-if="passwordFormatError" class="mt-1.5 text-xs text-red-500">
                {{ passwordFormatError }}
              </p>
            </div>

            <!-- Password Confirm -->
            <div>
              <label
                for="password-confirm"
                class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                >비밀번호 확인</label
              >
              <input
                id="password-confirm"
                type="password"
                required
                v-model="form.passwordConfirm"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition"
                :class="
                  passwordMismatch ? 'border-red-300 focus:ring-red-400' : 'focus:ring-blue-500'
                "
                placeholder="비밀번호를 다시 입력하세요"
              />
              <p v-if="passwordMismatch" class="mt-1.5 text-xs text-red-500">
                비밀번호가 일치하지 않습니다.
              </p>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex gap-3 mt-8">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="prevStep"
              class="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
            >
              이전
            </button>
            <button
              v-if="currentStep < totalSteps"
              type="button"
              @click="nextStep"
              :disabled="!isCurrentStepValid"
              class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-sm transition-colors"
            >
              다음
            </button>
            <button
              v-if="currentStep === totalSteps"
              type="submit"
              :disabled="isLoading || !isCurrentStepValid"
              class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <LoadingSpinner v-if="isLoading" size="sm" class="text-white p-0" />
              <span>{{ isLoading ? '가입 중...' : '가입하기' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Footer Link -->
      <p class="text-center text-sm text-gray-500 mt-6">
        이미 계정이 있으신가요?
        <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-700 ml-1"
          >로그인하기</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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

// 에러 상태
const emailError = ref('')
const nicknameError = ref('')
const handleError = ref('')
const phoneError = ref('')
const passwordFormatError = ref('')
const passwordMismatch = ref(false)

// Stepper 상태
const currentStep = ref(1)
const totalSteps = 5

const nextStep = () => {
  if (currentStep.value < totalSteps) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const isStep1Valid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return form.value.email.length > 0 && emailRegex.test(form.value.email) && !emailError.value
})

const isStep2Valid = computed(() => {
  return form.value.nickname.length >= 2 && form.value.nickname.length <= 20 && !nicknameError.value
})

const isStep3Valid = computed(() => {
  let finalHandle = form.value.handle.trim()
  if (!finalHandle.startsWith('@')) {
    finalHandle = '@' + finalHandle
  }
  const handleRegex = /^@[a-zA-Z0-9_.]{4,20}$/
  return form.value.handle.length > 0 && handleRegex.test(finalHandle) && !handleError.value
})

const isStep4Valid = computed(() => !phoneError.value) // 전화번호는 선택사항이지만 에러가 없어야 함

const isStep5Valid = computed(() => {
  return (
    form.value.password.length >= 8 &&
    !passwordFormatError.value &&
    form.value.passwordConfirm.length > 0 &&
    form.value.password === form.value.passwordConfirm &&
    !passwordMismatch.value
  )
})

const isCurrentStepValid = computed(() => {
  if (currentStep.value === 1) return isStep1Valid.value
  if (currentStep.value === 2) return isStep2Valid.value
  if (currentStep.value === 3) return isStep3Valid.value
  if (currentStep.value === 4) return isStep4Valid.value
  if (currentStep.value === 5) return isStep5Valid.value
  return false
})

// Debounce 유틸
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// 이메일 검증
const checkEmail = async (email: string) => {
  if (!email) {
    emailError.value = ''
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = '올바른 이메일 형식이 아닙니다.'
    return
  }

  try {
    const res = await http.get(`/api/users/check-email?email=${encodeURIComponent(email)}`)
    if (res.data === true) {
      emailError.value = '이미 사용 중인 이메일입니다.'
    } else {
      emailError.value = ''
    }
  } catch {
    emailError.value = ''
  }
}

// 닉네임 검증
const checkNickname = (nickname: string) => {
  if (!nickname) {
    nicknameError.value = ''
    return
  }
  if (nickname.length < 2 || nickname.length > 20) {
    nicknameError.value = '닉네임은 2자 이상 20자 이하여야 합니다.'
  } else {
    nicknameError.value = ''
  }
}

// 핸들 검증
const checkHandle = async (handle: string) => {
  if (!handle) {
    handleError.value = ''
    return
  }
  let finalHandle = handle.trim()
  if (!finalHandle.startsWith('@')) {
    finalHandle = '@' + finalHandle
  }

  const handleRegex = /^@[a-zA-Z0-9_.]{4,20}$/
  if (!handleRegex.test(finalHandle)) {
    handleError.value = '핸들은 영문, 숫자, _, .만 사용하여 4~20자로 입력해야 합니다.'
    return
  }

  try {
    const res = await http.get(`/api/users/check-handle?handle=${encodeURIComponent(finalHandle)}`)
    if (res.data === true) {
      handleError.value = '이미 사용 중인 고유 아이디입니다.'
    } else {
      handleError.value = ''
    }
  } catch {
    handleError.value = ''
  }
}

// 비밀번호 검증
const checkPassword = () => {
  if (form.value.password.length > 0 && form.value.password.length < 8) {
    passwordFormatError.value = '비밀번호는 8자 이상이어야 합니다.'
  } else {
    passwordFormatError.value = ''
  }

  passwordMismatch.value =
    form.value.passwordConfirm.length > 0 && form.value.password !== form.value.passwordConfirm
}

// 전화번호 검증
const checkPhone = () => {
  if (form.value.phone && !/^[0-9]+$/.test(form.value.phone)) {
    phoneError.value = '전화번호는 숫자만 입력 가능합니다.'
  } else {
    phoneError.value = ''
  }
}

// 디바운스 적용
const debouncedCheckEmail = debounce(checkEmail, 500)
const debouncedCheckNickname = debounce(checkNickname, 500)
const debouncedCheckHandle = debounce(checkHandle, 500)
const debouncedCheckPhone = debounce(checkPhone, 500)
const debouncedCheckPassword = debounce(checkPassword, 500)

watch(
  () => form.value.email,
  (newVal) => debouncedCheckEmail(newVal),
)
watch(
  () => form.value.nickname,
  (newVal) => debouncedCheckNickname(newVal),
)
watch(
  () => form.value.handle,
  (newVal) => debouncedCheckHandle(newVal),
)
watch(
  () => form.value.phone,
  () => debouncedCheckPhone(),
)
watch(
  () => form.value.password,
  () => debouncedCheckPassword(),
)
watch(
  () => form.value.passwordConfirm,
  () => debouncedCheckPassword(),
)

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
    const payload = {
      email: form.value.email,
      nickname: form.value.nickname,
      handle: finalHandle,
      phone: form.value.phone,
      password: form.value.password,
    }
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
