<template>
  <div
    class="flex items-center gap-3 p-2 my-2 rounded-md cursor-pointer hover:bg-accent transition-all duration-100 group">
    <Image v-if="notification.icon" :src="notification.icon" class="size-10" rounded="rounded-full"
      skeletonClas="rounded-full size-10" />
    <div class="flex-1">
      <div class="flex items-center justify-between">
        <h6 class="text-sm font-medium">{{ notification.title }}</h6>
        <p class="text-xs"> {{ formatDate(notification.created_at) }}</p>
      </div>
      <div class="flex items-end justify-between gap-2">
        <p class="line-clamp-1 text-muted-foreground text-xs mt-0.5">
          {{ notification.message }}
        </p>
        <p v-if="notification?.unread"
          class="bg-primary w-2 h-2 min-w-2 min-h-2 flex items-center font-semibold rounded-full">
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import Image from '@/components/common/Image.vue';
import { formatDate } from '@/filters';

const props = defineProps({
  notification: {
    type: null,
  },
})
</script>