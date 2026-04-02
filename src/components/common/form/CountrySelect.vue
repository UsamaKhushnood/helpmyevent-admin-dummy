<template>
  <CCombobox placeholder="Select Country" :options="allCountries" v-model="selectedCountry"
    @update:model-value="handleSelect" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCommonStore } from '@/stores'
import { useVModel } from '@vueuse/core'
import CCombobox from '@/components/common/form/CCombobox.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const selectedCountry = useVModel(props, 'modelValue', emit)

const commonStore = useCommonStore()

const allCountries = computed(() => {
  return commonStore.CountriesList.map((item) => {
    return {
      label: item.country_name,
      value: item.country_name,
      ...item
    }
  })
})

const handleSelect = (val) => {
  const country = allCountries.value.find(c => c.value === val)
  emit('select', country)
}

onMounted(() => {
  if (commonStore.CountriesList.length === 0) {
    commonStore.GetCountries()
  }
})
</script>
