import ChatLayout from '../layouts/ChatLayout.vue'

export default {
  path: '/chat',
  component: ChatLayout,
  children: [
    {
      path: '/chat',
      name: 'chat',
      components: {
        default: ChatLayout,
        chat: () => import('../views/chat.vue')
      },
      meta: {
        title: 'Chat',
        auth: true
      }
    },
    {
      path: '/chat/:id',
      name: 'chat-id',
      components: {
        default: ChatLayout,
        chat: () => import('../views/_id.vue')
      },
      meta: {
        title: 'Chat',
        auth: true
      }
    }
  ],
  meta: {
    title: 'Chat',
    auth: true
  }
}
