<script setup>
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useVModel } from '@vueuse/core'
import { PlusCircle } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

/**
 * v-model bridge
 * This is the ONLY source of truth for the value
 */
const value = useVModel(props, 'modelValue', emit)

const isOpen = ref(false)
const highlightedIndex = ref(0)
const inputRef = ref(null)
const listRef = ref(null)

const showPopover = computed(() => {
  return isOpen.value && filteredSuggestions.value.length > 0
})

const inputWidth = computed(() => {
  return inputRef.value ? `${inputRef.value.$el.offsetWidth}px` : 'auto'
})

const filteredSuggestions = computed(() => {
  if (!value.value.trim()) {
    return props.suggestions
  }

  return props.suggestions.filter(item =>
    item.toLowerCase().includes(value.value.toLowerCase())
  )
})

watch(filteredSuggestions, () => {
  highlightedIndex.value = 0
})

watch(highlightedIndex, async () => {
  if (!isOpen.value || !listRef.value) return

  await nextTick()
  const el = listRef.value.children[highlightedIndex.value]
  el?.scrollIntoView({ block: 'nearest' })
})

function open() {
  isOpen.value = true
}

function close() {
  emit('blur')
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

function select(item) {
  value.value = item
  isOpen.value = false
  inputRef.value?.$el?.focus()
}

function onKeydown(e) {
  isOpen.value = true

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (highlightedIndex.value < filteredSuggestions.value.length - 1) {
        highlightedIndex.value++
      }
      break

    case 'ArrowUp':
      e.preventDefault()
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--
      }
      break

    case 'Enter':
      e.preventDefault()
      select(filteredSuggestions.value[highlightedIndex.value])
      break

    case 'Escape':
      isOpen.value = false
      break
  }
}
</script>

<template>
  <div class="relative">
    <Popover :open="showPopover">
      <PopoverTrigger as-child>
        <Input ref="inputRef" v-model="value" type="text" :placeholder="placeholder" @focus="open" @keydown="onKeydown"
          @blur="close" />
      </PopoverTrigger>
      <PopoverContent asChild class="p-1 max-h-[300px]  overflow-auto" :style="{ width: inputWidth }">
        <ul ref="listRef">
          <li v-for="(item, index) in filteredSuggestions" :key="item" :class="[
            'relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm select-none',
            index === highlightedIndex ? 'bg-accent' : 'hover:bg-accent'
          ]" @click="select(item)">


            {{ item }}

            <PlusCircle size="16px" class="ms-auto text-muted-foreground" />
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  </div>
</template>
