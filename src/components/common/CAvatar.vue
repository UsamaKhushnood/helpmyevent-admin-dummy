<template>
  <Avatar
      :class="
      cn(
        'rounded-full overflow-hidden size-9 border min-w-9',
        props.class
      )
    "
  >
    <AvatarImage :src="user?.avatar_url ?? user?.avatar ?? user?.image" :alt="user?.full_name"/>
    <AvatarFallback>{{ getInitials(user?.full_name) }}</AvatarFallback>
  </Avatar>
</template>
<script setup>
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from "@/lib/filters.js";

const props = defineProps({
  user: {type: null},
  class: {type: null}
})
</script>
