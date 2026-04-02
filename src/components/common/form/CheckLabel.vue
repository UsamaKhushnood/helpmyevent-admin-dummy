<template>
  <Label
    :class="[checked ? 'border-primary' : 'hover:border-primary']"
    :for="uniqueID + option.value"
    class="flex items-center gap-1 border-2 rounded-lg p-1 cursor-pointer"
  >
    <slot :id="uniqueID + option.value"></slot>
    <h6 class="text-foreground">{{ option.label }}</h6>
  </Label>
</template>
<script>
import { uniqueId } from 'lodash'
import { Label } from '@/components/ui/label'

export default {
  props: {
    selected: { type: String },
    option: { type: Object },
    checked: { type: Boolean }
  },
  components: { Label },
  data() {
    return {
      uniqueID: uniqueId('label-')
    }
  }
}
</script>
