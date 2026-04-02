<template>
  <section class="select-none">
    <div class="flex items-center gap-2 justify-between w-full overflow-x-auto pb-3 whitespace-nowrap">
      <template v-for="(step, index) in stepsWithDividers" :key="`step-${index}`">
        <!-- Divider -->
        <div
            v-if="step.divider"
            class="flex-1 hidden md:flex items-center gap-2"
        >
          <div
              class="h-0.5 w-full rounded-full"
              :class="step._index < activeIndex ? 'bg-primary' : 'bg-primary/30'"
          ></div>
        </div>

        <!-- Step -->
        <div
            v-else
            class="flex items-center gap-2 cursor-pointer group"
            @click="changeStep(step)"
        >
          <div
              class="w-4 mb-0.5 md:w-5 h-4 md:h-5 text-xs font-medium border-6 border-primary/30 text-primary flex items-center justify-center z-10 rounded-full relative"
              :class="[
              stepState(step) === 'active'
                ? 'text-primary-foreground !border-primary'
                : stepState(step) === 'completed'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-secondary-foreground border-border'
            ]"
          >
            <TickIcon
                v-if="stepState(step) === 'completed'"
                :size="14"
                :stroke-width="4"
                class="absolute"
            />
          </div>
          <h4
              class="font-medium text-xs md:text-base"
              :class="[
              stepState(step) === 'active' || stepState(step) === 'completed'
                ? 'text-primary'
                : 'text-muted-foreground'
            ]"
          >
            {{ step._index + 1 }}. {{ step.title }}
          </h4>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { Check as TickIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  steps: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const activeStep = useVModel(props, 'modelValue', emit)

const activeIndex = computed(() =>
    props.steps.findIndex(step => step.value === activeStep.value)
)

const stepsWithDividers = computed(() => {
  const result = []

  props.steps.forEach((step, index) => {
    result.push({...step, _index: index})

    if (index < props.steps.length - 1) {
      result.push({divider: true, _index: index})
    }
  })

  return result
})

const stepState = (step) => {
  if (step._index < activeIndex.value) return 'completed'
  if (step._index === activeIndex.value) return 'active'
  return 'inactive'
}

const changeStep = (step) => {
  // activeStep.value = step.value
  emit('change', step.value)
}
</script>
