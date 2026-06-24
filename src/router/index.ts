import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/password-reset/request',
      name: 'password-reset-request',
      component: () => import('../views/PasswordResetRequestView.vue'),
    },
    {
      path: '/password-reset/confirm',
      name: 'password-reset-confirm',
      component: () => import('../views/PasswordResetConfirmView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/',
      name: 'main',
      component: () => import('../views/MainView.vue'),
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
    },
    {
      path: '/users/:handle',
      name: 'user-profile',
      component: () => import('../views/UserView.vue'),
    },
    {
      path: '/place/:id',
      name: 'restaurant-detail',
      component: () => import('../views/RestaurantDetailView.vue'),
    },
    {
      path: '/feed/:context/:targetReviewId',
      name: 'feed-list',
      component: () => import('../views/FeedListView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/settings/profile',
      name: 'profile-edit',
      component: () => import('../views/ProfileEditView.vue'),
    },
    {
      path: '/board',
      name: 'board',
      component: () => import('../views/BoardView.vue'),
    },
    {
      path: '/board/create',
      name: 'board-create',
      component: () => import('../views/BoardCreateView.vue'),
    },
    {
      path: '/board/edit/:id',
      name: 'board-edit',
      component: () => import('../views/BoardCreateView.vue'),
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      redirect: '/404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/login', '/signup', '/password-reset/request', '/password-reset/confirm']
  const authRequired = !publicPages.includes(to.path)

  // 로그인이 필요한 페이지인데 토큰이 없는 경우
  if (authRequired && !authStore.token) {
    // 설정 페이지(및 하위 페이지)로 접근하는 경우 권한 없음(403) 페이지로 이동
    if (to.path.startsWith('/settings')) {
      next({ name: 'forbidden' })
    } else {
      next({ name: 'login' })
    }
  }
  // 관리자 권한이 필요한 페이지 접근 제어
  else if (
    (to.path.startsWith('/board/create') || to.path.startsWith('/board/edit')) &&
    authStore.user?.role !== 'ADMIN'
  ) {
    next({ name: 'forbidden' })
  }
  // 이미 로그인한 상태에서 로그인/회원가입 페이지 접근 시 메인으로 리다이렉트
  else if (!authRequired && authStore.token) {
    next({ name: 'main' })
  } else {
    next()
  }
})

export default router
