<template>
  <div class="overflow-hidden -m-8" style="--header-height: 124px;">
    <div class="bg-background">
      <div class="flex">
        <div class="hidden md:block w-[370px] border-r">
          <ChatList />
        </div>
        <div class="flex flex-1 flex-col">
          <RouterView name="chat"></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useChatStore } from '@/stores';
import { onMounted } from 'vue';
import ChatList from '../components/ChatList.vue';


const chatStore = useChatStore()

onMounted(() => {
  chatStore.getAllThreads()
})
</script>
<style>
.chat-height-wrapper {
  height: calc(100vh - var(--header-height));
}
</style>