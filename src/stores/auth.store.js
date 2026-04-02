import { defineStore } from 'pinia'
import { resetAllPiniaStores } from './index'
import { toast } from 'vue-sonner';
import api from '../helpers/axios'
import fetchWrapper from '../helpers/axios'
import VueCookies from 'vue-cookies'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    isLoggedIn: false
  }),
  getters: {
    isAuthenticated: (state) => state.isLoggedIn || VueCookies.isKey('token'),
  },
  actions: {
    Login(form) {
      return api.post('/login', form).then((response) => {
        const { user, token } = response.data
        VueCookies.set('token', token)
        this.user = user
        this.isLoggedIn = true
        router.push('/')
      })
    },
    Logout() {
      this.Reset()
    },
    Reset() {
      VueCookies.remove('token')
      this.user = {}
      this.isLoggedIn = false
      fetchWrapper.interceptors.request.use((config) => {
        config.headers.Authorization = null
        return config
      })
      resetAllPiniaStores()
      router.push('/login')
    }
  },
  persist: true
})
