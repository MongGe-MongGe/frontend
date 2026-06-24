<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900">장소 저장</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else>
        <!-- Group List -->
        <div class="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
          <button
            v-for="group in groups"
            :key="group.id"
            @click="saveToGroup(group.id)"
            class="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-primary hover:bg-pink-50 transition-colors text-left"
          >
            <span class="font-medium text-gray-900">{{ group.name }}</span>
            <span class="text-xs text-gray-400">{{ group.goodPlaceCount }}개</span>
          </button>

          <div v-if="groups.length === 0" class="text-center py-4 text-sm text-gray-500">
            아직 생성된 그룹이 없습니다.
          </div>
        </div>

        <!-- Create New Group -->
        <div class="flex gap-2">
          <input
            v-model="newGroupName"
            type="text"
            placeholder="새 그룹 이름 입력"
            class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
            @keyup.enter="handleCreateGroup"
          />
          <button
            @click="handleCreateGroup"
            :disabled="!newGroupName.trim() || isCreating"
            class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyGroups, createGroup } from '@/api/group'
import { createGoodPlace } from '@/api/goodPlace'
import { useAlert } from '@/composables/useAlert'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  place: any
}>()

const emit = defineEmits(['close', 'saved'])
const { showAlert } = useAlert()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groups = ref<any[]>([])
const isLoading = ref(true)
const newGroupName = ref('')
const isCreating = ref(false)

const fetchGroups = async () => {
  try {
    isLoading.value = true
    groups.value = await getMyGroups()
  } catch (error) {
    console.error('Failed to fetch groups', error)
    showAlert('그룹 목록을 불러오지 못했습니다.', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleCreateGroup = async () => {
  if (!newGroupName.value.trim() || isCreating.value) return

  try {
    isCreating.value = true
    const newGroup = await createGroup(newGroupName.value.trim())
    groups.value.push(newGroup)
    newGroupName.value = ''
  } catch (error) {
    console.error('Failed to create group', error)
    showAlert('그룹 생성에 실패했습니다.', 'error')
  } finally {
    isCreating.value = false
  }
}

const saveToGroup = async (groupId: string) => {
  try {
    await createGoodPlace(groupId, {
      id: String(props.place.id),
      name: props.place.place_name || props.place.title || props.place.name,
      category_name: props.place.category_name || props.place.categoryName || '',
      category_group_code: props.place.category_group_code || props.place.categoryGroupCode || '',
      phone: props.place.phone || '',
      address_name:
        props.place.address_name || props.place.addressName || props.place.address || '',
      road_address_name: props.place.road_address_name || props.place.roadAddressName || '',
      x: String(props.place.x || props.place.lng || '0'),
      y: String(props.place.y || props.place.lat || '0'),
      place_url: props.place.place_url || props.place.placeUrl || '',
    })
    showAlert('장소가 저장되었습니다.', 'success')
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Failed to save place', error)
    showAlert('장소 저장에 실패했습니다. 이미 저장된 장소일 수 있습니다.', 'error')
  }
}

onMounted(() => {
  fetchGroups()
})
</script>
