<template>
  <div :class="cn('size-14 border flex items-center text-foreground justify-center rounded-md', props.class)">
    <slot></slot>
  </div>
</template>
<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({
  class: { type: null, required: false }
})
</script>
