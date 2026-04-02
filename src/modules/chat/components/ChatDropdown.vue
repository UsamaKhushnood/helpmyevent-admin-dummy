<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="p-0 h-auto shadow-none rounded-sm p-1 border-0 ">
        <MessageCircleMore class="!w-5 !h-5" />
        <span v-if="unreadCount"
          class="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-background" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-md max-h-[500px] overflow-hidden p-6" align="end">
      <div>
        <div class="flex justify-between items-center">
          <p class=" font-semibold">Message</p>
          <RouterLink to="/chat">
            <Button variant="link" class="font-medium text-sm px-1 py-0 h-auto shadow-none">View All</Button>
          </RouterLink>
        </div>
        <StatusFilterTabs v-model="filterBy" />
        <div class="overflow-y-auto overflow-x-hidden h-[400px] -mr-5 pr-5">
          <Threads class="mt-1 -mx-4" :threads="filteredMessages" dropdownItem @threadClick="open = false" />
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script setup>
import StatusFilterTabs from '@/components/StatusFilterTabs.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useChatStore } from '@/stores'
import { MessageCircleMore } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Threads from './Threads.vue'

const filterBy = ref('all')
const open = ref(false)

const chatStore = useChatStore()
const { getAllThreads } = chatStore
const { threadsData, loadingThreads, unreadCount } = storeToRefs(chatStore)

// computed
const filteredMessages = computed(() => {
  if (!threadsData.value?.items) return []
  return threadsData.value.items.filter((thread) => {
    const isUnread = filterBy.value === 'unread' ? thread.unread : true
    return isUnread
  })
})


onMounted(() => {
  getAllThreads()
})
</script>