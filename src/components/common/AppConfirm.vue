<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="state"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="onCancel"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <!-- Header -->
          <div class="px-6 pt-6 pb-2">
            <h3 class="font-bold text-lg text-gray-900">{{ state.title || '확인' }}</h3>
          </div>
          <!-- Body -->
          <div class="px-6 py-4">
            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ state.message }}</p>
          </div>
          <!-- Footer -->
          <div class="flex gap-2 px-6 pb-6 justify-end">
            <button
              @click="onCancel"
              class="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {{ state.cancelText || '취소' }}
            </button>
            <button
              @click="onConfirm"
              class="px-5 py-2 rounded-xl text-sm font-bold text-white transition-colors"
              :class="state.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-800'"
            >
              {{ state.confirmText || '확인' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'

const { state, onConfirm, onCancel } = useConfirm()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>
