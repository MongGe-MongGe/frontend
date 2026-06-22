import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllReviews, getUserReviews, deleteReview } from '@/api/review'

interface FeedContext {
  items: any[]
  page: number
  hasMore: boolean
  isLoading: boolean
}

export const useFeedStore = defineStore('feed', () => {
  const contexts = ref<Record<string, FeedContext>>({})

  const getContext = (contextId: string) => {
    if (!contexts.value[contextId]) {
      contexts.value[contextId] = {
        items: [],
        page: 0,
        hasMore: true,
        isLoading: false
      }
    }
    return contexts.value[contextId]
  }

  const loadMyFeeds = async (reset = false) => {
    const ctx = getContext('home')
    if (reset) {
      ctx.page = 0
      ctx.items = []
      ctx.hasMore = true
    }
    if (!ctx.hasMore || ctx.isLoading) return

    ctx.isLoading = true
    try {
      const res = await getAllReviews(ctx.page, 20)
      ctx.items.push(...res.content)
      ctx.page++
      ctx.hasMore = !res.last
    } catch (err) {
      console.error('Failed to load home feeds', err)
    } finally {
      ctx.isLoading = false
    }
  }

  const loadUserReviews = async (userId: string, reset = false) => {
    const ctxId = `user_${userId}`
    const ctx = getContext(ctxId)
    if (reset) {
      ctx.page = 0
      ctx.items = []
      ctx.hasMore = true
    }
    if (!ctx.hasMore || ctx.isLoading) return

    ctx.isLoading = true
    try {
      const res = await getUserReviews(userId, ctx.page, 20)
      ctx.items.push(...res.content)
      ctx.page++
      ctx.hasMore = !res.last
    } catch (err) {
      console.error(`Failed to load user ${userId} reviews`, err)
    } finally {
      ctx.isLoading = false
    }
  }

  const removeFeed = async (reviewId: string) => {
    try {
      await deleteReview(reviewId)
      // Remove from all contexts
      for (const key in contexts.value) {
        contexts.value[key].items = contexts.value[key].items.filter(item => item.id !== reviewId)
      }
    } catch (err) {
      console.error('Failed to delete review', err)
      throw err
    }
  }

  const updateFeedLocally = (updatedFeed: any) => {
    // Update the item in all contexts where it exists
    for (const key in contexts.value) {
      const idx = contexts.value[key].items.findIndex(item => item.id === updatedFeed.id)
      if (idx !== -1) {
        contexts.value[key].items[idx] = { ...contexts.value[key].items[idx], ...updatedFeed }
      }
    }
  }

  const prependFeedLocally = (newFeed: any, contextIds: string[] = ['home']) => {
    for (const ctxId of contextIds) {
      const ctx = getContext(ctxId)
      ctx.items.unshift(newFeed)
    }
  }

  return {
    contexts,
    getContext,
    loadMyFeeds,
    loadUserReviews,
    removeFeed,
    updateFeedLocally,
    prependFeedLocally
  }
})
