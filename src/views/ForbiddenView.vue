<template>
  <PageContainer>
    <div
      class="flex flex-row items-center justify-center min-h-[80vh] p-8 text-left gap-16 max-w-4xl mx-auto w-full"
    >
      <img
        src="@/assets/images/error_cat.png"
        alt="403 Error Cat"
        class="w-80 h-80 object-contain grayscale opacity-90 drop-shadow-none"
      />
      <div>
        <h1 class="text-6xl font-extrabold text-gray-900 mb-4">403</h1>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">접근 권한이 없습니다</h2>
        <p class="text-gray-500 mb-10 max-w-md text-lg">
          해당 페이지나 설정을 열람할 수 있는 권한이 부족합니다.<br />
          로그인이 필요하거나 본인의 프로필이 아닐 수 있습니다.
        </p>
        <router-link
          to="/"
          class="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
        >
          홈으로 돌아가기
        </router-link>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/common/PageContainer.vue'
</script>
