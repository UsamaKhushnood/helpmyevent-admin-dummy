<template>
  <Button
      size="icon"
      variant="ghost"
      @click="edit(index)"
  >
    <slot>
      <Pencil/>
    </slot>
  </Button>
</template>

<script>
import { Pencil } from 'lucide-vue-next'
import { Button } from "@/components/ui/button";

export default {
  props: {
    index: {
      type: [String, Number],
      default: ''
    }
  },
  inject: ['edit'],
  components: {
    Pencil, Button
  }
}
</script>
