import { defineStore } from 'pinia'
import { toast } from 'vue-sonner';
import api from '../helpers/axios'



export const useUsersStore = defineStore('users', {
  actions: {
    getAll(params) {
      return api.get(`/admin/users`, { params }).then((res) => {
        return res.data.data
      })
    },
    activate(id) {
      return api.post(`/admin/users/${id}/approve`).then((res) => {
        return res.data.data
      })
    },
    restrict(id) {
      return api.put(`/admin/users/${id}/restrict`).then((res) => {
        return res.data.data
      })
    },
    unrestrict(id) {
      return api.put(`/admin/users/${id}/unrestrict`).then((res) => {
        return res.data.data
      })
    },
    getAllThreads(params) {
      return api.get(`/admin/users/${params.id}/threads`, { params }).then((res) => {
        return res.data.data
      })
    },
    getUserChat(params) {
      return api
        .get(`/admin/users/${params.id}/threads/${params.threadId}`, { params })
        .then((res) => {
          return res.data.data
        })
    },
    getTransactions(params) {
      return api.get(`/admin/users/${params.id}/transactions`, { params }).then((res) => {
        return res.data.data
      })
    },
    getFlagged(params) {
      return api.get(`/admin/flagged/messages`, { params }).then((res) => {
        return res.data.data
      })
    }
  }
})