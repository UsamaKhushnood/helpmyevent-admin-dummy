<template>
  <main class="relative">
    <div class="text-center flex justify-center items-center h-[calc(100vh-200px)]">
      <div>
        <h1 class="text-8xl font-bold">404</h1>
        <h1 class="text-3xl font-bold text-muted-foreground">Page Not Found</h1>
        <h1 class="text-base font-medium text-muted-foreground mt-2">The page you're looking for does not exist or under
          construction!</h1>
        <Button @click="$router.go(-1)" class="gap-2 mt-6 font-bold ml-2 mx-auto">
          <ArrowLeft size="18"/>
          Go Back To Previous Page
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
