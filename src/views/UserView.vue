<template>
  <PageContainer>
    <div
      class="w-full max-w-md mx-auto border-x border-gray-100 bg-white min-h-screen relative flex flex-col"
    >
      <header
        class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10"
      >
        <h1 class="font-bold text-lg">{{ user?.handle || '@handle' }}</h1>
        <router-link v-if="isMyProfile" to="/settings" class="text-gray-900">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </router-link>
        <button
          v-else-if="user"
          @click="toggleFollow"
          :class="[
            'px-4 py-1.5 rounded-full font-bold text-xs transition',
            user?.isFollowing
              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          ]"
        >
          {{ user?.isFollowing ? '팔로잉' : user?.isFollower ? '맞팔로우' : '팔로우' }}
        </button>
      </header>

      <div class="p-4">
        <div class="flex items-center space-x-6 mb-6">
          <img
            :src="user?.profileImage || '/default_profile_image.png'"
            @error="(e) => ((e.target as HTMLImageElement).src = '/default_profile_image.png')"
            class="w-20 h-20 bg-gray-200 rounded-full shrink-0 object-cover"
            alt="프로필 이미지"
          />
          <div class="flex-1 flex justify-evenly text-center">
            <div>
              <div class="font-bold text-lg">{{ reviews.length }}</div>
              <div class="text-xs text-gray-500">리뷰</div>
            </div>
            <div
              class="cursor-pointer hover:opacity-70 transition"
              @click="openFollowModal('followers')"
            >
              <div class="font-bold text-lg">{{ user?.followerCount || 0 }}</div>
              <div class="text-xs text-gray-500">팔로워</div>
            </div>
            <div
              class="cursor-pointer hover:opacity-70 transition"
              @click="openFollowModal('followings')"
            >
              <div class="font-bold text-lg">{{ user?.followingCount || 0 }}</div>
              <div class="text-xs text-gray-500">팔로잉</div>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <h2 class="font-bold text-gray-900">{{ user?.nickname || '유저명' }}</h2>
          <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">
            {{ user?.bio || '자기소개가 없습니다.' }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-t border-gray-200">
        <button
          @click="activeTab = 'reviews'"
          class="flex-1 py-3 text-center transition-colors font-bold"
          :class="
            activeTab === 'reviews'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          "
        >
          리뷰 피드
        </button>
        <button
          @click="activeTab = 'groups'"
          class="flex-1 py-3 text-center transition-colors font-bold"
          :class="
            activeTab === 'groups'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          "
        >
          맛집 그룹
        </button>
      </div>

      <template v-if="activeTab === 'reviews'">
        <!-- Grid -->
        <div v-if="reviews.length > 0" class="grid grid-cols-3 gap-1">
          <router-link
            v-for="review in reviews"
            :key="review.id"
            :to="`/feed/user_${user?.id}/${review.id}`"
            class="aspect-square bg-gray-200 relative group overflow-hidden block"
          >
            <img
              v-if="review.images && review.images.length > 0"
              :src="review.images[0]"
              class="w-full h-full object-cover"
            />
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center px-4">
          <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <svg
              class="w-10 h-10 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">아직 작성된 리뷰가 없습니다</h3>
          <p class="text-sm text-gray-500 mb-6">
            {{
              isMyProfile
                ? '우측 하단의 작성 버튼을 눌러 첫 리뷰를 남겨보세요!'
                : '이 유저는 아직 리뷰를 작성하지 않았습니다.'
            }}
          </p>
        </div>
      </template>

      <template v-else-if="activeTab === 'groups'">
        <!-- Group Creation Input -->
        <div v-if="isMyProfile" class="p-4 border-b border-gray-100 bg-white">
          <div class="flex gap-2">
            <input
              v-model="newGroupName"
              type="text"
              placeholder="새 맛집 그룹 만들기"
              class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
              @keyup.enter="handleCreateGroup"
            />
            <button
              @click="handleCreateGroup"
              :disabled="!newGroupName.trim() || isCreatingGroup"
              class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              생성
            </button>
          </div>
        </div>
        <div v-if="isGroupsLoading" class="flex justify-center p-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div
          v-else-if="groups.length === 0"
          class="flex flex-col items-center justify-center py-24 text-center px-4"
        >
          <h3 class="font-bold text-gray-900 text-lg mb-2">아직 생성된 맛집 그룹이 없습니다</h3>
        </div>
        <div v-else class="p-4 space-y-4 pb-20">
          <div
            v-for="group in groups"
            :key="group.id"
            class="border border-gray-100 rounded-xl bg-white shadow-sm"
          >
            <div
              @click="!editingGroupId || editingGroupId !== group.id ? toggleGroup(group.id) : null"
              class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'rounded-xl': selectedGroupId !== group.id, 'rounded-t-xl': selectedGroupId === group.id }"
            >
              <div class="flex-1 mr-4">
                <template v-if="editingGroupId === group.id">
                  <input
                    type="text"
                    v-model="editingGroupName"
                    class="w-full font-bold text-gray-900 border-b-2 border-primary focus:outline-none bg-transparent"
                    @click.stop
                    @keyup.enter="handleEditGroupSave(group)"
                    placeholder="그룹 이름을 입력하세요"
                    autofocus
                  />
                  <p class="text-xs text-gray-500 mt-1">장소 {{ group.goodPlaceCount }}개</p>
                </template>
                <template v-else>
                  <h3 class="font-bold text-gray-900">{{ group.name }}</h3>
                  <p class="text-xs text-gray-500 mt-1">장소 {{ group.goodPlaceCount }}개</p>
                </template>
              </div>
              <div class="flex items-center space-x-3">
                <!-- Group Actions -->
                <div
                  v-if="selectedGroupId === group.id && isMyProfile && !group.defaultGroup"
                  class="flex space-x-2"
                  @click.stop
                >
                  <template v-if="editingGroupId === group.id">
                    <Tooltip content="수정하기">
                      <button
                        @click.stop="handleEditGroupSave(group)"
                        class="p-1.5 text-gray-400 hover:text-green-600 rounded bg-transparent hover:bg-green-50 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip content="취소하기">
                      <button
                        @click.stop="handleEditGroupCancel()"
                        class="p-1.5 text-gray-400 hover:text-gray-900 rounded bg-transparent hover:bg-gray-100 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </template>
                  <template v-else>
                    <Tooltip content="그룹 수정">
                      <button
                        @click.stop="handleEditGroupStart(group)"
                        class="p-1.5 text-gray-400 hover:text-primary rounded bg-transparent hover:bg-pink-50 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip content="그룹 삭제">
                      <button
                        @click.stop="handleDeleteGroup(group.id)"
                        class="p-1.5 text-gray-400 hover:text-red-600 rounded bg-transparent hover:bg-red-50 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </template>
                </div>

                <svg
                  class="w-5 h-5 text-gray-400 transform transition-transform"
                  :class="{ 'rotate-180': selectedGroupId === group.id }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div v-if="selectedGroupId === group.id" class="border-t border-gray-100 bg-gray-50 rounded-b-xl overflow-hidden">

              <div v-if="!groupPlaces[group.id]" class="p-4 flex justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>
              <div
                v-else-if="groupPlaces[group.id]?.length === 0"
                class="p-6 text-center text-sm text-gray-500"
              >
                이 그룹에 저장된 장소가 없습니다.
              </div>
              <div v-else class="divide-y divide-gray-100">
                <div
                  v-for="placeInfo in groupPlaces[group.id]"
                  :key="placeInfo.id"
                  class="p-4 flex items-center justify-between bg-white group/item"
                >
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-900 text-sm">{{ placeInfo.place.name }}</span>
                    <span class="text-xs text-gray-500 mt-1">{{
                      placeInfo.place.roadAddressName ||
                      placeInfo.place.addressName ||
                      '주소 정보 없음'
                    }}</span>
                    <span class="text-xs text-primary mt-1">{{
                      placeInfo.place.categoryName
                    }}</span>
                  </div>
                  <button
                    v-if="isMyProfile"
                    @click="handleDeletePlace(group.id, placeInfo.place.id)"
                    class="text-gray-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover/item:opacity-100"
                    title="저장 취소"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Floating Review Write Button -->
      <ReviewWriteWidget v-if="isMyProfile" ref="writeWidget" @success="onReviewCreated" />

      <!-- Follow List Modal -->
      <FollowListModal
        v-if="isModalOpen && user"
        :user-id="user.id"
        :type="modalType"
        @close="closeFollowModal"
      />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFeedStore } from '@/stores/feed'
import { useAlert } from '@/composables/useAlert'
import { useConfirm } from '@/composables/useConfirm'
import { getUserProfile, followUser, unfollowUser } from '@/api/user'
import { getUserGroups, deleteGroup, updateGroup, createGroup } from '@/api/group'
import { getGroupGoodPlaces, deleteGoodPlaceFromGroup } from '@/api/goodPlace'
import PageContainer from '@/components/common/PageContainer.vue'
import Tooltip from '@/components/common/Tooltip.vue'
import FollowListModal from '@/components/user/FollowListModal.vue'
import ReviewWriteWidget from '@/components/review/ReviewWriteWidget.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const feedStore = useFeedStore()
const { showAlert } = useAlert()
const { confirm } = useConfirm()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const writeWidget = ref<any>(null)

interface UserProfile {
  id: string
  nickname: string
  handle: string
  profileImage?: string
  bio?: string
  followerCount: number
  followingCount: number
  isFollowing: boolean
  isFollower: boolean
}

const user = ref<UserProfile | null>(null)
const isLoading = ref(true)

const activeTab = ref<'reviews' | 'groups'>('reviews')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groups = ref<any[]>([])
const selectedGroupId = ref<string | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupPlaces = ref<Record<string, any[]>>({})
const isGroupsLoading = ref(false)

const newGroupName = ref('')
const isCreatingGroup = ref(false)

const handleCreateGroup = async () => {
  if (!newGroupName.value.trim() || isCreatingGroup.value) return

  try {
    isCreatingGroup.value = true
    await createGroup(newGroupName.value.trim())
    newGroupName.value = ''
    showAlert('그룹이 생성되었습니다.', 'success')
    await loadUserGroups() // 새로 생성된 그룹 반영
  } catch (error) {
    console.error('Failed to create group', error)
    showAlert('그룹 생성에 실패했습니다.', 'error')
  } finally {
    isCreatingGroup.value = false
  }
}

const loadUserGroups = async () => {
  if (!user.value) return
  try {
    isGroupsLoading.value = true
    groups.value = await getUserGroups(user.value.id)
  } catch (error) {
    console.error('Failed to load groups', error)
  } finally {
    isGroupsLoading.value = false
  }
}

const toggleGroup = async (groupId: string) => {
  if (selectedGroupId.value === groupId) {
    selectedGroupId.value = null
    return
  }
  selectedGroupId.value = groupId
  if (!groupPlaces.value[groupId]) {
    try {
      const res = await getGroupGoodPlaces(user.value!.id, groupId)
      groupPlaces.value[groupId] = res.content
    } catch (error) {
      console.error('Failed to load group places', error)
    }
  }
}

const editingGroupId = ref<string | null>(null)
const editingGroupName = ref<string>('')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEditGroupStart = (group: any) => {
  editingGroupId.value = group.id
  editingGroupName.value = group.name
}

const handleEditGroupCancel = () => {
  editingGroupId.value = null
  editingGroupName.value = ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEditGroupSave = async (group: any) => {
  const newName = editingGroupName.value.trim()
  if (!newName || newName === group.name) {
    handleEditGroupCancel()
    return
  }

  try {
    const updatedGroup = await updateGroup(group.id, newName)
    group.name = updatedGroup.name
    handleEditGroupCancel()
    showAlert('그룹 이름이 수정되었습니다.', 'success')
  } catch (error) {
    console.error('Failed to update group name', error)
    showAlert('그룹 이름 수정에 실패했습니다.', 'error')
  }
}

const handleDeleteGroup = async (groupId: string) => {
  const ok = await confirm({
    title: '그룹 삭제',
    message: '정말로 이 그룹을 삭제하시겠습니까?\n저장된 장소 정보도 함께 그룹에서 해제됩니다.',
    confirmText: '삭제',
    danger: true,
  })
  if (!ok) return

  try {
    await deleteGroup(groupId)
    groups.value = groups.value.filter((g) => g.id !== groupId)
    if (selectedGroupId.value === groupId) {
      selectedGroupId.value = null
    }
    showAlert('그룹이 삭제되었습니다.', 'success')
  } catch (error) {
    console.error('Failed to delete group', error)
    showAlert('그룹 삭제에 실패했습니다.', 'error')
  }
}

const handleDeletePlace = async (groupId: string, placeId: string) => {
  const ok = await confirm({
    title: '장소 저장 취소',
    message: '이 장소를 그룹에서 저장 취소하시겠습니까?',
    confirmText: '저장 취소',
    danger: true,
  })
  if (!ok) return

  try {
    await deleteGoodPlaceFromGroup(groupId, placeId)
    if (groupPlaces.value[groupId]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      groupPlaces.value[groupId] = groupPlaces.value[groupId].filter(
        (p: any) => p.place.id !== placeId,
      )
    }
    const group = groups.value.find((g) => g.id === groupId)
    if (group) {
      group.goodPlaceCount--
    }
    showAlert('장소 저장이 취소되었습니다.', 'info')
  } catch (error) {
    console.error('Failed to delete place from group', error)
    showAlert('장소 저장 취소에 실패했습니다.', 'error')
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'groups' && groups.value.length === 0) {
    loadUserGroups()
  }
})
const reviews = computed(() => {
  if (!user.value) return []
  return feedStore.getContext(`user_${user.value.id}`).items
})

const onReviewCreated = () => {
  if (user.value) {
    feedStore.loadUserReviews(user.value.id, true)
  }
}

const isMyProfile = computed(() => {
  return authStore.user?.handle === user.value?.handle
})

const isModalOpen = computed(() => {
  return !!route.query.modal
})
const modalType = computed<'followers' | 'followings'>(() => {
  return (route.query.modal as 'followers' | 'followings') || 'followers'
})

const openFollowModal = (type: 'followers' | 'followings') => {
  if (!user.value) return
  router.push({ query: { ...route.query, modal: type } })
}

const closeFollowModal = () => {
  const query = { ...route.query }
  delete query.modal
  router.push({ query })
}

const isTogglingFollow = ref(false)

const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    showAlert('로그인이 필요합니다.', 'info')
    return
  }

  if (!user.value) return
  if (isTogglingFollow.value) return

  const prevFollowing = user.value.isFollowing
  const prevCount = user.value.followerCount

  user.value.isFollowing = !prevFollowing
  user.value.followerCount = prevFollowing ? prevCount - 1 : prevCount + 1
  isTogglingFollow.value = true

  try {
    if (prevFollowing) {
      await unfollowUser(user.value.id)
    } else {
      await followUser(user.value.id)
    }
  } catch (error) {
    user.value.isFollowing = prevFollowing
    user.value.followerCount = prevCount
    console.error('Follow toggle error:', error)
    showAlert('팔로우 상태를 변경할 수 없습니다.', 'error')
  } finally {
    isTogglingFollow.value = false
  }
}

const loadProfile = async () => {
  try {
    isLoading.value = true
    const rawHandle = route.params.handle as string
    const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`
    user.value = await getUserProfile(handle)

    if (user.value) {
      await feedStore.loadUserReviews(user.value.id, true)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to load user profile:', error)
    user.value = null
    // 유저를 찾을 수 없는 경우 (404 상태 코드인 경우)
    if (error.response?.status === 404) {
      router.push('/404')
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadProfile)
watch(() => route.params.handle, loadProfile)
</script>
