<template>
  <main>
    <Toaster position="top-right" richColors />
    <RouterView></RouterView>
  </main>
</template>
<script setup>
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
</script>
