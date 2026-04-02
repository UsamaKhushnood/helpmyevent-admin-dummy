<template>
  <div :class="cn('flex items-center', customClass)" v-if="showPreview">
    <div
        class="rounded-lg border bg-background size-[100px] p-4 flex items-center justify-center mr-2"
    >
      <img
          v-if="isImage(file.type)"
          width="64px"
          height="64px"
          class="rounded-full size-16"
          :src="getFilePreview(file)"
          alt="file preview"
          aria-hidden="true"
      />
      <img v-else width="64" src="@/assets/images/pdf-icon.png" alt="pdf icon"/>
    </div>

    <div v-if="showControls">
      <p class="text-sm mb-1 ps-2">
        {{ file.name }}
      </p>
      <slot name="controls">
        <EditTrigger/>
        <DeleteTrigger/>
      </slot>
    </div>
  </div>
</template>
<script>
import { cn } from '@/lib/utils.ts'
import { getFilePreview, isImage } from '@/lib/filters.js'
import EditTrigger from '@/components/common/uploader/EditTrigger.vue'
import DeleteTrigger from '@/components/common/uploader/DeleteTrigger.vue'

export default {
  components: {
    EditTrigger,
    DeleteTrigger
  },
  props: {
    file: {
      type: [Object, String]
    },
    showPreview: {
      type: Boolean
    },
    class: {
      type: String,
      default: ''
    },
    index: {
      type: [String, Number],
      default: ''
    },
    showControls: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    customClass() {
      return this.class
    }
  },
  methods: {
    cn,
    isImage,
    getFilePreview
  }
}
</script>
