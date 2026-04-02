<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="p-0 h-auto shadow-none rounded-sm p-1 border-0 ">
        <Bell class="!w-5 !h-5" />
        <span v-if="unread_count"
          class="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-background" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-md max-h-[500px] overflow-hidden p-6" align="end">
      <Notification dropdown />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script setup>
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotificationsStore } from '@/stores'
import { Bell } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import Notification from './Notifications.vue'

const notificationsStore = useNotificationsStore()
const { unread_count } = storeToRefs(notificationsStore)

onMounted(() => {
  notificationsStore.GetNotifications()
})
const activeTab = ref('all')

</script>
