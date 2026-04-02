<template>
  <div>
    <ChatItem @click="emit('threadClick', thread)" :dropdownItem="dropdownItem" v-for="(thread, index) in threads"
      :key="index" :thread="thread" />
    <div v-if="loadingThreads" class="py-2 rounded-md" role="button" v-for="x in 12" :key="x">
      <div class="flex mx-4 my-2 gap-3">
        <div class="w-10">
          <Skeleton class="w-10 h-10 rounded-full" />
        </div>
        <div class="w-full">
          <div class="flex justify-between gap-2">
            <Skeleton class="w-1/2 h-7" />
            <Skeleton class="w-20 h-5" />
          </div>
          <Skeleton class="h-4 mt-1" />
        </div>
      </div>
    </div>
    <CInfinite :has_more_pages="threadsData.has_more_pages" :loading="loadingThreads" @load="load" />
    <h6 class="py-40 text-center capitalize text-muted-foreground font-semibold"
      v-if="!threads.length && !loadingThreads">
      No chat found
    </h6>
  </div>
</template>

<script setup>
import CInfinite from '@/components/common/CInfinite.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useChatStore } from '@/stores'
import { storeToRefs } from 'pinia'
import ChatItem from './ChatItem.vue'

const props = defineProps({
  threads: {
    type: Array,
    default: () => []
  },
  dropdownItem: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['loaded', 'threadClick'])

const chatStore = useChatStore()
const { threadsData, loadingThreads } = storeToRefs(chatStore)
const { getAllThreads } = chatStore

// methods
const getData = () => {
  return getAllThreads({
    page: threadsData.value.current_page,
  }).finally(() => emit('loaded'))
}

const load = async ($state) => {
  threadsData.value.current_page++
  try {
    await getData()
    $state.loaded()
  } finally {
    $state.complete()
  }
}
</script>
