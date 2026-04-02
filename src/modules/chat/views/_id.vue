<template>
  <Card
    class="h-[calc(100vh-var(--header-height)+50px)]  border-none w-full overflow-hidden rounded-none relative gap-0 p-0">
    <CardHeader class="container gap-0 py-3 px-4">
      <CardTitle class="justify-center flex items-center flex-col">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-1 md:gap-3">
            <CAvatar class="rounded-full !size-10"
              :user="{ avatar_url: threadInfo.avatar_url, name: threadInfo.subject, }" />
            <h6 class="text-base">{{ threadInfo.subject }}</h6>
          </div>
        </div>
      </CardTitle>
    </CardHeader>

    <CardContent id="messagesContainer" ref="messagesContainer"
      class="h-[calc(100%-140px)] container overflow-auto border-t py-6">
      <CInfinite :has_more_pages="pagination.has_more_pages" :loading="loading" @load="load" />
      <ChatSkeleton v-if="loading && firstLoad" />
      <div v-for="(groupedMessages, date) in dateGroupedMessages" :key="date" class="my-6">
        <div class="flex items-center gap-3 my-6">
          <Separator class="flex-1" />
          <span class="text-xs text-muted-foreground whitespace-nowrap">{{ date }}</span>
          <Separator class="flex-1" />
        </div>
        <div v-for="(message, m) in groupedMessages" :key="m" class="my-6">
          <ChatBox :message="message" />
        </div>
      </div>
    </CardContent>

    <CardFooter class="relative flex items-center container absolute bottom-0 left-0" @click="focusMessageInput">
      <div class="w-full">
        <div class="px-4 py-2">
          <Badge variant="accent" class="py-1 ps-3 pr-1" v-if="form.file">
            {{ form.file.name }}
            <Button variant="outline" size="icon" class="p-0 h-auto rounded-full w-fit ms-3" @click="removeFile">
              <X />
            </Button>
          </Badge>
        </div>
        <div class="relative h-18 flex items-center border-t px-4">
          <div class="relative  ">
            <Button :loading="uploading" size="icon" variant="ghost"
              class="relative bg-transparent text-foreground hover:text-primary h-10 w-10 rounded-full"
              @click="triggerUploader">
              <Paperclip size="24" class="!w-6 !h-6" />
              <input ref="fileUploader" accept=".jpeg,.png,.pdf,.doc,.docx" hidden type="file"
                @change="handleFileSelect" />
              <div v-if="form.file"
                class="absolute flex items-center justify-center top-0 right-0 bg-primary text-[10px] text-primary-foreground size-4 rounded-full">
                1
              </div>
            </Button>
          </div>
          <Textarea ref="messageInput" placeholder="Write message here..."
            class="rounded-none min-h-auto border-0 !border-border bg-background resize-none scrollbar-hide max-h-13 mb-0.5"
            @keydown.enter="handleEnter" rows="1" v-model="form.text" />
          <div>
            <Button :disabled="isDiabled" class="gap-2 px-2 !w-fit rounded-xl h-10" @click="SendMessage"
              variant="default">
              <Send class="!w-6 !h-6" />
            </Button>
          </div>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
<script setup>
import CAvatar from '@/components/common/CAvatar.vue'
import CInfinite from '@/components/common/CInfinite.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/filters'
import eventBus from '@/services/eventBus'
import { useAuthStore, useChatStore } from '@/stores'
import { Paperclip, Send, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChatBox from '../components/ChatBox.vue'
import ChatSkeleton from '../components/ChatSkeleton.vue'
const route = useRoute()
const authStore = useAuthStore()
const chatStore = useChatStore()

const { user: currentUser } = storeToRefs(authStore)

const loading = ref(false)
const firstLoad = ref(true)
const messages = ref([])
const uploading = ref(false)
const fileUploader = ref(null)
const form = reactive({
  text: '',
  file: null
})

const threadInfo = reactive({
  subject: '',
  attachments: [],
  avatar_url: '',
  is_group_chat: false,
  ends_at: '',
  user_id: null,
})

const pagination = reactive({
  total: 0,
  current_page: 1,
  has_pages: false,
  has_more_pages: false,
  total_pages: 0,
  items: []
})

const previousScrollHeight = ref(0)
const previousScrollTop = ref(0)

const messagesContainer = ref(null)
const messageInput = ref(null)

const chatId = computed(() => String(route.params.id ?? ''))
const isDiabled = computed(() => (!form.text && !form.file))

const scrollContainer = computed(() => messagesContainer.value?.$el)

const dateGroupedMessages = computed(() => {
  return messages.value.reduce((acc, message) => {
    const date = formatDate(message.created_at)
    if (!acc[date]) acc[date] = []
    acc[date].push(message)
    return acc
  }, {})
})

const scrollToBottom = () => {
  const el = scrollContainer.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

const saveScrollPosition = () => {
  const el = scrollContainer.value
  if (!el) return
  previousScrollHeight.value = el.scrollHeight
  previousScrollTop.value = el.scrollTop
}

const restoreScrollPosition = () => {
  const el = scrollContainer.value
  if (!el) return
  nextTick(() => {
    const newScrollHeight = el.scrollHeight
    const heightDifference = newScrollHeight - previousScrollHeight.value
    el.scrollTop = previousScrollTop.value + heightDifference
  })
}

const reset = () => {
  firstLoad.value = true
  messages.value = []
  pagination.current_page = 1
  previousScrollHeight.value = 0
  previousScrollTop.value = 0
  form.text = ''
  form.file = null
}

const getChat = async () => {
  loading.value = true
  if (!firstLoad.value) {
    saveScrollPosition()
  }

  try {
    const res = await chatStore.getChat(chatId.value, { page: pagination.current_page })
    pagination.total = res.messages.total
    pagination.current_page = res.messages.current_page
    pagination.has_pages = res.messages.has_pages
    pagination.has_more_pages = res.messages.has_more_pages
    pagination.total_pages = res.messages.total_pages
    pagination.items = res.messages.items

    messages.value.unshift(...res.messages.items.reverse())

    if (pagination.current_page === 1) {
      firstLoad.value = false
      threadInfo.subject = res.subject
      threadInfo.attachments = res.attachments
      threadInfo.avatar_url = res.avatar_url
      threadInfo.is_group_chat = res.is_group_chat
      threadInfo.ends_at = res.ends_at
      threadInfo.user_id = res.user_id

      await nextTick()
      scrollToBottom()
    } else {
      restoreScrollPosition()
    }
  } finally {
    loading.value = false
  }
}

const load = () => {
  pagination.current_page++
  getChat()
}

const handleEnter = (event) => {
  if (event.shiftKey) return
  event.preventDefault()
  SendMessage()
}

const onMessage = (message) => {
  if (message?.body === 'session_extended') return
  if (String(message.thread_id) !== chatId.value) return
  messages.value.push(message)
  nextTick(() => {
    scrollToBottom()
  })
}

const focusMessageInput = () => {
  messageInput.value?.$el?.focus?.()
}

const SendMessage = () => {
  focusMessageInput()

  if (isDiabled.value) return

  const optimisticId = messages.value.length + 1 + Math.random()
  const createdAt = new Date().toISOString()

  const newMessage = {
    id: optimisticId,
    body: form.text,
    thread_id: chatId.value,
    thread: {
      id: chatId.value,
      subject: threadInfo.subject,
      avatar_url: threadInfo.avatar_url
    },
    user: {
      id: currentUser.value?.id,
      name: currentUser.value?.name,
      username: currentUser.value?.username,
      avatar_url: currentUser.value?.avatar_url
    },
    loading: true,
    unread: true,
    file: form.file,
    created_at: createdAt
  }

  messages.value.push(newMessage)
  nextTick(() => {
    scrollToBottom()
  })

  chatStore.updateThreadListOnNewMessage(newMessage, false)
  chatStore
    .sendMessage(chatId.value, { text: form.text, file: form.file })
    .then((res) => {
      const optimistic = messages.value.find((m) => m.id === optimisticId)
      if (optimistic) optimistic.loading = false
      messages.value = messages.value.filter((m) => m.id !== optimisticId)
      messages.value.push(res)
    })
    .finally(() => {
    })

  form.text = ''
  form.file = null
}

const triggerUploader = () => {
  fileUploader.value.click()
}

const handleFileSelect = (e) => {
  uploading.value = true
  form.file = e.target.files[0]
  setTimeout(() => {
    uploading.value = false
  }, 400)
}


const removeFile = () => {
  form.file = null
}

watch(
  chatId,
  () => {
    reset()
    getChat()
    nextTick(() => {
      scrollToBottom()
    })
  }
)

let offNewMessage = null

onMounted(() => {
  getChat()
  offNewMessage = eventBus.on('newMessage', onMessage)
})

onUnmounted(() => {
  offNewMessage?.()
  chatStore.clearChat()
})
</script>
