import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllReviews, getUserReviews, deleteReview, getPopularReviews, searchReviews } from '@/api/review'

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

  const loadPopularReviews = async (reset = false) => {
    const ctxId = 'popular'
    const ctx = getContext(ctxId)
    if (reset) {
      ctx.page = 0
      ctx.items = []
      ctx.hasMore = true
    }
    if (!ctx.hasMore || ctx.isLoading) return

    ctx.isLoading = true
    try {
      const res = await getPopularReviews(ctx.page, 20)
      ctx.items.push(...res.content)
      ctx.page++
      ctx.hasMore = !res.last
    } catch (err) {
      console.error(`Failed to load popular reviews`, err)
    } finally {
      ctx.isLoading = false
    }
  }

  const currentSearchKeyword = ref('')

  const loadSearchReviews = async (keyword: string, reset = false) => {
    const ctxId = 'search'
    const ctx = getContext(ctxId)
    if (reset) {
      ctx.page = 0
      ctx.items = []
      ctx.hasMore = true
      currentSearchKeyword.value = keyword
    }
    if (!ctx.hasMore || ctx.isLoading) return

    ctx.isLoading = true
    try {
      const res = await searchReviews(keyword, ctx.page, 20)
      ctx.items.push(...res.content)
      ctx.page++
      ctx.hasMore = !res.last
    } catch (err) {
      console.error(`Failed to load search reviews`, err)
    } finally {
      ctx.isLoading = false
    }
  }

  const removeFeed = async (reviewId: string) => {
    try {
      await deleteReview(reviewId)
      // Remove from all contexts
      for (const key in contexts.value) {
        const ctx = contexts.value[key]
        if (ctx) {
          ctx.items = ctx.items.filter(item => item.id !== reviewId)
        }
      }
    } catch (err) {
      console.error('Failed to delete review', err)
      throw err
    }
  }

  const updateFeedLocally = (updatedFeed: any) => {
    // Update the item in all contexts where it exists
    for (const key in contexts.value) {
      const ctx = contexts.value[key]
      if (ctx) {
        const idx = ctx.items.findIndex(item => item.id === updatedFeed.id)
        if (idx !== -1) {
          ctx.items[idx] = { ...ctx.items[idx], ...updatedFeed }
        }
      }
    }
  }

  const prependFeedLocally = (newFeed: any, contextIds: string[] = ['home']) => {
    for (const ctxId of contextIds) {
      const ctx = getContext(ctxId)
      ctx.items.unshift(newFeed)
    }
  }

  // 좋아요 상태를 모든 컨텍스트에 걸쳐 동기화한다
  const updateLikeLocally = (reviewId: string, likedByMe: boolean, likeCount: number) => {
    for (const key in contexts.value) {
      const ctx = contexts.value[key]
      if (ctx) {
        const item = ctx.items.find((i) => i.id === reviewId)
        if (item) {
          item.likedByMe = likedByMe
          item.likeCount = likeCount
        }
      }
    }
  }

  return {
    contexts,
    getContext,
    loadMyFeeds,
    loadUserReviews,
    loadPopularReviews,
    loadSearchReviews,
    currentSearchKeyword,
    removeFeed,
    updateFeedLocally,
    updateLikeLocally,
    prependFeedLocally,
  }
})
