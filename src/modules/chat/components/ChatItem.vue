<template>
  <div class="p-4 relative cursor-pointer " :class="[
    $route.params.id == thread.id && !dropdownItem
      ? 'bg-accent text-accent-foreground font-semibold'
      : 'hover:bg-accent text-foreground group'
  ]" @click="openThread(thread)" role="button">
    <div class="flex gap-3 items-center">
      <CAvatar class="!w-10 !h-10 rounded-full" :user="{ name: thread.subject, avatar_url: thread.avatar_url }" />
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <h6 class="text-sm font-medium group-hover:text-primary">{{ thread.subject }}</h6>
          <p class="text-xs"> {{ formatDate(thread.created_at) }}</p>
        </div>
        <div class="flex items-end justify-between gap-2">
          <p class="line-clamp-1 text-muted-foreground text-xs mt-0.5">
            {{ thread.last_message.body }}
          </p>
          <p v-if="thread?.unread"
            class="bg-primary w-2 h-2 min-w-2 min-h-2 flex items-center font-semibold rounded-full">
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CAvatar from '@/components/common/CAvatar.vue'
import { formatDate } from '@/filters'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  thread: {
    type: null,
  },
  dropdownItem: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['threadClick'])

const route = useRoute()
const router = useRouter()

const openThread = (thread) => {
  emit('threadClick')
  router.push(`/chat/${thread.id}`)
}
</script>