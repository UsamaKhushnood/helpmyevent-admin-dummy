<template>
  <div class="overflow-hidden h-screen bg-[#F4F5F7]" style="--header-height: 200px;">
    <!-- <TheHeader /> -->
    <div class="overflow-hidden container my-6 rounded-xl shadow">
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
  </div>
</template>
<script setup>
// import TheHeader from '@/components/common/TheHeader.vue';
import ChatList from '../components/ChatList.vue';
</script>
<style>
.chat-height-wrapper {
  height: calc(100vh - var(--header-height));
}
</style>