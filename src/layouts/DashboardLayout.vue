<script setup>
import AppSidebar from "@/components/AppSidebar.vue"
import ChartAreaInteractive from "@/components/ChartAreaInteractive.vue"
import SectionCards from "@/components/SectionCards.vue"
import SiteHeader from "@/components/SiteHeader.vue"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


</script>

<template>
  <SidebarProvider :style="{
    '--sidebar-width': 'calc(var(--spacing) * 72)',
    '--header-height': 'calc(var(--spacing) * 14)',
  }">
    <AppSidebar variant="inset" />
    <SidebarInset class="border">
      <SiteHeader />
      <RouterView></RouterView>
      <div class="flex flex-1 flex-col">
        <div class="@container/main flex flex-1 flex-col gap-2">
          <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div class="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
