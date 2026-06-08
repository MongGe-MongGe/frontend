<template>
  <div class="h-screen w-full bg-white flex overflow-hidden relative">
    <RootSidebar v-if="showSidebar" />

    <!-- Main Content Area -->
    <main class="w-full h-full relative bg-white overflow-hidden flex justify-center">
      <!-- Full width for Map -->
      <div v-if="isMapRoute" class="w-full h-full relative">
        <router-view />
      </div>

      <!-- Mobile constrained container for others -->
      <div
        v-else
        class="w-full max-w-md h-full relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import RootSidebar from './components/common/RootSidebar.vue'

const route = useRoute()
const isMapRoute = computed(() => route.path === '/map')
const showSidebar = computed(
  () => route.name !== 'login' && route.name !== 'signup' && route.name !== 'map',
)
</script>

<style scoped>
/* 스크롤 바 숨기기 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
