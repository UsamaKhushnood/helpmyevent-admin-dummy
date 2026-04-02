<template>
  <div style="--chat-header: 84px;">
    <div class="px-4 py-4">
      <Searchbar placeholder="Search" v-model="search" @clear="clearSearch" @keyup="searchThread" />
      <StatusFilterTabs v-model="filterBy" />
    </div>
    <div class="overflow-y-auto h-[calc(100vh-var(--header-height)-var(--chat-header))] ">
      <Threads :threads="filteredMessages" ref="threads" @loaded="loaded" />
    </div>
  </div>
</template>
<script setup>
import Searchbar from '@/components/common/Searchbar.vue'
import StatusFilterTabs from '@/components/StatusFilterTabs.vue'
import { useChatStore } from '@/stores'
import debounce from 'lodash/debounce'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import Threads from './Threads.vue'

// store
const chatStore = useChatStore()
const { threadsData, loadingThreads } = storeToRefs(chatStore)

// state
const search = ref('')
const searching = ref(false)
const searched = ref(false)
const filterBy = ref('all')

// refs
const threadsRef = ref(null)
const scrollArea = ref(null)

// computed
const filteredMessages = computed(() => {
  if (!threadsData.value?.items) return []

  return threadsData.value.items.filter((thread) => {
    const isUnread = filterBy.value === 'unread' ? thread.unread : true
    const matchesSearch = thread?.subject
      ?.toLowerCase()
      .includes(search.value.toLowerCase())

    return isUnread && matchesSearch
  })
})

// methods
const searchThread = debounce(() => {
  if (!threadsData.value) return
  // threadsData.value.has_more_pages = true
  // threadsData.value.current_page = 1
}, 300)

const loaded = () => {
  searching.value = false
  searched.value = search.value
}

const clearSearch = () => {
  search.value = ''
  searchThread()
  scrollTop()
}

const scrollTop = () => {
  if (!scrollArea.value) return
  scrollArea.value.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
