<template>
  <div :data-field="name">
    <Label
      class="mb-1.5 ms-0.5"
      v-if="label"
      :class="[{ 'text-destructive': errorMessage }, labelClass]"
    >
      {{ label }}
      <span class="text-destructive" v-if="required">*</span>
    </Label>

    <div>
      <slot :handleBlur="handleBlur" :message="errorMessage"></slot>

      <p v-if="helper" class="text-xs text-muted-foreground mt-1 ms-0.5">
        {{ helper }}
      </p>

      <slot name="message" :message="errorMessage">
        <p
          v-if="showMessage && errorMessage"
          class="text-xs text-destructive mt-1"
        >
          {{ errorMessage }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { useField } from './cFieldContext'
import { useFormContext } from './cFormContext'
import { computed } from 'vue'
import { Label } from '@/components/ui/label'

const { v } = useFormContext()

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
  helper: {
    type: String,
    default: '',
  },
  index: {
    type: [Number, String],
    default: null,
  },
  labelClass: {
    type: String,
    default: '',
  },
})

/**
 * Resolve a nested vuelidate node from a dot-path.
 * Example:
 *   "answers.0.answer" -> v.answers[0].answer
 */
function resolveVNode(path) {
  if (!path || !v) return null

  const segments = path.split('.')

  let node = v

  for (const key of segments) {
    if (!node) return null

    // numeric indexes like "0"
    const normalizedKey =
      key !== '' && !isNaN(key) ? Number(key) : key

    node = node[normalizedKey]
  }

  return node
}

const fieldNode = computed(() => {
  return resolveVNode(props.name)
})

const errorMessage = computed(() => {
  return fieldNode.value?.$errors?.[0]?.$message ?? null
})

const handleBlur = async () => {
  await fieldNode.value?.$touch?.()
}

useField({
  name: props.name,
  handleBlur,
})
</script>
