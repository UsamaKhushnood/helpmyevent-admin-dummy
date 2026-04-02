<template>
  <main class="relative">
    <div class="text-center flex justify-center items-center h-[calc(100vh-200px)]">
      <div>
        <h1 class="text-3xl text-muted-foreground">You don't have permission to access</h1>
        <h1 class="text-sm text-muted-foreground mt-2"> You do not have permission to access this page. Please contact
          your administrator.
        </h1>
        <Button @click="$router.go(-1)" class="gap-2 uppercase mt-6 font-bold ml-2 mx-auto">
          <ArrowLeft size="18"/>
          Go Back
        </Button>
      </div>
    </div>
  </main>
</template>
<script>
import { ArrowLeft, House } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

export default {
  components: {ArrowLeft, House, Button}
}
</script>
