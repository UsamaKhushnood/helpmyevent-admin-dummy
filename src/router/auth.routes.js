import AuthLayout from '@/layouts/AuthLayout.vue'
import WrapperLayout from '@/layouts/WrapperLayout.vue'

export default {
  path: '/',
  component: AuthLayout,
  children: [
    {
      path: '/login',
      name: 'login',
      components: {
        default: WrapperLayout,
        auth: () => import('@/views/auth/login.vue')
      },
      meta: {
        title: 'login',
        auth: false
      }
    },
    // {
    //   path: '/verify',
    //   name: 'verify',
    //   components: {
    //     default: WrapperLayout,
    //     auth: () => import('@/views/auth/verify-code.vue')
    //   },
    //   meta: {
    //     title: 'Verification',
    //     auth: false
    //   }
    // }
  ]
}
