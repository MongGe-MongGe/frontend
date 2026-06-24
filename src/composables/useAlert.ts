import { ref } from 'vue'

export type AlertType = 'success' | 'error' | 'info' | 'warning'

export interface AlertItem {
  id: number
  type: AlertType
  message: string
}

const alerts = ref<AlertItem[]>([])
let nextId = 0

export function useAlert() {
  const showAlert = (message: string, type: AlertType = 'info', duration = 3500) => {
    const id = ++nextId
    alerts.value.push({ id, type, message })
    setTimeout(() => {
      removeAlert(id)
    }, duration)
  }

  const removeAlert = (id: number) => {
    const idx = alerts.value.findIndex((a) => a.id === id)
    if (idx !== -1) alerts.value.splice(idx, 1)
  }

  return {
    alerts,
    showAlert,
    removeAlert,
  }
}
