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

export const searchUsers = async (keyword: string) => {
  const response = await apiClient.get(`/users?keyword=${encodeURIComponent(keyword)}`)
  return response.data // List of UserProfileResponse
}

export const getFollowings = async (userId: string) => {
  const response = await apiClient.get(`/users/${encodeURIComponent(userId)}/followings`)
  return response.data
}

export const getFollowers = async (userId: string) => {
  const response = await apiClient.get(`/users/${encodeURIComponent(userId)}/followers`)
  return response.data
}

export const followUser = async (userId: string) => {
  const response = await apiClient.post(`/users/follow/${encodeURIComponent(userId)}`)
  return response.data
}

export const unfollowUser = async (userId: string) => {
  const response = await apiClient.delete(`/users/follow/${encodeURIComponent(userId)}`)
  return response.data
}
