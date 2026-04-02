<template>
  <TooltipProvider v-bind="forwarded">
    <Tooltip>
      <TooltipTrigger as-child>
        <slot></slot>
      </TooltipTrigger>
      <TooltipContent :side="side">
        <p>{{ title }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
<script setup>
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps({
  defaultOpen: {type: Boolean, required: false},
  open: {type: Boolean, required: false},
  delayDuration: {type: Number, required: false},
  disableHoverableContent: {type: Boolean, required: false},
  disableClosingTrigger: {type: Boolean, required: false},
  disabled: {type: Boolean, required: false},
  ignoreNonKeyboardFocus: {type: Boolean, required: false},
  title: {type: String, required: true},
  side: {type: String, required: false, default: 'top'},
  sideOffset: {type: Number, required: false, default: null}
})
const emits = defineEmits(['update:open'])

const forwarded = useForwardPropsEmits(props, emits)
</script>
