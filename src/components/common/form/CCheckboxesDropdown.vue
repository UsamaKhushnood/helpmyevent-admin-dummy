<template>
  <div class="w-full">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          ref="triggerRef"
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          :disabled="disabled"
          class="w-full justify-between bg-background font-normal"
          :class="triggerClass"
        >
          <span class="truncate">
            {{ triggerLabel }}
          </span>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        class="p-0"
        :style="{ width: triggerWidth > 0 ? triggerWidth + 24 + 'px' : 'auto' }"
      >
        <div class="p-2 max-h-[300px] overflow-y-auto">
          <CCheckboxGroup
            v-model="modelValue"
            :options="options"
            class="flex flex-col gap-0 items-start"
            label-class="cursor-pointer font-normal"
            optionClass="hover:bg-muted w-full p-1 rounded-md cursor-pointer py-1.5 px-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronsUpDown } from 'lucide-vue-next'
import { useVModel, useElementSize } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import CCheckboxGroup from '@/components/common/form/CCheckboxGroup.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select...' },
  disabled: { type: Boolean, default: false },
  triggerClass: { type: [String, Object], default: '' },
})

const emits = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const open = ref(false)
const triggerRef = ref(null)
const { width: triggerWidth } = useElementSize(triggerRef)

const triggerLabel = computed(() => {
  if (!modelValue.value?.length) {
    return props.placeholder
  }
  const count = modelValue.value.length
  if (count === 1 && props.options?.length) {
    const opt = props.options.find((o) => o.value === modelValue.value[0])
    return opt?.label ?? modelValue.value[0]
  }
  return `${count} selected`
})
</script>
