<template>
  <Badge :variant="getVariant()" class="flex items-center gap-1">
    <component :is="getIcon()" class="w-4 h-4" v-if="getIcon()" />
    <slot>
      <span class="capitalize">
        {{ props.status?.replace('_', ' ') || 'Unknown' }}
      </span>
    </slot>
  </Badge>
</template>

<script setup>
import { Badge } from '@/components/ui/badge'
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  AlertCircle
} from 'lucide-vue-next'

const props = defineProps({
  status: { type: null, required: true }
})

// Function to return variant based on status
const getVariant = () => {
  switch (props.status?.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'danger'

    case 'medium':
      return 'pending'

    case 'low':
      return 'success'

    default:
      return 'neutral'
  }
}

// Function to return icon based on status
const getIcon = () => {
  switch (props.status?.toLowerCase()) {
    case 'critical':
    case 'high':
      return ShieldAlert

    case 'medium':
      return Shield

    case 'low':
      return ShieldCheck

    default:
      return AlertCircle
  }
}
</script>