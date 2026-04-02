import DashboardLayout from '@/layouts/DashboardLayout.vue'
import WrapperLayout from '@/layouts/WrapperLayout.vue'

export default {
  path: '/',
  component: DashboardLayout,
  redirect: '/dashboard',
  children: [
    {
      path: '/',
      name: 'dashboard',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard.vue'),
      meta: {
        title: 'Statistics',
        auth: true
      }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/users.vue'),
      meta: {
        title: 'Users',
        auth: true
      }
    },

  ]
}
