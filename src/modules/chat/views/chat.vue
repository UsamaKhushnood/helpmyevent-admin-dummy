<template>
  <div class="chat-height-wrapper rounded-none border-0 md:flex items-center justify-center">
    <h3 class="hidden md:block text-2xl text-muted-foreground font-semibold">
      Click to start conversation
    </h3>

    <ChatList class="block md:hidden" />
  </div>
</template>
<script setup>
import { useChatStore } from '@/stores';
import ChatList from '../components/ChatList.vue'
import { onMounted } from 'vue';

const chatStore = useChatStore()

onMounted(() => {
  chatStore.getAllThreads()
})
</script>
