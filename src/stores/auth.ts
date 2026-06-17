import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  nickname: string
  email: string
  handle: string
  profileImage: string | null
}

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  // 로컬 스토리지에서 유저 정보 초기화
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse user data from local storage')
      }
    }
  }

  initAuth()

  // 로그인 성공 시 호출
  const setAuth = (newToken: string, userData: User) => {
    token.value = newToken
    user.value = userData
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 로그아웃 시 호출
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAuthenticated = computed(() => !!token.value)

  return { token, user, isAuthenticated, setAuth, logout, initAuth }
})
