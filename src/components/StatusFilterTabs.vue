<template>
  <div class="flex items-center gap-3 mt-4 border-b pb-3 relative">
    <Button class="text-sm relative bg-transparent p-0 h-auto shadow-none border-0"
      :class="{ 'activeTab text-primary': value === 'all' }" @click="value = 'all'" variant="outline">
      <p class="px-2">All</p>
    </Button>
    <Button class="text-sm relative bg-transparent p-0 h-auto shadow-none border-0"
      :class="{ 'activeTab text-primary': value === 'unread' }" @click="value = 'unread'" variant="outline">
      <p class="px-2">Unread</p>
    </Button>
  </div>
</template>
<script setup>
import { Button } from '@/components/ui/button';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
})
</script>
<style lang="scss">
.activeTab p {
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 4px;
    background: var(--primary);
    left: 1px;
    bottom: -14.5px;
    border-radius: 100px;
  }
}
</style>
