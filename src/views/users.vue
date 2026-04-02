<template>
  <div>
    <div class="flex items-center mb-3">
      <h1 class="text-3xl font-bold tracking-tight">Users</h1>
    </div>

    <DefineFilters>
      <div class="flex gap-3">
        <div class="min-w-[160px] md:-mt-5">
          <CSelect placeholder="Status" v-model="filters.status" :options="statuses" />
        </div>
        <div class="min-w-[160px] md:-mt-5">
          <CSelect placeholder="Role" v-model="filters.role" :options="roles" />
        </div>
        <div class="min-w-[200px] md:-mt-5">
          <CSelect placeholder="Sort" :options="sortOptions" v-model="filters.sort" />
        </div>

        <Button @click="applyFilters">Apply filters</Button>
        <Button @click="removeFiltered" v-if="filtersApplied" variant="outline">Remove filters
        </Button>
      </div>
    </DefineFilters>

    <div class="flex items-center gap-3 mt-5">
      <Searchbar v-model="filters.search" class="lg:max-w-[400px]" @search="Search" @clear="removeSearch"
        :loading="searching" />
      <ReuseFilters class="hidden lg:flex ms-auto" />
      <Drawer v-model:open="showDrawer">
        <DrawerTrigger class="lg:hidden">
          <Button class="w-12 border-input border" variant="outline">
            <SlidersHorizontal />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <div class="p-4">
            <ReuseFilters class="flex-col gap-8" />
          </div>
        </DrawerContent>
      </Drawer>
    </div>

    <CDataTable class="mt-6" :fields="fields" :items="data.items" :total="data.total" :loading="loading"
      @page-change="pageChange">
      <template #name="{ data }">
        <UserProfileCard :user="data" />
      </template>
      <template #is_nurse="{ data }">
        <Badge v-if="data.is_nurse"> Coach</Badge>
        <Badge class="ml-1 bg-blue-500 hover:bg-blue-500" v-if="data.is_active && data.is_nurse">
          Active
        </Badge>
        <Badge variant="secondary" v-else> User</Badge>
      </template>
      <template #verification_document="{ data }">
        <Button v-if="data.verification_document" variant="link" size="xs" @click="showDialog(data)">View file
        </Button>
      </template>
      <template #actions="{ data }">
        <div class="flex gap-3 w-full sm:justify-end flex-wrap sm:flex-nowrap">
          <Button v-if="data.is_nurse && !data.is_active" size="xs" :loading="activating && selected.id === data.id"
            @click="ActivateUser(data)">
            Activate
          </Button>
          <Button :variant="data.is_restricted ? 'default' : 'destructive'" size="xs"
            :loading="restricting && selected.id === data.id" @click="RestrictUser(data)">
            {{ data.is_restricted ? 'Unrestrict' : 'Restrict' }}
          </Button>
          <Button size="xs" @click="$router.push(`/users/${data.id}/threads`)">
            View Threads
          </Button>
          <Button size="xs" @click="$router.push(`/users/${data.id}/transactions`)">
            View Transactions
          </Button>
        </div>
      </template>
    </CDataTable>
    <CDialog contentClass="max-w-[540px]" ref="dialog" @hide="hideDialog" title="Verification Documents" hideFooter
      v-slot="{ hide }">
      <div>
        <div class="space-y-3 py-6">
          <div class="rounded-lg border bg-background p-4 flex items-center justify-between"
            v-for="(file, index) in selected.verification_document" :key="file.id">
            <div class="flex items-center gap-3">
              <img width="36" src="@/assets/images/pdf-icon.png" alt="pdf icon" />
              <div>
                <h3 class="text-sm font-medium truncate max-w-[280px]">{{ file.name }}</h3>
                <h3 class="text-xs mt-0.5">{{ $filters.formatDate(file.created_at) }}</h3>
              </div>
            </div>
            <Button size="xs" @click="$filters.downloadFile(file.url)">Download</Button>
          </div>
        </div>
        <Button variant="outline" @click="hide" class="ms-auto block">Close</Button>
      </div>
    </CDialog>
  </div>
</template>
<script>
import CDataTable from '@/components/common/CDataTable.vue'
import CDialog from '@/components/common/CDialog.vue'
import CSelect from '@/components/common/form/CSelect.vue'
import Searchbar from '@/components/common/Searchbar.vue'
import UserProfileCard from '@/components/common/UserProfileCard.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button/index.js'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Toggle } from '@/components/ui/toggle'
import { downloadFile } from '@/lib/filters.js'
import { useUsersStore } from '@/stores/index.js'
import { createReusableTemplate } from '@vueuse/core'
import { SlidersHorizontal } from 'lucide-vue-next'
import { mapActions } from 'pinia'

const [DefineFilters, ReuseFilters] = createReusableTemplate()
export default {
  components: {
    Button,
    CDialog,
    Searchbar,
    CSelect,
    UserProfileCard,
    CDataTable,
    Toggle,
    Badge,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
    DefineFilters,
    ReuseFilters,
    SlidersHorizontal
  },
  data() {
    return {
      showDrawer: false,
      loading: false,
      restricting: false,
      data: {
        items: [],
        total: 0
      },
      per_page: 15,
      page: 1,
      sortOptions: [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' }
      ],
      statuses: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Restricted', value: 'restricted' }
      ],
      roles: [
        { label: 'All', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Coach', value: 'coach' }
      ],
      filters: {
        search: '',
        status: 'all',
        sort: 'latest',
        role: 'all'
      },
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'gender', label: 'Gender', class: 'capitalize', collapse: true },
        { key: 'wallet_balance', label: 'Wallet balance', type: 'currency', collapse: true },
        { key: 'is_nurse', label: 'Type', collapse: true },
        { key: 'verification_document', label: 'Verification document', collapse: true },
        { key: 'actions', label: 'Actions', width: '100px', collapse: true }
      ],
      searching: false,
      activating: false,
      filtersApplied: false,
      selected: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    downloadFile,
    ...mapActions(useUsersStore, {
      getAll: 'getAll',
      restrict: 'restrict',
      unrestrict: 'unrestrict',
      activate: 'activate'
    }),
    showDialog(item) {
      this.selected = item
      this.$nextTick(() => {
        this.$refs.dialog.show()
      })
    },
    hideDialog() {
      this.selected = {}
    },
    getData() {
      this.loading = true
      this.getAll({
        page: this.page,
        ...this.filters
      })
        .then((res) => {
          this.data = res
        })
        .finally(() => {
          this.loading = false
          this.searching = false
        })
    },
    applyFilters() {
      this.filtersApplied = true
      this.page = 1
      this.showDrawer = false
      this.$nextTick(() => {
        this.getData()
      })
    },
    removeFiltered() {
      this.filtersApplied = false
      this.filters = {
        search: '',
        status: 'all',
        sort: 'latest',
        role: 'all'
      }
      this.showDrawer = false
      this.getData()
    },
    ActivateUser(user) {
      this.activating = true
      this.selected = user
      this.activate(user.id)
        .then((res) => {
          this.data.items[user.index].is_active = true
        })
        .finally(() => {
          this.activating = false
        })
    },
    RestrictUser(user) {
      this.restricting = true
      this.selected = user
      const action = user.is_restricted ? this.unrestrict : this.restrict
      action(user.id)
        .then((res) => {
          this.data.items[user.index].is_restricted = !user.is_restricted
        })
        .finally(() => {
          this.restricting = false
        })
    },
    Search() {
      this.searching = true
      this.page = 1
      this.getData()
    },
    removeSearch() {
      this.filters.search = ''
      this.Search()
    },

    pageChange(page) {
      this.page = page
      this.getData()
    }
  }
}
</script>
