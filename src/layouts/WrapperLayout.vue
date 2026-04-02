<template>
  <ConfigProvider>
    <RouterView></RouterView>
  </ConfigProvider>
</template>
<script>
import { ConfigProvider } from 'reka-ui'

export default {
  components: {
    ConfigProvider
  }
}
</script>
