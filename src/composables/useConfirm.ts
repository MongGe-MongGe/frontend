import { ref, markRaw } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

const state = ref<ConfirmState | null>(null)

export function useConfirm() {
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.value = markRaw({ ...options, resolve }) as ConfirmState
    })
  }

  const onConfirm = () => {
    state.value?.resolve(true)
    state.value = null
  }

  const onCancel = () => {
    state.value?.resolve(false)
    state.value = null
  }

  return { state, confirm, onConfirm, onCancel }
}
