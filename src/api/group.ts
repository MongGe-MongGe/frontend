import apiClient from './client'

export const getMyGroups = async () => {
  const response = await apiClient.get('/users/me/groups')
  return response.data
}

export const getUserGroups = async (userId: string) => {
  const response = await apiClient.get(`/users/${userId}/groups`)
  return response.data
}

export const getFollowingGroups = async () => {
  const response = await apiClient.get('/users/me/groups/following')
  return response.data
}

export const createGroup = async (name: string) => {
  const response = await apiClient.post('/users/me/groups', { name })
  return response.data
}

export const updateGroup = async (groupId: string, name: string) => {
  const response = await apiClient.put(`/users/me/groups/${groupId}`, { name })
  return response.data
}

export const deleteGroup = async (groupId: string) => {
  const response = await apiClient.delete(`/users/me/groups/${groupId}`)
  return response.data
}
