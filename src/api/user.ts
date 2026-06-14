import apiClient from './client'

export interface UpdateProfileRequest {
  nickname: string
  handle: string
  profileImage?: string | null
  bio?: string | null
}

export const updateUserProfile = async (id: string, data: UpdateProfileRequest) => {
  const response = await apiClient.put(`/users/${id}`, data)
  return response.data
}

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data // tempUrl
}

export const checkHandle = async (handle: string) => {
  const response = await apiClient.get(`/users/check-handle?handle=${encodeURIComponent(handle)}`)
  return response.data // { available: boolean }
}

export const getUserProfile = async (handle: string) => {
  const response = await apiClient.get(`/users/${encodeURIComponent(handle)}`)
  return response.data
}
