<template>
  <div v-if="file" :class="cn('border p-4 rounded-lg', customClass)">
    <div class="flex gap-2">
      <File class="!size-5" height="20px" width="20px"/>
      <div class="w-[calc(100%-28px)]">
        <div class="flex justify-between">
          <h6 class="text-sm capitalize truncate max-w-[200px]">{{ file.name }}</h6>
          <div class="flex">
            <Button v-if="showResize" size="sm" @click="resize(index)">Resize</Button>
            <Button size="sm" variant="ghost" @click="deleteFile(index)">
              <Trash role="button"/>
            </Button>
          </div>
        </div>
        <h6 class="text-sm font-normal">{{ formatFileSize(file.size) }}</h6>
        <div class="flex items-center gap-2">
          <Progress :modelValue="currentProgress" class="h-2"/>
          <span class="text-sm">{{ currentProgress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cn } from '@/lib/utils.ts'
import { File, Trash } from 'lucide-vue-next'
import { Progress } from '@/components/ui/progress'
import { Button } from "@/components/ui/button";

export default {
  props: ['currentProgress', 'file', 'totalSize', 'class', 'index', 'showResize'],
  inject: ['formatFileSize', 'deleteFile', 'resize'],
  components: {
    File,
    Trash,
    Progress,
    Button
  },
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
