<template>
  <Button :class="cn(
    'block w-full border rounded-lg px-6 py-4 hover:border-dashed hover:border-primary h-auto group text-left',
    dragOver ? 'border-dashed bg-gray-950' : 'bg-background',
    customClass
  )
    " aria-controls="fileInput" type="button" variant="simple" @click="triggerFileInput"
    @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
    <slot>
      <div :class="{ 'flex-col text-center': vertical }" class="flex items-center gap-3">
        <TheIcon class="size-10 min-w-10 rounded-lg text-foreground">
          <CloudUpload />
        </TheIcon>
        <div>
          <h6 class="text-sm">
            <span class="text-primary font-semibold">Click to upload</span>
            or drag and drop
          </h6>
          <p v-if="description" class="text-sm mt-1 text-muted-foreground whitespace-break-spaces">
            {{ description }}
          </p>
        </div>
      </div>
    </slot>
  </Button>
</template>
<script>
import { cn } from '@/lib/utils.ts'
import { CloudUpload } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import TheIcon from '@/components/common/TheIcon.vue'

export default {
  props: {
    class: { type: String, default: '' },
    dragOver: { type: Boolean, default: false },
    description: { type: String, default: '' },
    vertical: { type: Boolean, default: false }
  },
  inject: ['handleDragOver', 'handleDragLeave', 'handleDrop', 'triggerFileInput'],
  components: { CloudUpload, TheIcon, Button },
  computed: {
    customClass() {
      return this.class
    }
  },
  methods: {
    cn
  }
}
</script>
