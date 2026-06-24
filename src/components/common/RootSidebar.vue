<template>
  <!-- 항상 아이콘 전용(w-16) 고정 너비, 토글 없음 -->
  <aside class="h-full w-16 bg-white border-r border-gray-200 flex flex-col z-50 shrink-0">

    <!-- Header / Logo -->
    <div class="h-16 flex items-center justify-center border-b border-gray-100">
      <router-link to="/" class="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="홈">
        <AppLogo size="sm" />
      </router-link>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 py-4 flex flex-col gap-1 px-2">

      <!-- 탐색 -->
      <SidebarItem to="/explore" label="탐색">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </SidebarItem>

      <!-- 지도 -->
      <SidebarItem to="/map" label="지도">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </SidebarItem>

      <!-- 게시판 -->
      <SidebarItem to="/board" label="게시판">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </SidebarItem>

    </nav>

    <!-- Bottom: Profile / Login -->
    <div class="p-2 border-t border-gray-100 flex flex-col gap-1">

      <!-- 로그인된 상태 -->
      <template v-if="authStore.token">
        <router-link
          v-if="authStore.user?.handle"
          :to="`/users/${authStore.user.handle}`"
          class="relative flex items-center justify-center h-12 rounded-xl hover:bg-gray-100 transition-colors group"
          active-class="bg-blue-50"
          :aria-label="authStore.user.nickname || '마이 페이지'"
        >
          <!-- 프로필 이미지 -->
          <div class="relative">
            <img
              :src="authStore.user?.profileImage || '/default_profile_image.png'"
              @error="(e) => ((e.target as HTMLImageElement).src = '/default_profile_image.png')"
              alt="프로필 이미지"
              class="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <!-- Admin 왕관 -->
            <Crown
              v-if="authStore.user?.role?.includes('ADMIN')"
              class="absolute -top-1.5 -left-1.5 w-4 h-4 text-yellow-500 fill-yellow-400 drop-shadow -rotate-45"
            />
          </div>

          <!-- 툴팁 -->
          <span
            class="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg flex items-center gap-1.5"
          >
            {{ authStore.user?.nickname || '마이 페이지' }}
            <Crown v-if="authStore.user?.role?.includes('ADMIN')" class="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </span>
        </router-link>
      </template>

      <!-- 비로그인 상태 -->
      <template v-else>
        <router-link
          to="/login"
          class="relative flex items-center justify-center h-12 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
          aria-label="로그인"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span
            class="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg"
          >로그인</span>
        </router-link>
      </template>

    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineComponent, h, resolveComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Crown } from 'lucide-vue-next'
import AppLogo from '@/components/common/AppLogo.vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()

/**
 * SidebarItem — 아이콘 버튼 + 우측 툴팁을 묶은 인라인 컴포넌트
 * (파일을 분리하지 않아도 되도록 defineComponent로 로컬 정의)
 */
const SidebarItem = defineComponent({
  name: 'SidebarItem',
  props: {
    to: { type: String, required: true },
    label: { type: String, required: true },
  },
  setup(props, { slots }) {
    return () =>
      h(
        RouterLink,
        {
          to: props.to,
          class:
            'relative flex items-center justify-center h-12 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors group',
          activeClass: 'bg-blue-50 text-primary',
          ariaLabel: props.label,
        },
        {
          default: () => [
            // Icon slot
            h('span', { class: 'w-6 h-6' }, slots.default?.()),
            // Tooltip
            h(
              'span',
              {
                class:
                  'pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg',
              },
              props.label,
            ),
          ],
        },
      )
  },
})
</script>
