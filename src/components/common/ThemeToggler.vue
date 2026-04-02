<template>
  <Button
      ref="buttonRef"
      size="icon"
      variant="outline"
      @click="toggleTheme"
  >
    <Sun v-if="mode === 'dark'" class="h-[20px]"/>
    <Moon v-else class="h-[20px]"/>
  </Button>
</template>

<script setup>
import { ref } from 'vue'
import { useColorMode } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const mode = useColorMode({
  initialValue: 'light',
})
const buttonRef = ref(null)

const toggleTheme = async () => {
  const newTheme = mode.value === 'dark' ? 'light' : 'dark'

  // Check if View Transition API is supported and motion is not reduced
  if (
      !buttonRef.value ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    mode.value = newTheme
    return
  }

  // Start view transition
  const transition = document.startViewTransition(() => {
    mode.value = newTheme
  })

  await transition.ready

  // Get button position for circular animation origin
  const rect = buttonRef.value.$el.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  // Calculate maximum radius to cover entire screen
  const right = window.innerWidth - rect.left
  const bottom = window.innerHeight - rect.top
  const maxRadius = Math.hypot(
      Math.max(rect.left, right),
      Math.max(rect.top, bottom)
  )

  // Animate the transition with circular clip-path
  document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
  )
}
</script>
