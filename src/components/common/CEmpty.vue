<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <slot name="icon">
          <Ban/>
        </slot>
      </EmptyMedia>
      <EmptyTitle>{{ title }}</EmptyTitle>
      <EmptyDescription>
        {{ description }}
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <slot name="actions"></slot>
    </EmptyContent>
  </Empty>
</template>
<script setup>
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from '@/components/ui/empty'
import { Ban } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  }
})
</script>
