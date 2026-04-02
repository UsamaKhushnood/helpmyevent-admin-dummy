import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import NProgress from 'nprogress'
import WrapperLayout from '@/layouts/WrapperLayout.vue'
import dashboardRoutes from './dashboard.routes.js'
import authRoutes from './auth.routes.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: WrapperLayout,
      children: [
        dashboardRoutes, authRoutes,
        {
          path: "/no-permission",
          name: "403",
          meta: {
            title: "No Permission",
          },
          component: () => import("../views/no-permission.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          name: "404",
          meta: {
            title: "Page Not Found",
          },
          component: () => import("../views/page-not-found.vue"),
        },
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title}`
  NProgress.start()

  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const authRequired = to.meta.auth

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
