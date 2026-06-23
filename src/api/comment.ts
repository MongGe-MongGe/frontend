import apiClient from './client'

export const createComment = async (reviewId: string, payload: any) => {
  const response = await apiClient.post(`/reviews/${reviewId}/comments`, payload)
  return response.data
}

export const getCommentsByReview = async (reviewId: string, page: number = 0, size: number = 20) => {
  const response = await apiClient.get(`/reviews/${reviewId}/comments`, {
    params: { page, size }
  })
  return response.data
}

export const updateComment = async (commentId: string, payload: any) => {
  const response = await apiClient.put(`/comments/${commentId}`, payload)
  return response.data
}

export const deleteComment = async (commentId: string) => {
  const response = await apiClient.delete(`/comments/${commentId}`)
  return response.data
}
