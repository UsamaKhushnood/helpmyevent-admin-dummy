<template>
  <RadioGroup v-model="modelValue" class="gap-3">
    <div v-for="(option, index) in options" :key="radioUniqueId+option.value" class="flex items-center space-x-2">
      <Label class="cursor-pointer" :for="radioUniqueId+option.value">
        <RadioGroupItem :id="radioUniqueId+option.value" :value="option.value"/>
        <span>
          {{ option.label }}
        </span>
      </Label>
    </div>
  </RadioGroup>
</template>
<script setup>
import { useVModel } from '@vueuse/core'
import { RadioGroup, RadioGroupItem, } from '@/components/ui/radio-group'
import { Label } from "@/components/ui/label";
import { uniqueId } from 'lodash'

const props = defineProps({
  modelValue: {type: [Array, String, Number]},
  options: {type: Array}
})

const emits = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue
})

const radioUniqueId = uniqueId('radio-')
</script>
