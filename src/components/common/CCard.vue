<template>
  <Card>
    <CardHeader v-if="!hideHeader">
      <slot name="header">
        <CardTitle>
          <slot name="title">
            {{ title }}
          </slot>
        </CardTitle>
        <CardDescription>
          <slot name="description">
            {{ description }}
          </slot>
        </CardDescription>
      </slot>
    </CardHeader>
    <CardContent class="h-full" v-if="$slots.default">
      <slot></slot>
    </CardContent>
    <CardFooter v-if="$slots.footer" class="flex flex-col gap-2">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>
<script setup>
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card'

defineProps({
  title: {
    type: String,
  },
  description: {
    type: String
  },
  hideHeader: {
    type: Boolean,
    default: false
  }
})
</script>
