<template>
  <div class="chat-height-wrapper rounded-none border-0 md:flex items-center justify-center">
    <h3 class="hidden md:block text-2xl text-muted-foreground font-semibold">
      Click to view conversation
    </h3>
    <ChatList class="block md:hidden" />
  </div>
</template>
<script setup>
import ChatList from '../components/ChatList.vue';
</script>
