import ChatLayout from '../layouts/ChatLayout.vue'

export default {
  path: '/users/:id/chat',
  component: ChatLayout,
  children: [
    {
      path: '',
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
      path: ':chat_id',
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
