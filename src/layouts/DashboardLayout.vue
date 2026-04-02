<script setup>
import AppSidebar from "@/components/AppSidebar.vue";
import ChartAreaInteractive from "@/components/ChartAreaInteractive.vue";
import SectionCards from "@/components/SectionCards.vue";
import SiteHeader from "@/components/SiteHeader.vue";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 14)',
    }"
  >
    <AppSidebar variant="inset" />
    <SidebarInset class="border overflow-hidden">
      <SiteHeader />
      <div class="p-8 md:gap-6 overflow-y-auto h-[calc(100vh-100px)]">
        <RouterView></RouterView>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
