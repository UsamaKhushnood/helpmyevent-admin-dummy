<template>
  <div class="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="bg-muted px-3 h-10 select-none transition-colors"
            :class="[{ 'hidden lg:table-cell uppercase': field.collapse, 'cursor-pointer hover:bg-muted': field.sortable }, field.hClass]"
            :width="field.width" v-for="field in fields" :key="field.key" @click="handleSort(field)">
            <div class="flex items-center gap-2">
              {{ field.label }}
              <template v-if="field.sortable">
                <ArrowUp v-if="localSortBy === field.key && localSortDir === 'asc'" class="h-3 w-3" />
                <ArrowDown v-else-if="localSortBy === field.key && localSortDir === 'desc'" class="h-3 w-3" />
                <ArrowUpDown v-else class="h-3 w-3 opacity-50" />
              </template>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading" v-for="item in itemsPerPage" :key="item">
          <TableCell class="p-3" :class="{ 'hidden lg:table-cell': field.collapse }" v-for="(field, x) in fields"
            :key="x">
            <Skeleton class="w-[calc(90%)] h-5" />
          </TableCell>
        </TableRow>
        <template v-if="!loading">
          <template v-for="(item, index) in sortedItems" :key="item.id ?? index">
            <!-- Main row with data -->
            <Collapsible as-child>
              <TableRow class="group cursor-pointer hover:bg-muted/50" @click="$emit('row-click', item)">
                <TableCell class="p-3 whitespace-nowrap"
                  :class="[{ 'hidden lg:table-cell': field.collapse }, field.class]" :width="field.width"
                  v-for="(field, x) in fields" :key="field.key">
                  <template v-if="$slots[field.key]">
                    <div class="flex items-center gap-1" :class="[field.class]">
                      <CollapsibleTrigger v-if="x === 0"
                        class="flex lg:hidden text-foreground data-[state=open]:rotate-90 transition-transform duration-200">
                        <ChevronRight class="size-4" />
                      </CollapsibleTrigger>
                      <slot :name="field.key" :data="item" :index="index"></slot>
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex items-center gap-1" :class="[field.class]">
                      <CollapsibleTrigger v-if="x === 0"
                        class="flex lg:hidden text-foreground data-[state=open]:rotate-90 transition-transform duration-200">
                        <ChevronRight class="size-4" />
                      </CollapsibleTrigger>
                      {{ formatFieldValue(getNestedValue(item, field.key), field) }}
                    </div>
                  </template>
                </TableCell>
              </TableRow>

              <!-- Collapsible content row -->
              <CollapsibleContent as-child>
                <TableRow class="group">
                  <TableCell :colSpan="fields.length" class="p-3 space-y-2">
                    <div v-for="(field, x) in getCollapsibleFields(fields)" :key="field.key">
                      <div class="flex gap-6">
                        <h3 class="font-semibold">{{ field.label }}:</h3>
                        <div>
                          <template v-if="$slots[field.key]">
                            <slot :name="field.key" :data="item" :index="index"></slot>
                          </template>
                          <template v-else>
                            {{ formatFieldValue(getNestedValue(item, field.key), field) }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </CollapsibleContent>
            </Collapsible>
          </template>
        </template>
        <TableRow v-if="items.length === 0 && !loading">
          <TableCell class="text-center py-40 text-lg font-semibold text-gray-500" :colSpan="fields.length">
            No data found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>


    <div v-if="pagination && total > itemsPerPage" class="p-2 px-4 flex items-center justify-end border-t gap-3">
      <Pagination class="justify-between items-center" v-slot="{ page }" :total="total" :sibling-count="0" show-edges
        :default-page="1" :itemsPerPage="itemsPerPage" @update:page="pageUpdate">
        <p class="text-nowrap text-muted-foreground text-sm">
          Showing
          {{ (page - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(page * itemsPerPage, total) }}
          of {{ total }} entries
        </p>
        <PaginationContent v-slot="{ items }" class="flex items-center gap-1 w-fit">
          <PaginationPrevious />
          <template v-for="(item, index) in items">
            <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" class="size-8 p-0" as-child>
              <Button :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
              </Button>
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </div>
  </div>

</template>
<script>
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDatetime, formatPrice } from '@/lib/filters.js'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from 'lucide-vue-next'

export default {
  components: {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Skeleton,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    ChevronRight, Button,
    ArrowUpDown, ArrowUp, ArrowDown
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    itemsPerPage: {
      type: [Number, String],
      default: 15
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    pagination: {
      type: Boolean,
      default: true
    },
    sortBy: {
      type: String,
      default: ''
    },
    sortDir: {
      type: String,
      default: 'asc'
    }
  },
  data() {
    return {
      localSortBy: this.sortBy,
      localSortDir: this.sortDir
    }
  },
  watch: {
    sortBy(val) {
      this.localSortBy = val
    },
    sortDir(val) {
      this.localSortDir = val
    }
  },
  computed: {
    sortedItems() {
      if (!this.localSortBy) {
        return this.items
      }
      return [...this.items].sort((a, b) => {
        const valA = this.getNestedValue(a, this.localSortBy)
        const valB = this.getNestedValue(b, this.localSortBy)

        if (valA === valB) return 0

        let result = 0
        if (valA === null || valA === undefined) result = -1
        else if (valB === null || valB === undefined) result = 1
        else if (typeof valA === 'string' && typeof valB === 'string') {
          result = valA.localeCompare(valB)
        } else {
          result = valA < valB ? -1 : 1
        }

        return this.localSortDir === 'asc' ? result : -result
      })
    }
  },
  methods: {
    formatPrice, formatDate, formatDatetime,
    getNestedValue(obj, path) {
      return path
        .split('.')
        .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj)
    },
    formatFieldValue(value, field) {
      if (field.type === 'currency') {
        return formatPrice(value)
      }
      if (field.type === 'percentage') {
        return `${value}%`
      }
      if (field.type === 'date') {
        if (!value) {
          return ''
        }
        return formatDate(value)
      }
      if (field.type === 'datetime') {
        if (!value) {
          return ''
        }
        return formatDatetime(value)
      }
      return value
    },
    pageUpdate(e) {
      this.$emit('pageChange', e)
    },
    getCollapsibleFields(fields) {
      return fields.filter((field) => field.collapse)
    },
    handleSort(field) {
      if (!field.sortable) return

      if (this.localSortBy === field.key) {
        this.localSortDir = this.localSortDir === 'asc' ? 'desc' : 'asc'
      } else {
        this.localSortBy = field.key
        this.localSortDir = 'asc'
      }
      this.$emit('sort', { sortBy: this.localSortBy, sortDir: this.localSortDir })
      this.$emit('update:sortBy', this.localSortBy)
      this.$emit('update:sortDir', this.localSortDir)
    }
  }
}
</script>
