<template>
  <div class="relative w-full items-center">
    <Input
        v-model="modelValue"
        id="search"
        type="text"
        placeholder="Press enter to search"
        class="pl-10"
        @keyup.enter="MakeSearch"
        :disabled="disabled"
    />

    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-4">
      <Search class="size-4 text-muted-foreground"/>
    </span>
    <span v-if="loading" class="absolute end-0 inset-y-0 flex items-center justify-center px-4">
      <Spinner class="size-4"/>
    </span>
    <Button
        size="icon"
        variant="link"
        v-else-if="searched && modelValue"
        class="absolute end-0 top-1/2 -translate-1/2 h-5 w-5"
        @click="clearSearch"
        role="button"
    >
      <X class="size-5 text-muted-foreground"/>
    </Button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Search, X, CornerDownLeft } from 'lucide-vue-next'
import { useVModel } from '@vueuse/core'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/common/Spinner.vue'

const props = defineProps({
  defaultValue: {type: [String, Number], required: false},
  modelValue: {type: [String, Number], required: false},
  loading: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false}
})

const emits = defineEmits(['update:modelValue', 'clear', 'search'])

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue
})

const search = ref('')
const searched = ref(false)

const MakeSearch = () => {
  searched.value = true
  emits('search', search.value)
}

const clearSearch = () => {
  searched.value = false
  emits('clear')
}
</script>
