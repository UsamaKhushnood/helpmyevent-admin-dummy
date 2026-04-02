<template>
  <div>
    <div class="flex justify-between items-center">
      <h6 :class="[dropdown ? ' ' : 'text-3xl']" class="font-semibold">Notification</h6>
      <RouterLink to="/notifications" v-if="dropdown">
        <Button variant="link" class="font-medium text-sm px-1 py-0 h-auto shadow-none">View All</Button>
      </RouterLink>
    </div>
    <StatusFilterTabs v-model="filterBy" :class="{ 'mt-10': !dropdown }" />
    <div class="max-h-[calc(100vh-320px)]  overflow-y-auto -mr-5 -ml-2 pr-2">
      <NotificationItem v-for="(n, idx) in filteredNotifications" :key="n?.id ?? idx" :notification="n" />
      <div v-if="loadingNotifications" class="py-2 rounded-md" role="button" v-for="x in 12" :key="x">
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
      <h6 class="py-40 text-center capitalize text-muted-foreground font-semibold"
        v-if="!notifications.length && !loadingNotifications">
        No notification found
      </h6>
    </div>
  </div>

</template>
<script setup>
import StatusFilterTabs from '@/components/StatusFilterTabs.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore, useNotificationsStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import NotificationItem from './NotificationItem.vue'

const props = defineProps({
  dropdown: {
    type: Boolean,
    default: false
  }
})

const notificationsStore = useNotificationsStore()
const authStore = useAuthStore()
const { unread_count, allNotifications: notifications, loadingNotifications } = storeToRefs(notificationsStore)
const filterBy = ref('all')

// computed
const filteredNotifications = computed(() => {
  if (!notifications.value) return []
  return notifications.value.filter((notification) => {
    const isUnread = filterBy.value === 'unread' ? notification.unread : true
    return isUnread
  })
})
</script>
