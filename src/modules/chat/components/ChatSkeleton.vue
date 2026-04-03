<template>
  <div class="space-y-6 mt-6 mx-4" v-for="x in 10" :key="x">
    <div class="flex gap-3">
      <Skeleton class="h-16 rounded-2xl rounded-tr-none w-[60%] ml-auto bg-green-100 dark:bg-green-900" />
      <!-- <Skeleton class="size-10 min-w-10 rounded-full border" /> -->
    </div>
    <div class="flex gap-3">
      <Skeleton class="h-16 rounded-2xl rounded-tr-none w-[30%] ml-auto bg-green-100 dark:bg-green-900" />
      <!-- <Skeleton class="size-10 min-w-10 rounded-full border" /> -->
    </div>
    <div class="flex gap-3">
      <Skeleton class="h-16 rounded-2xl rounded-tr-none w-[50%] ml-auto bg-green-100 dark:bg-green-900" />
      <!-- <Skeleton class="size-10 min-w-10 rounded-full border" /> -->
    </div>
    <div class="flex gap-3">
      <!-- <Skeleton class="size-10 min-w-10 rounded-full border" /> -->
      <Skeleton class="h-16 rounded-2xl bg-neutral-100 dark:bg-secondary rounded-tl-none  w-[60%]" />
    </div>
    <div class="flex gap-3">
      <!-- <Skeleton class="size-10 min-w-10 rounded-full border" /> -->
      <Skeleton class="h-16 rounded-2xl bg-neutral-100 dark:bg-secondary rounded-tl-none  w-[40%]" />
    </div>
  </div>
</template>
<script setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>
