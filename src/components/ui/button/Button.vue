<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "."
import Spinner from '@/components/common/Spinner.vue'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  loading?: Boolean
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  type: 'button',
})
</script>

<template>
  <Primitive data-slot="button" :type="type" :as="as" :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)">
    <Spinner v-if="loading" />
    <slot v-else />
  </Primitive>
</template>
