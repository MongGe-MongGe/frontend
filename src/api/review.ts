import apiClient from './client'

export const createReview = async (payload: any) => {
  const response = await apiClient.post('/reviews', payload)
  return response.data
}

export const updateReview = async (reviewId: string, payload: any) => {
  const response = await apiClient.put(`/reviews/${reviewId}`, payload)
  return response.data
}

export const deleteReview = async (reviewId: string) => {
  const response = await apiClient.delete(`/reviews/${reviewId}`)
  return response.data
}

export const getAllReviews = async (page: number = 0, size: number = 20) => {
  const response = await apiClient.get('/reviews', {
    params: { page, size }
  })
  return response.data
}

export const getPopularReviews = async (page: number = 0, size: number = 20) => {
  const response = await apiClient.get('/reviews/popular', {
    params: { page, size }
  })
  return response.data
}

export const getUserReviews = async (userId: string, page: number = 0, size: number = 20) => {
  const response = await apiClient.get(`/users/${userId}/reviews`, {
    params: { page, size }
  })
  return response.data
}

export const likeReview = async (reviewId: string) => {
  const response = await apiClient.post(`/reviews/${reviewId}/likes`)
  return response.data // { reviewId, likedByMe, likeCount }
}

export const unlikeReview = async (reviewId: string) => {
  const response = await apiClient.delete(`/reviews/${reviewId}/likes`)
  return response.data // { reviewId, likedByMe, likeCount }
}

export const searchReviews = async (keyword: string, page: number = 0, size: number = 20) => {
  const response = await apiClient.get('/reviews/search', {
    params: { keyword, page, size }
  })
  return response.data
}
