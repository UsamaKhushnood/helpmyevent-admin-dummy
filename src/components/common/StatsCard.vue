<template>
  <div class="border-2 border-primary rounded-2xl overflow-hidden p-6 relative">
    <div class="bg-primary/60 w-full h-9 absolute top-0 left-0"></div>
    <div class="h-9"></div>
    <div
      class="border-2 border-background rounded-xl bg-primary size-9 text-background flex items-center justify-center absolute top-5 left-5"
    >
      <Spinner class="size-5" v-if="loading" />
      <slot name="icon" v-else></slot>
    </div>
    <h3 class="font-semibold mt-2">{{ label }}</h3>
    <Skeleton class="w-20 h-7 mt-1 bg-primary/40" v-if="loading" />
    <h1 class="text-2xl text-primary font-bold" v-else>{{ count }}</h1>
  </div>
</template>
<script setup>
import { Skeleton } from '@/components/ui/skeleton'
import Spinner from '@/components/common/Spinner.vue'

const props = defineProps({
  label: { type: String },
  loading: { type: Boolean },
  count: { type: [String, Number] }
})
</script>
