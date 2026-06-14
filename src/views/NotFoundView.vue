<template>
  <PageContainer>
    <div
      class="flex flex-row items-center justify-center min-h-[80vh] p-8 text-left gap-16 max-w-4xl mx-auto w-full"
    >
      <img
        src="@/assets/images/error_cat.png"
        alt="404 Error Cat"
        class="w-80 h-80 object-contain drop-shadow-none"
      />
      <div>
        <h1 class="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
        <p class="text-gray-500 mb-10 max-w-md text-lg">
          요청하신 페이지가 사라졌거나 잘못된 경로입니다.<br />
          입력하신 주소가 정확한지 다시 한번 확인해 주세요.
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
