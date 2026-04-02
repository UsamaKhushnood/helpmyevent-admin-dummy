<template>
  <form @submit.prevent="handleSubmit">
    <slot :v="v" :invalid="v.$invalid" :error="v.$error" :reset="reset"></slot>
  </form>
</template>
<script setup>
import { useForm } from './cFormContext'
import { useVuelidate } from '@vuelidate/core'
import { reactive, computed, watch } from 'vue'


const props = defineProps({
  initialValues: {
    type: Object,
    default: {}
  },
  schema: {
    type: Object
  },
  onSubmit: {
    type: Function
  }
})

const state = reactive(props.initialValues)
const validationSchema = computed(() => props.schema)

const v = useVuelidate(validationSchema, state, { $lazy: true })

watch(
    () => props.schema,
    () => {
      v.value.$reset()
    }
)

const scrollToFirstError = () => {
  const errors = v.value.$errors
  if (!errors.length) return

  const firstError = errors[0]
  const fieldName = firstError.$property

  const el =
      document.querySelector(`[name="${fieldName}"]`) ||
      document.querySelector(`[data-field="${fieldName}"]`)

  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })

  el.focus?.()
}

const handleSubmit = async () => {
  const isValid = await v.value.$validate()

  if (!isValid) {
    scrollToFirstError()
    return
  }

  if (isValid && props.onSubmit) {
    props.onSubmit(state)
  }
}

const reset = () => {
  v.value.$reset()
}

defineExpose({
  reset,
  v
})

useForm({
  schema: props.schema,
  v: v.value
})
</script>
