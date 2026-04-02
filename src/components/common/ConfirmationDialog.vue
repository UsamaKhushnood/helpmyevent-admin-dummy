<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <slot name="trigger">
        <Button variant="destructive"> Show Dialog</Button>
      </slot>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          <slot name="title"> Are you absolutely sure?</slot>
        </AlertDialogTitle>
        <AlertDialogDescription>
          <slot name="description">
            {{ description }}
          </slot>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction class="bg-destructive hover:bg-destructive/90" @click="$emit('confirm')">
          Confirm
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
<script>
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { TriangleAlert } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

export default {
  emits: ['confirm'],
  props: {
    description: {
      type: String,
      default: 'Are you sure you want to proceed with this action? This action cannot be undone.'
    }
  },
  components: {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Button,
    TriangleAlert,
  }
}
</script>
