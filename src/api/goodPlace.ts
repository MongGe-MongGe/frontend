import apiClient from './client'

export const getGroupGoodPlaces = async (userId: string, groupId: string, page: number = 0, size: number = 20) => {
  const response = await apiClient.get(`/users/${userId}/groups/${groupId}/good-places`, {
    params: { page, size }
  })
  return response.data
}

export const createGoodPlace = async (groupId: string, placeData: any) => {
  const response = await apiClient.post(`/users/me/groups/${groupId}/good-places`, {
    place: placeData
  })
  return response.data
}

export const deleteGoodPlaceFromGroup = async (groupId: string, placeId: string) => {
  const response = await apiClient.delete(`/users/me/groups/${groupId}/good-places/${placeId}`)
  return response.data
}

export const getSavedGroupIds = async (placeId: string) => {
  const response = await apiClient.get(`/users/me/places/${placeId}/groups`)
  return response.data
}
