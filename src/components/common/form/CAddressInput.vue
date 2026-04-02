<template>
  <div class="relative">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <div ref="inputContainer" class="relative">
          <Input ref="inputRef" role="combobox" v-model="inputValue" :placeholder="placeholder" @input="handleInput"
            @focus="open = true" @keydown="handleKeydown" />
          <div v-if="loading" class="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 class="h-4 w-4 animate-spin" />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent v-if="inputValue" class="p-0 w-full" :style="{ width: inputWidth }">
        <div v-if="showNoResults" class="p-2 text-sm text-red-500">
          No results found
        </div>

        <ul v-else-if="predictions.length" class="max-h-60 overflow-auto rounded-md bg-background p-1">
          <li v-for="(prediction, index) in predictions" :key="prediction.place_id" :id="`prediction-${index}`"
            class="cursor-pointer p-2 text-sm rounded-sm hover:bg-accent"
            :class="{ 'bg-accent text-accent-foreground': index === highlightedIndex }"
            @mouseenter="highlightedIndex = index" @click="selectPrediction(prediction)">
            {{ prediction.description }}
          </li>
        </ul>
      </PopoverContent>
    </Popover>

    <div v-if="errorMessage" class="text-sm text-red-500 mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick, defineExpose } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { useElementSize } from '@vueuse/core'

/* ---------------- props / emits ---------------- */

const props = defineProps({
  modelValue: {
    type: [String, Object, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select your address'
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

/* ---------------- refs ---------------- */

const inputContainer = ref(null)
const inputRef = ref(null)

/* 🔒 DO NOT CHANGE (as requested) */
const { width: triggerWidth } = useElementSize(inputRef)
const inputWidth = computed(() => {
  return triggerWidth.value > 0 ? `${triggerWidth.value + 24}px` : 'auto'
})

const inputValue = ref('')
const predictions = ref([])
const highlightedIndex = ref(-1)
const loading = ref(false)
const showNoResults = ref(false)
const open = ref(false)
const errorMessage = ref('')

const autocompleteService = ref(null)
const placesService = ref(null)
const PlacesServiceStatus = ref(null)

// address: {
// full_address: '',
// streetNumber: '',
// street: '',
// city: '',
// state: '',
// country: '',
// postcode: '',
// lat: '',
// lng: ''
// }

// address: {
//   street: { required: helpers.withMessage('Street is missing from this address', required) },
//   city: { required: helpers.withMessage('City is missing from this address', required) },
//   state: { required: helpers.withMessage('State is missing from this address', required) },
//   country: { required: helpers.withMessage('Country is missing from this address', required) },
//   postcode: { required: helpers.withMessage('Postcode is missing from this address', required) },
// }

/* ---------------- sync model → input ---------------- */

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value =
      typeof val === 'object'
        ? val?.full_address || val?.fullAddress || ''
        : val || ''
  },
  { immediate: true }
)

/* ---------------- helpers ---------------- */

const resetResults = () => {
  predictions.value = []
  showNoResults.value = false
  loading.value = false
  open.value = false
}

const fetchPredictions = (query) => {
  return new Promise((resolve, reject) => {
    autocompleteService.value.getPlacePredictions(
      { input: query, types: ['geocode', 'establishment'] },
      (result, status) => {
        status === PlacesServiceStatus.value.OK
          ? resolve(result)
          : reject(status)
      }
    )
  })
}

const parseAddressComponents = (components) => {
  const map = {}
  components.forEach(c =>
    c.types.forEach(t => (map[t] = c.long_name))
  )
  return map
}

/* ---------------- input logic ---------------- */

const handleInput = async () => {
  if (!autocompleteService.value) return
  if (!inputValue.value) return resetResults()

  loading.value = true
  open.value = true
  showNoResults.value = false
  errorMessage.value = ''

  try {
    const result = await fetchPredictions(inputValue.value)
    predictions.value = result
    highlightedIndex.value = -1
    showNoResults.value = result.length === 0
  } catch {
    showNoResults.value = true
  } finally {
    loading.value = false
  }
}

/* ---------------- keyboard navigation ---------------- */

const handleKeydown = (e) => {
  if (!open.value || !predictions.value.length) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value =
        (highlightedIndex.value + 1) % predictions.value.length
      scrollIntoView()
      break

    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value =
        (highlightedIndex.value - 1 + predictions.value.length) %
        predictions.value.length
      scrollIntoView()
      break

    case 'Enter':
      e.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectPrediction(predictions.value[highlightedIndex.value])
      }
      break

    case 'Escape':
      open.value = false
      break
  }
}

const scrollIntoView = () => {
  nextTick(() => {
    const el = document.getElementById(`prediction-${highlightedIndex.value}`)
    el?.scrollIntoView({ block: 'nearest' })
  })
}

/* ---------------- selection ---------------- */

const selectPrediction = (prediction) => {
  inputValue.value = prediction.description
  open.value = false
  getPlaceDetails(prediction.place_id)
}

const getPlaceDetails = (placeId) => {
  placesService.value.getDetails(
    { placeId, fields: ['address_components', 'geometry'] },
    (place, status) => {
      if (status !== PlacesServiceStatus.value.OK) return

      const components = parseAddressComponents(place.address_components)

      const addressData = {
        full_address: inputValue.value,
        streetNumber: components.street_number || null,
        street: `${components.street_number || ''} ${components.route || ''}`.trim() || null,
        city: components.locality || null,
        state: components.administrative_area_level_1 || null,
        country: components.country || null,
        postcode: components.postal_code || null,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }

      emit('update:modelValue', addressData)
      emit('select', addressData)
    }
  )
}

/* ---------------- expose ---------------- */

defineExpose({
  setAddressValue(address) {
    inputValue.value =
      address?.full_address || address?.fullAddress || ''
  }
})

/* ---------------- mount ---------------- */

onMounted(async () => {
  try {
    setOptions({ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY })
    const {
      AutocompleteService,
      PlacesService,
      PlacesServiceStatus: PSS
    } = await importLibrary('places')

    autocompleteService.value = new AutocompleteService()
    placesService.value = new PlacesService(document.createElement('div'))
    PlacesServiceStatus.value = PSS
  } catch (e) {
    console.error('Google Maps API failed to load', e)
  }
})
</script>
