<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <slot name="trigger"></slot>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <slot name="options">
        <DropdownMenuItem v-for="(option, index) in options" :key="index" @click="onOptionClick(option)">
          <component :is="option.icon"></component>
          {{
            option.label
          }}
        </DropdownMenuItem>
      </slot>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

defineProps({
  options: {
    type: Array,
    default: () => []
  },

})

const emit = defineEmits(['optionClick'])

const onOptionClick = (option) => {
  emit('optionClick', option)
}
</script>
