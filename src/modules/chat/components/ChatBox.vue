<template>
  <div class="flex gap-4 group">
    <div :class="[isSent ? 'ml-auto mr-4' : 'ml-4']">
      <div class="mb-2 text-sm font-medium flex items-center gap-1">
        <div class="rounded-full p-1 bg-muted">
          <UserRound size="16" />
        </div>
        <h6>
          {{ message.user.name }}
        </h6>
      </div>
      <div class="   px-4 py-3 rounded-2xl mb-2 md:w-fit relative ms-auto"
        :class="[isSent ? 'bg-green-100 dark:bg-green-900 rounded-tr-none' : 'bg-neutral-100 dark:bg-secondary rounded-tl-none', { 'animate-pulse bg-primary/20 ': message?.loading }]">
        <div class="my-2" v-if="message.file">
          <div v-if="isImage(message.file.type)" class="w-fit h-[200px]">
            <Image
              skeletonClass="w-[260px] md:w-[400px] min-w-[260px] md:min-w-[400px] h-[200px] object-cover rounded-lg"
              rounded="rounded-lg" class="w-[260px] md:w-[400px] h-[200px] object-cover"
              :src="message.file.url ?? getFilePreview(message.file)" />
          </div>
          <div v-else class="flex w-[300px] h-[74px] items-center rounded-lg py-4 px-3 gap-2 bg-neutral-50 border"
            role="button" @click="downloadFile(message.file.url)">
            <img class="h-10" src="@/assets/images/pdf-icon.png" alt="">
            <div>
              <h6 class="text-xs font-medium truncate w-[160px]">{{ message.file.name }}</h6>
              <h6 class="text-xs">
                {{
                  message.file.created_at
                    ? formatTime(message.file.created_at)
                    : formatFileSize(message.file.size)
                }}
              </h6>
            </div>
            <Button class="hover:bg-primary hover:text-background relative ml-auto" size="icon">
              <CloudDownload class="!size-6" />
            </Button>
          </div>
        </div>
        <p class="text-foreground text-base font-medium max-w-[250px] md:max-w-[400px] break-words">
          {{ message.body }}
        </p>
      </div>
      <p class="text-muted-foreground text-xs" :class="{ 'text-right': isSent }">
        {{ formatTime(message.created_at) }}
      </p>
    </div>
  </div>
</template>
<script setup>
import Image from '@/components/common/Image.vue'
import { Button } from '@/components/ui/button'
import { formatFileSize, formatTime, isImage } from '@/filters'
import { useAuthStore } from '@/stores'
import { CloudDownload, UserRound } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'



const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const route = useRoute()

const isSent = computed(() => props.message?.user?.id === route.params.id)

const getFilePreview = (file) => {
  if (!file) return ''
  return URL.createObjectURL(file)
}

const downloadFile = (fileUrl) => {
  const link = document.createElement('a')
  link.href = fileUrl
  link.setAttribute('download', 'true')
  link.setAttribute('target', '_blank')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
