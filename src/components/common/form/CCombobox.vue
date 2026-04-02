<script setup>
import { ref, computed } from 'vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useVModel, useElementSize } from '@vueuse/core'
import Spinner from '@/components/common/Spinner.vue'

const props = defineProps({
  modelValue: { type: [String, Number, Object], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select option...' },
  searchPlaceholder: { type: String, default: 'Search...' },
  emptyText: { type: String, default: 'No results found.' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  triggerClass: { type: String, default: '' },
  valueKey: { type: String, default: 'value' },
  labelKey: { type: String, default: 'label' },
  imageKey: { type: String, default: 'img' },
  iconKey: { type: String, default: 'icon' }
})

const emits = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true
})

const open = ref(false)
const trigger = ref(null)
const { width: triggerWidth } = useElementSize(trigger)

// Helper to normalize options
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt[props.valueKey],
        label: opt[props.labelKey],
        img: opt[props.imageKey],
        icon: opt[props.iconKey],
        disabled: opt.disabled || false,
        raw: opt
      }
    }
    return { value: opt, label: opt, raw: opt, disabled: false }
  })
})

const selectedOption = computed(() => {
  return normalizedOptions.value.find(opt => opt.value === modelValue.value)
})

const handleSelect = (val) => {
  modelValue.value = val === modelValue.value ? '' : val
  open.value = false
}
</script>

<template>
  <div class="w-full">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button ref="trigger" variant="outline" role="combobox" :aria-expanded="open" :disabled="disabled || loading"
          class="w-full justify-between bg-background font-normal" :class="triggerClass">
          <div class="flex items-center truncate w-full gap-2">
            <Spinner v-if="loading" class="size-4 shrink-0" />
            <slot name="selected" :value="modelValue" :option="selectedOption" :placeholder="placeholder">
              <span v-if="selectedOption" class="truncate flex items-center gap-2">
                <img v-if="selectedOption.img" :src="selectedOption.img" class="w-[20px] shrink-0" alt="icon"
                  aria-hidden="true" />
                <component :is="selectedOption.icon" v-if="selectedOption.icon" class="size-4 shrink-0"
                  aria-hidden="true" />
                {{ selectedOption.label }}
              </span>
              <span v-else class="text-muted-foreground">{{ placeholder }}</span>
            </slot>
          </div>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0" :style="{ width: triggerWidth > 0 ? triggerWidth + 24 + 'px' : 'auto' }">
        <Command>
          <CommandInput :placeholder="searchPlaceholder" />
          <CommandEmpty>{{ emptyText }}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem v-for="option in normalizedOptions" :key="option.value" :value="option.label"
                :disabled="option.disabled" @select="() => handleSelect(option.value)">
                <Check :class="cn(
                  'mr-2 h-4 w-4',
                  modelValue === option.value ? 'opacity-100' : 'opacity-0'
                )" />
                <slot name="item" :option="option.raw">
                  <div class="flex items-center gap-2">
                    <img v-if="option.img" :src="option.img" class="w-[20px]" alt="icon" aria-hidden="true" />
                    <component :is="option.icon" v-if="option.icon" class="size-4" aria-hidden="true" />
                    {{ option.label }}
                  </div>
                </slot>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
