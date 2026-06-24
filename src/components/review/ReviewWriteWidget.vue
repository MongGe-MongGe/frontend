<template>
  <div>
    <!-- Floating Button -->
    <button
      @click="openModal"
      class="fixed bottom-12 right-12 w-12 h-12 flex items-center justify-center bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition transform hover:scale-105 z-40"
      aria-label="리뷰 작성"
    >
      <!-- Feather Pen Icon -->
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
      </svg>
    </button>

    <!-- Modal Overlay -->
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        <!-- Header -->
        <header class="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 class="font-bold text-lg text-gray-900">{{ isEdit ? '리뷰 수정' : '새 리뷰 작성' }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </header>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-6">
          <!-- Place Selection -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">장소 선택</label>
            <div 
              @click="openPlaceSearch"
              class="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              :class="{'border-gray-900 bg-gray-50': selectedPlace}"
            >
              <div v-if="selectedPlace" class="flex flex-col">
                <span class="font-bold text-gray-900">{{ selectedPlace.name }}</span>
                <span class="text-xs text-gray-500">{{ selectedPlace.roadAddressName || selectedPlace.addressName }}</span>
              </div>
              <div v-else class="text-gray-500 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                장소를 검색해주세요
              </div>
            </div>
          </div>

          <!-- Star Rating -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">별점</label>
            <div class="flex space-x-2">
              <button 
                v-for="star in 5" 
                :key="star" 
                @click="rating = star"
                class="focus:outline-none transition-transform hover:scale-110"
              >
                <svg class="w-8 h-8" :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">사진 ({{ images.length }}/6)</label>
            <div class="flex flex-wrap gap-2">
              <div v-for="(img, idx) in images" :key="idx" class="relative w-20 h-20 rounded-lg overflow-hidden border">
                <img :src="img.preview || img.url" class="w-full h-full object-cover" />
                <button @click="removeImage(idx)" class="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-opacity-70">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <button 
                v-if="images.length < 6" 
                @click="$refs.fileInput.click()" 
                class="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              >
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span class="text-xs">추가</span>
              </button>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" multiple @change="handleFileChange" />
            </div>
          </div>

          <!-- Content -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">리뷰 내용</label>
            <textarea 
              v-model="content" 
              rows="4" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              placeholder="음식의 맛, 분위기 등 경험을 자유롭게 작성해주세요!"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t bg-gray-50 flex justify-end space-x-2">
          <button @click="closeModal" class="px-6 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition">
            취소
          </button>
          <button 
            @click="submitReview" 
            :disabled="isSubmitting || !isValid"
            class="px-6 py-2.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="isSubmitting" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isEdit ? '수정 완료' : '등록하기' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Place Search Modal component -->
    <PlaceSearchModal 
      v-if="isPlaceSearchOpen" 
      @close="isPlaceSearchOpen = false" 
      @select="onPlaceSelected" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFeedStore } from '@/stores/feed'
import { useAlert } from '@/composables/useAlert'
import PlaceSearchModal from '@/components/common/PlaceSearchModal.vue'
import { createReview, updateReview } from '@/api/review'
import { uploadImage } from '@/api/user'

const props = defineProps({
  editData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['success'])

const feedStore = useFeedStore()
const { showAlert } = useAlert()

const isOpen = ref(false)
const isEdit = ref(false)
const editingId = ref<string | null>(null)
const isPlaceSearchOpen = ref(false)

const selectedPlace = ref<any>(null)
const rating = ref(5)
const content = ref('')
const images = ref<Array<{file?: File, url?: string, preview?: string}>>([])
const isSubmitting = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

const isValid = computed(() => {
  return selectedPlace.value && content.value.trim().length > 0 && images.value.length > 0 && rating.value >= 1
})

const openModal = (editData: any = null) => {
  if (editData && editData.id) {
    isEdit.value = true
    editingId.value = editData.id
    selectedPlace.value = editData.place
    rating.value = editData.ratingScore
    content.value = editData.content
    images.value = editData.images.map((url: string) => ({ url }))
  } else if (props.editData && props.editData.id) {
    isEdit.value = true
    editingId.value = props.editData.id
    selectedPlace.value = props.editData.place
    rating.value = props.editData.ratingScore
    content.value = props.editData.content
    images.value = props.editData.images.map((url: string) => ({ url }))
  } else {
    isEdit.value = false
    editingId.value = null
    selectedPlace.value = null
    rating.value = 5
    content.value = ''
    images.value = []
  }
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

const openPlaceSearch = () => {
  if (isEdit.value) return // 수정 시에는 장소 변경 불가 (일반적인 룰, 필요시 해제 가능)
  isPlaceSearchOpen.value = true
}

const onPlaceSelected = (place: any) => {
  selectedPlace.value = place
  isPlaceSearchOpen.value = false
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files) return

  const newFiles = Array.from(target.files)
  
  if (images.value.length + newFiles.length > 6) {
    showAlert('이미지는 최대 6장까지 첨부할 수 있습니다.', 'warning')
    return
  }

  newFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      images.value.push({
        file,
        preview: e.target?.result as string
      })
    }
    reader.readAsDataURL(file)
  })
  
  // reset input
  if (fileInput.value) fileInput.value.value = ''
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const submitReview = async () => {
  if (!isValid.value) return
  isSubmitting.value = true

  try {
    // 1. Upload new images
    const uploadedUrls: string[] = []
    
    for (const img of images.value) {
      if (img.url) {
        uploadedUrls.push(img.url) // existing image
      } else if (img.file) {
        const res = await uploadImage(img.file)
        uploadedUrls.push(res)
      }
    }

    // 2. Prepare payload
    const payload: any = {
      content: content.value.trim(),
      ratingScore: rating.value,
      images: uploadedUrls,
      visitedAt: new Date().toISOString().split('T')[0] // today's date for simplicity
    }

    if (isEdit.value && editingId.value) {
      const updated = await updateReview(editingId.value, payload)
      feedStore.updateFeedLocally(updated)
    } else {
      payload.place = {
        id: selectedPlace.value.id,
        name: selectedPlace.value.place_name || selectedPlace.value.name,
        categoryName: selectedPlace.value.category_name,
        roadAddressName: selectedPlace.value.road_address_name,
        addressName: selectedPlace.value.address_name,
        x: selectedPlace.value.x,
        y: selectedPlace.value.y,
        placeUrl: selectedPlace.value.place_url || selectedPlace.value.url
      }
      const created = await createReview(payload)
      feedStore.prependFeedLocally(created, ['home'])
    }

    closeModal()
    emit('success')
    showAlert(
      isEdit.value ? '리뷰가 수정되었습니다.' : '리뷰가 등록되었습니다.',
      'success',
    )
  } catch (error) {
    console.error('Failed to submit review', error)
    showAlert('리뷰 저장에 실패했습니다. 다시 시도해주세요.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Expose openModal to parent
defineExpose({
  openModal
})
</script>
