<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon" class="relative">
        <Bell class="h-4 w-4" />
        <span class="sr-only">Toggle notifications</span>
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-80">
      <div class="flex items-center justify-between px-4 py-2 border-b">
        <h4 class="font-semibold text-sm">Notifications</h4>
        <span class="text-xs text-muted-foreground" v-if="unreadCount">{{ unreadCount }} New</span>
      </div>

      <div v-if="notificationList.length > 0" class="max-h-[300px] overflow-y-auto">
        <DropdownMenuItem
          v-for="notification in notificationList"
          :key="notification.id"
          class="flex flex-col items-start p-4 cursor-pointer focus:bg-muted/50 gap-1 border-b last:border-0"
          :class="{ 'bg-muted/30': !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-center justify-between w-full">
            <span class="font-medium text-sm">{{ notification.title }}</span>
            <span class="text-[10px] text-muted-foreground shrink-0 ml-2">
              {{ formatRelativeTime(notification.created_at) }}
            </span>
          </div>
          <p class="text-xs text-muted-foreground line-clamp-2">
            {{ notification.message }}
          </p>
          <span v-if="notification.link" class="text-xs text-primary mt-1">View details →</span>
        </DropdownMenuItem>
      </div>

      <div v-else class="p-4 text-center text-sm text-muted-foreground">
        No new notifications
      </div>

      <div v-if="notifications.length > 0" class="p-2 border-t text-center">
        <Button variant="ghost" size="sm" class="w-full text-xs h-8" @click="markAllAsRead">
          Mark all as read
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Bell } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotificationsStore } from '@/stores/notifications.store'
import { useWorkspaceStore } from '@/stores/workspace.store'
import { formatRelativeTime } from '@/lib/filters'

const notificationsStore = useNotificationsStore()
const workspaceStore = useWorkspaceStore()
const router = useRouter()

const { notifications, unreadCount } = storeToRefs(notificationsStore)

const notificationList = computed(() => {
  return notificationsStore.notifications.map(notification => {
    return {
      ...notification,
      link: resolveLink(notification)
    }
  })
})

function resolveLink(notification) {
  if (!notification.link) return null
  const link = notification.link
  if (link.startsWith('/')) return link
  const workspaceId = workspaceStore.getWorkspaceID
  if (!workspaceId) return null
  return `/dashboard/workspaces/${workspaceId}/${link.replace(/^\//, '')}`
}

function handleNotificationClick(notification) {
  if (!notification.read) {
    notificationsStore.markAsRead(notification.id)
  }
  const to = resolveLink(notification)
  if (to) {
    router.push(to)
  }
}

function markAllAsRead() {
  notificationsStore.markAllAsRead()
}
</script>
