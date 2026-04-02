<template>
  <Button
      size="icon"
      variant="ghost"
      @click="deleteFile(index)"
  >
    <slot>
      <Trash/>
    </slot>
  </Button>
</template>

<script>
import { Trash } from 'lucide-vue-next'
import { Button } from "@/components/ui/button";

export default {
  props: {
    index: {
      type: [String, Number],
      default: ''
    }
  },
  inject: ['deleteFile'],
  components: {
    Trash, Button
  }
}
</script>
