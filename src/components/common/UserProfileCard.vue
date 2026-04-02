<template>
  <div class="flex items-center gap-3 group">
    <CAvatar v-if="user?.avatar" :class="avatarClass" :user="user" />
    <div class="flex-1">
      <template v-if="loading">
        <Skeleton class="h-7 w-3/4" />
        <Skeleton class="h-4 w-3/4 mt-2 rounded-md" />
      </template>
      <template v-else>
        <div class="grid  flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">
            {{ user?.full_name || user?.name }}
          </span>
          <span class="truncate text-xs">{{ user?.email }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { Skeleton } from '@/components/ui/skeleton'
import CAvatar from '@/components/common/CAvatar.vue'

export default {
  components: {
    Skeleton,
    CAvatar
  },
  props: {
    avatarClass: {
      type: String,
      default: ''
    },
    user: {
      type: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
