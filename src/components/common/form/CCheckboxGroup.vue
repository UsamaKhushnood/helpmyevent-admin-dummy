<template>
  <div class="select-none" :class="cn('flex items-center gap-3', props.class)">
    <div :class="optionClass" v-for="(option, index) in options" :key="index">
      <slot :option="option" :index="index" :isChecked="isChecked" :handleChange="handleChange">
        <div class="flex items-center gap-1"
          :class="[bordered ? 'border p-1 rounded' : '', { 'border-primary': isChecked(option.value) }]">
          <Label :for="`${uniqueID}-${option.value}`" class="cursor-pointer text-nowrap" :class="props.labelClass">
            <Checkbox :id="`${uniqueID}-${option.value}`" :modelValue="isChecked(option.value)"
              @update:modelValue="(checked) => handleChange(option.value, checked)" />
            <span>
              {{ option.label }}
            </span>
          </Label>
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup>
import { cn } from '@/lib/utils'
import { useCheckbox } from './useCheckbox'
import { ref } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { uniqueId } from 'lodash'

const props = defineProps({
  modelValue: { type: [Array, String, Number] },
  class: { type: null },
  optionClass: { type: null },
  labelClass: { type: null },
  name: { type: null },
  options: { type: Array },
  radio: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },

})

const emit = defineEmits(['update:modelValue'])

const uniqueID = ref(uniqueId('checkbox-group-'))

const selected = ref(props.modelValue)

const isChecked = (value) => {
  return selected.value?.includes(value)
}

const handleChange = (value, checked) => {
  if (props.radio) {
    selected.value = value
    emit('update:modelValue', value)
  } else {
    const newValue = checked
      ? [...(selected.value || []), value]
      : (selected.value || []).filter((v) => v !== value)
    selected.value = newValue
    emit('update:modelValue', newValue)
  }
}

useCheckbox({
  handleChange: handleChange,
  isChecked: isChecked
})
</script>
