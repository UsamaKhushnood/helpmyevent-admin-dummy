import Ringtone from '@/assets/ringtones/message-ping.mp3'
import router from '@/router'
import eventBus from '@/services/eventBus.js'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import api from '../helpers/axios'

export const useChatStore = defineStore('chat', {
  state: () => ({
    unreadCount: 0,
    loadingThreads: false,
    searchingThreads: false,
    threadsData: {
      total: 0,
      current_page: 1,
      has_pages: false,
      has_more_pages: false,
      total_pages: 0,
      items: []
    },
    chat: {},
    loadingChat: false,
    ringtone: null,
    audioUnlocked: false
  }),
  actions: {
    getAllThreads(params) {
      this.loadingThreads = true
      if (this.threadsData.current_page === 1) {
        this.threadsData.items = []
      }
      return api
        .get(`/threads`, { params })
        .then((response) => {
          this.unreadCount = response.data.unread_count
          this.threadsData.total = response.data.data.total
          this.threadsData.current_page = response.data.data.current_page
          this.threadsData.has_pages = response.data.data.has_pages
          this.threadsData.has_more_pages = response.data.data.has_more_pages
          this.threadsData.total_pages = response.data.data.total_pages
          this.threadsData.items = [...this.threadsData.items, ...response.data.data.items]
          return response.data.data
        })
        .finally(() => {
          this.loadingThreads = false
        })
    },
    SearchThread(params) {
      this.searchingThreads = true
      return api
        .get(`/threads`, { params })
        .then((response) => {
          console.log(response.data.data)
          return response.data.data
        })
        .finally(() => {
          this.searchingThreads = false
        })
    },
    getChat(id, params) {
      this.loadingChat = true
      this.markThreadAsUnread(id)
      return api
        .get(`/threads/${id}`, { params })
        .then((response) => {
          this.chat = response.data.data
          eventBus.emit('chatLoaded')
          return response.data.data
        })
        .finally(() => {
          this.loadingChat = false
        })
    },
    markThreadAsUnread(id) {
      const thread = this.findThread(id)
      if (thread && thread.unread) {
        thread.unread = false
        this.decrementUnreadCount()
      }
    },
    safePlayRingtone() {
      this.initSoundUnlock()
      if (!this.ringtone) return
      if (!this.audioUnlocked) return
      try {
        this.ringtone.currentTime = 0
      } catch {
      }
      try {
        const maybePromise = this.ringtone.play()
        if (maybePromise?.catch) {
          maybePromise.catch(() => {
          })
        }
      } catch {
      }
    },
    onNewMessage(message) {
      this.safePlayRingtone()

      const threadId = router.currentRoute._value?.params.id
      const isDifferentThread = threadId !== message.thread_id

      // 2️⃣ Play sound and show toast only if message is from another thread
      if (isDifferentThread) {
        toast.message(message.user.name, {
          description: message.body
            ? message.body.substring(0, 100)
            : message.file
              ? 'File Attachment'
              : '',
          action: {
            label: 'View Message',
            onClick: () => router.push(`/chat/${message.thread_id}`)
          }
        })
      }

      // 3️⃣ Define the notification behavior
      const showNotification = () => {
        try {
          const notification = new Notification(message.user.name, {
            body: message.body
              ? message.body.substring(0, 100)
              : message.file
                ? 'File Attachment'
                : '',
            icon: '/icon.png' // optional - use your app icon here
          })

          notification.onclick = () => {
            window.focus()
            router.push(`/chat/${message.thread_id}`)
            notification.close()
          }
        } catch (err) {
          console.error('Notification error:', err)
        }
      }

      // 4️⃣ If tab is not active — try showing system notification
      if (document.visibilityState === 'hidden') {
        this.safePlayRingtone()

        if (Notification.permission === 'granted') {
          showNotification()
        } else if (Notification.permission === 'default') {
          // 'default' means the user hasn’t decided yet — ask for permission
          Notification.requestPermission()
            .then((permission) => {
              if (permission === 'granted') showNotification()
            })
            .catch((err) => {
              console.error('Notification permission error:', err)
            })
        } else {
          // 'denied' → don’t do anything, maybe log
          console.warn('Notifications are blocked by the user.')
        }
      }

      // 5️⃣ Update message list
      this.updateThreadListOnNewMessage(message, isDifferentThread)
    },

    updateThreadListOnNewMessage(message, unread = true) {
      const messageBody = message.body ? message.body : message.file ? 'File Attachment' : ''
      const thread = this.findThread(message.thread_id)

      if (thread) {
        thread.last_message = {
          body: messageBody,
          created_at: message.created_at
        }
        if (!thread.unread && unread) {
          this.incrementUnreadCount()
        }
        thread.unread = unread
      } else {
        this.threadsData.items.unshift({
          id: message.thread_id,
          avatar_url: message.thread.avatar_url,
          subject: message.thread.subject,
          last_message: {
            body: messageBody,
            created_at: message.created_at
          },
          unread: unread
        })

        this.incrementUnreadCount()
      }
      this.threadsData.items.sort(
        (a, b) => new Date(b.last_message.created_at) - new Date(a.last_message.created_at)
      )
    },
    findThread(id) {
      return this.threadsData.items.find((thread) => thread.id === id)
    },
    resetThreads() {
      this.threadsData = $filters.paginationData
    },
    incrementThreadPage() {
      this.threadsData.current_page++
    },
    sendMessage(id, payload) {
      return api
        .post(`/threads/${id}`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          return response.data.data
        })
    },
    createThread(payload) {
      return api.post(`/threads`, payload).then((response) => {
        return response.data.data
      })
    },
    updateUnreadCount(count) {
      this.unreadCount = count
    },
    decrementUnreadCount() {
      if (this.unreadCount) {
        this.unreadCount--
      }
    },
    incrementUnreadCount() {
      this.unreadCount++
    },
    clearChat() {
      this.chat = {}
      this.selectedCoach = {}
    },
    initSoundUnlock() {
      if (this.audioUnlocked || this.ringtone) return

      this.ringtone = new Audio(Ringtone)

      document.body.addEventListener(
        'click',
        () => {
          this.ringtone
            .play()
            .then(() => {
              this.ringtone.pause()
              this.ringtone.currentTime = 0
              this.audioUnlocked = true
            })
            .catch(() => {
            })
        },
        { once: true }
      )
    }
  },
})
