<template>
  <PageContainer>
    <div
      class="w-full max-w-md mx-auto border-x border-gray-100 bg-white min-h-screen flex flex-col"
    >
      <header
        class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10"
      >
        <div class="flex items-center">
          <button class="mr-4" @click="$router.back()">
            <svg
              class="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </button>
          <h1 class="font-bold text-lg">프로필 관리</h1>
        </div>
      </header>

      <div class="p-4">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 프로필 이미지 -->
          <div class="flex flex-col items-center space-y-4">
            <div class="relative w-24 h-24">
              <img
                :src="form.profileImage || '/default_profile_image.png'"
                @error="(e) => ((e.target as HTMLImageElement).src = '/default_profile_image.png')"
                class="w-24 h-24 rounded-full object-cover border border-gray-200"
                alt="프로필 이미지"
              />

              <label
                class="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white cursor-pointer hover:bg-blue-700 transition shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleImageUpload"
                  :disabled="isUploading"
                />
              </label>

              <button
                v-if="form.profileImage"
                type="button"
                @click="removeProfileImage"
                class="absolute bottom-0 left-0 bg-red-500 rounded-full p-2 text-white cursor-pointer hover:bg-red-600 transition shadow-sm"
                title="프로필 이미지 삭제"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
            <p v-if="isUploading" class="text-sm text-gray-500">이미지 업로드 중...</p>
          </div>

          <!-- 닉네임 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              v-model="form.nickname"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
              minlength="2"
              maxlength="20"
            />
          </div>

          <!-- 핸들 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">핸들</label>
            <input
              v-model="form.handle"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
              pattern="^@[a-zA-Z0-9_.]{4,20}$"
              title="핸들은 @로 시작하고 영문, 숫자, _, .만 사용할 수 있습니다 (4~20자)"
              @input="onHandleInput"
            />
            <p v-if="handleMessage" :class="handleMessageClass" class="text-sm mt-1">
              {{ handleMessage }}
            </p>
          </div>

          <!-- 자기소개 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
            <textarea
              v-model="form.bio"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="자기소개를 입력해주세요."
            ></textarea>
          </div>

          <!-- 역할 토글 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">역할</label>
            <div
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    form.role === 'ADMIN'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700',
                  ]"
                >
                  {{ form.role === 'ADMIN' ? '관리자' : '일반 사용자' }}
                </span>
                <span class="text-sm text-gray-500">
                  {{
                    form.role === 'ADMIN'
                      ? '모든 기능에 접근할 수 있습니다.'
                      : '기본 서비스를 이용할 수 있습니다.'
                  }}
                </span>
              </div>
              <!-- 토글 스위치 -->
              <button
                type="button"
                @click="toggleRole"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50',
                  form.role === 'ADMIN' ? 'bg-amber-500' : 'bg-gray-300',
                ]"
                :title="form.role === 'ADMIN' ? '일반 사용자로 변경' : '관리자로 변경'"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
                    form.role === 'ADMIN' ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting || isUploading || !isHandleAvailable"
          >
            {{ isSubmitting ? '저장 중...' : '저장하기' }}
          </button>
        </form>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAlert } from '@/composables/useAlert'
import PageContainer from '@/components/common/PageContainer.vue'
import { updateUserProfile, uploadImage, checkHandle, updateUserRole } from '@/api/user'

const router = useRouter()
const authStore = useAuthStore()
const { showAlert } = useAlert()

const form = ref({
  nickname: '',
  handle: '',
  profileImage: '' as string | null,
  bio: '' as string | null,
  role: 'USER' as 'USER' | 'ADMIN',
})

const isUploading = ref(false)
const isSubmitting = ref(false)

const handleMessage = ref('')
const isHandleAvailable = ref(true)
const handleMessageColor = ref('text-green-500')
let handleTimeout: ReturnType<typeof setTimeout> | null = null

const handleMessageClass = computed(() => {
  return handleMessageColor.value
})

onMounted(() => {
  const user = authStore.user
  if (user) {
    form.value.nickname = user.nickname
    form.value.handle = user.handle
    form.value.profileImage = user.profileImage
    form.value.role = (user.role as 'USER' | 'ADMIN') || 'USER'
    // bio는 authStore.User 타입에 없으므로 unknown 캐스팅으로 접근
    const userWithBio = user as unknown as { bio?: string | null }
    form.value.bio = userWithBio.bio ?? ''
  } else {
    router.push('/login')
  }
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (!file) return

  try {
    isUploading.value = true
    const tempUrl = await uploadImage(file)
    form.value.profileImage = tempUrl
  } catch (error) {
    showAlert('이미지 업로드에 실패했습니다.', 'error')
    console.error(error)
  } finally {
    isUploading.value = false
  }
}

const removeProfileImage = () => {
  form.value.profileImage = null
}

const onHandleInput = () => {
  if (handleTimeout) clearTimeout(handleTimeout)

  if (!form.value.handle || !/^@[a-zA-Z0-9_.]{4,20}$/.test(form.value.handle)) {
    handleMessage.value = '핸들은 @로 시작하고 영문, 숫자, _, .만 사용할 수 있습니다 (4~20자)'
    handleMessageColor.value = 'text-red-500'
    isHandleAvailable.value = false
    return
  }

  // If it's the current user's handle, it's valid and available
  if (form.value.handle === authStore.user?.handle) {
    handleMessage.value = '현재 사용 중인 핸들입니다.'
    handleMessageColor.value = 'text-green-500'
    isHandleAvailable.value = true
    return
  }

  handleMessage.value = '핸들 확인 중...'
  isHandleAvailable.value = false

  handleTimeout = setTimeout(async () => {
    try {
      const result = await checkHandle(form.value.handle)
      isHandleAvailable.value = result.available
      handleMessage.value = result.available
        ? '사용 가능한 핸들입니다.'
        : '이미 사용 중인 핸들입니다.'
    } catch {
      handleMessage.value = '핸들 중복 확인에 실패했습니다.'
      isHandleAvailable.value = false
    }
  }, 500)
}

// 토글 시 로컬 상태만 변경하고, 실제 저장은 handleSubmit에서 처리합니다.
const toggleRole = () => {
  form.value.role = form.value.role === 'ADMIN' ? 'USER' : 'ADMIN'
}

const handleSubmit = async () => {
  if (!authStore.user?.id) return

  try {
    isSubmitting.value = true

    // 프로필 정보와 역할을 병렬로 저장합니다.
    const profilePromise = updateUserProfile(authStore.user.id, {
      nickname: form.value.nickname,
      handle: form.value.handle,
      bio: form.value.bio,
      profileImage: form.value.profileImage,
    })

    const roleChanged = form.value.role !== authStore.user.role
    const rolePromise = roleChanged
      ? updateUserRole(authStore.user.id, form.value.role)
      : Promise.resolve()

    await Promise.all([profilePromise, rolePromise])

    // 로컬 스토어 갱신
    authStore.setAuth(authStore.token!, {
      ...authStore.user,
      nickname: form.value.nickname,
      handle: form.value.handle,
      profileImage: form.value.profileImage,
      bio: form.value.bio,
      role: form.value.role,
    } as unknown as NonNullable<typeof authStore.user>)

    showAlert('프로필이 저장되었습니다.', 'success')
    router.replace(`/users/${form.value.handle}`)
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    showAlert(err.response?.data || '프로필 수정에 실패했습니다.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
