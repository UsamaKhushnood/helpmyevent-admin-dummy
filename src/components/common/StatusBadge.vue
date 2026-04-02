<template>
  <Badge :variant="getVariant()" class="flex items-center gap-1">
    <component :is="getIcon()" class="w-4 h-4" v-if="getIcon()"/>
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
  CircleCheck, 
  Loader, 
  X as XIcon, 
  AlertCircle, 
  Archive, 
  Ban, 
  CheckCircle2, 
  Clock, 
  FileText 
} from 'lucide-vue-next'

const props = defineProps({
  status: {type: null, required: true}
})

// Function to return variant based on status
const getVariant = () => {
  switch (props.status?.toLowerCase()) {
    // Danger/Red
    case 'overdue':
    case 'rejected':
    case 'reject':
    case 'closed':
    case 'close':
    case 'high risk':
      return 'danger'
    
    // Warning/Yellow/Orange
    case 'pending':
    case 'processing':
      return 'pending'
    
    // Success/Green
    case 'active':
    case 'approved':
    case 'completed':
    case 'assigned':
    case 'healthy':
      return 'success'
    
    // Neutral/Gray
    case 'inactive':
    case 'draft':
    case 'archived':
      return 'neutral'
      
    default:
      return 'primary'
  }
}

// Function to return icon based on status
const getIcon = () => {
  switch (props.status?.toLowerCase()) {
    // Success Icons
    case 'active':
    case 'approved':
    case 'assigned':
    case 'healthy':
    case 'completed':
      return CircleCheck
      
    // Pending/Process Icons
    case 'pending':
    case 'processing':
      return Loader
      
    // Error/Danger Icons
    case 'overdue':
      return AlertCircle
    case 'rejected':
    case 'reject':
    case 'closed':
    case 'close':
    case 'high risk':
      return XIcon
      
    // Neutral Icons
    case 'inactive':
      return Ban
    case 'draft':
      return FileText
    case 'archived':
      return Archive
      
    default:
      return CircleCheck
  }
}
</script>
