<template>
  <div
    class="flex border items-center gap-3 bg-background px-4 py-2 rounded-md w-fit hover:ring-2 group transition hover:ring-primary cursor-pointer"
    @click="downloadFile(props.file?.url)">
    <FileIcon />
    <div>
      <p class="group-hover:text-primary">
        {{ props.file?.original_name }}
      </p>
      <p class="text-xs text-muted-foreground">
        {{ formatFileSize(props.file?.file_size) }}
      </p>
    </div>
    <Button @click="downloadFile(props.file?.url)" class="ms-10 group-hover:border-primary" variant="outline"
      size="icon">
      <Download />
    </Button>
  </div>
</template>
<script setup>
import { FileIcon, Download } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { downloadFile, formatDate, formatFileSize } from "@/lib/filters.js";

const props = defineProps({
  file: {
    type: Object,
    default: () => ({})
  }
})
</script>