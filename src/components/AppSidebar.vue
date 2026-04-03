<script setup lang="ts">
import {
  IconInnerShadowTop,
  IconUsers
} from "@tabler/icons-vue"

import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: "Super Admin",
    email: "admin@helpmyevent.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "/",
    //   icon: IconDashboard,
    // },
    {
      title: "User Management",
      url: "/users",
      icon: IconUsers,
    },
    // {
    //   title: "Chats Monitoring",
    //   url: "/chat",
    //   icon: IconChartBar,
    // },
  ],
}
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child class="data-[slot=sidebar-menu-button]:!p-1.5">
            <a href="#">
              <IconInnerShadowTop class="!size-5" />
              <span class="text-base font-semibold">HelpMyEvent</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent class="pt-4">
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
