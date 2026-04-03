import DashboardLayout from '@/layouts/DashboardLayout.vue'
import chatRoutes from '@/modules/chat/routes/chat.routes'

export default {
  path: '/',
  component: DashboardLayout,
  redirect: '/users',
  children: [
    // {
    //   path: '/',
    //   name: 'dashboard',
    //   redirect: '/dashboard'
    // },
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/views/dashboard.vue'),
    //   meta: {
    //     title: 'Statistics',
    //     auth: true
    //   }
    // },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/users.vue'),
      meta: {
        title: 'User Management',
        auth: true
      },

    },
    chatRoutes
  ]
}
