<template>
  <PageContainer>
    <header
      class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10"
    >
      <div class="flex items-center">
        <button class="mr-4" @click="$router.back()">
          <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    <div class="p-4 w-full max-w-3xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 프로필 이미지 -->
        <div class="flex flex-col items-center space-y-4">
          <div class="relative w-24 h-24">
            <img
              v-if="form.profileImage"
              :src="form.profileImage"
              class="w-24 h-24 rounded-full object-cover border border-gray-200"
              alt="프로필 이미지"
            />
            <div
              v-else
              class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>

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

        <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting || isUploading || !isHandleAvailable"
        >
          {{ isSubmitting ? '저장 중...' : '저장하기' }}
        </button>
      </form>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PageContainer from '@/components/common/PageContainer.vue'
import { updateUserProfile, uploadImage, checkHandle } from '@/api/user'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  nickname: '',
  handle: '',
  profileImage: '' as string | null,
  bio: '' as string | null,
})

const isUploading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleMessage = ref('')
const isHandleAvailable = ref(true)
const handleMessageColor = ref('text-green-500')
let handleTimeout: ReturnType<typeof setTimeout> | null = null

const handleMessageClass = computed(() => {
  return handleMessageColor.value
})

onMounted(() => {
  if (authStore.user) {
    form.value.nickname = authStore.user.nickname
    form.value.handle = authStore.user.handle
    // TODO: authStore.user.bio is not in User type, we need to add it or just ignore it if it doesn't exist
    // But backend UserEntity has bio, so we should be able to store/retrieve it.
    form.value.bio = (authStore.user as unknown as { bio?: string }).bio || ''
    form.value.profileImage = authStore.user.profileImage
  } else {
    router.push('/login')
  }
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  try {
    isUploading.value = true
    errorMessage.value = ''
    const tempUrl = await uploadImage(file)
    form.value.profileImage = tempUrl
  } catch (error) {
    errorMessage.value = '이미지 업로드에 실패했습니다.'
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

const handleSubmit = async () => {
  if (!authStore.user?.id) return

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    await updateUserProfile(authStore.user.id, {
      nickname: form.value.nickname,
      handle: form.value.handle,
      bio: form.value.bio,
      profileImage: form.value.profileImage,
    })

    // Update local store
    authStore.setAuth(authStore.token!, {
      ...authStore.user,
      nickname: form.value.nickname,
      handle: form.value.handle,
      profileImage: form.value.profileImage,
      bio: form.value.bio,
    } as unknown as NonNullable<typeof authStore.user>)

    router.replace(`/users/${form.value.handle}`)
  } catch (error: unknown) {
    const err = error as { response?: { data?: string } }
    errorMessage.value = err.response?.data || '프로필 수정에 실패했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
