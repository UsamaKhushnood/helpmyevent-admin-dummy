<template>
  <Dialog v-if="renderDialog" v-model:open="showDialog" @update:open="modalToggled">
    <DialogTrigger as-child>
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogContent @open-auto-focus="handleOpenAutoFocus" :class="cn(contentClass || 'max-w-[425px]')">
      <DialogHeader>
        <DialogTitle class="capitalize">
          <slot name="title">{{ title }}</slot>
        </DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <div :class="['p-1 overflow-y-auto', largeBody ? 'min-h-[70vh] max-h-[calc(100vh-140px)]' : 'max-h-[calc(100vh-200px)]']">
        <slot :hide="hide" :renderDialog="renderDialog"></slot>
      </div>
      <DialogFooter v-if="!hideFooter">
        <slot name="footer">
          <Button variant="outline" @click="hide">Cancel</Button>
          <Button v-if="!hideSubmit" @click="$emit('create')">Confirm</Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script>
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    contentClass: {
      type: String,
      default: ''
    },
    /** When true, the dialog body uses more vertical space (min-h-[70vh]). Use for editor/full-height content. */
    largeBody: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    disableAutoFocus: {
      type: Boolean,
      default: false
    },
    hideSubmit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button
  },
  data() {
    return {
      showDialog: false,
      renderDialog: false
    }
  },
  methods: {
    cn,
    show() {
      this.renderDialog = true
      this.$nextTick(() => {
        this.showDialog = true
      })
    },
    handleOpenAutoFocus(e) {
      if (this.disableAutoFocus) {
        e.preventDefault()
      }
    },
    hide() {
      this.showDialog = false
      this.$emit('hide')
      setTimeout(() => {
        this.renderDialog = false
      }, 200)
    },
    modalToggled(isOpen) {
      if (!isOpen) {
        this.hide()
      }
    }
  }
}
</script>
