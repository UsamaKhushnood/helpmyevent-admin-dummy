<script setup>
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading
} from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { computed, ref, watch } from 'vue'
import { useVModel, useElementSize } from '@vueuse/core'
import { CalendarRoot, useDateFormatter } from 'reka-ui'
import { createYear, toDate } from 'reka-ui/date'
import { DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const df = new DateFormatter('en-US', {
  dateStyle: 'long'
})

// Props & Emits
const props = defineProps({
  modelValue: { type: String, default: '' }, // Expecting a string like "2023-10-01"
  placeholder: { type: String, default: 'Pick a date' },
  weekdayFormat: { type: String, default: 'short' },
  class: { type: String, default: '' },
  error: { type: [Boolean, String], default: false }
})
const emits = defineEmits(['update:modelValue'])

const open = ref(false)
const trigger = ref(null)
const { width: triggerWidth } = useElementSize(trigger)
const inputWidth = computed(() => {
  return triggerWidth.value > 0 ? `${triggerWidth.value + 24}px` : 'auto'
})

// Reactive date state
const selectedDate = useVModel(props, 'modelValue', emits)

// Format date function (YYYY-MM-DD)
const formatDate = (dateObj) => {
  if (!dateObj?.year || !dateObj?.month || !dateObj?.day) return ''
  return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`
}

// Convert stored date string into an object
const currentDate = ref(props.modelValue ? parseDate(props.modelValue) : today(getLocalTimeZone()))

// Formatter
const formatter = useDateFormatter('en')

// Handle Date Selection
const selectDate = (date) => {
  currentDate.value = date
  selectedDate.value = formatDate(date) // Emit formatted date
  open.value = false
}

const value = computed({
  get: () => currentDate.value,
  set: (val) => {
    if (!val) return
    currentDate.value = val
  }
})

const calendarValueUpdate = (date) => {
  const formattedDate = formatDate(date)
  selectedDate.value = formattedDate // Updates modelValue via v-model
}


const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  // Past 100 years including current year
  for (let i = 100; i >= 0; i--) {
    years.push(currentYear - i)
  }
  // Future 20 years
  for (let i = 1; i <= 20; i++) {
    years.push(currentYear + i)
  }
  return years
})

watch(
  currentDate,
  (newVal) => {
    if (newVal) selectedDate.value = formatDate(newVal)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      currentDate.value = parseDate(newVal)
    } else {
      currentDate.value = today(getLocalTimeZone())
    }
  }
)
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button ref="trigger" variant="outline" :class="cn(
        'w-full px-4 border border-input text-sm text-start font-normal',
        !selectedDate && 'text-muted-foreground',
        error && 'border-2 border-destructive'
      )
        ">
        <span>{{ selectedDate ? selectedDate : props.placeholder }}</span>
        <CalendarIcon class="ms-auto h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="w-auto !min-w-[300px] p-0" :style="{ width: inputWidth }">
      <CalendarRoot v-slot="{ date, grid, weekDays }" v-model="value" @update:modelValue="calendarValueUpdate"
        :class="cn('rounded-md border p-3', props.class)">
        <CalendarHeader>
          <CalendarHeading class="flex w-full items-center justify-between gap-2">
            <Select :model-value="currentDate.month.toString()"
              @update:model-value="(v) => (currentDate = currentDate.set({ month: Number(v) }))">
              <SelectTrigger aria-label="Select month" class="w-[60%] h-9">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent class="max-h-[200px]">
                <SelectItem v-for="month in createYear({ dateObj: date })" :key="month.toString()"
                  :value="month.month.toString()">
                  {{ formatter.custom(toDate(month), { month: 'long' }) }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select :model-value="currentDate.year.toString()"
              @update:model-value="(v) => (currentDate = currentDate.set({ year: Number(v) }))">
              <SelectTrigger aria-label="Select year" class="w-[40%] h-9">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent class="max-h-[200px]">
                <SelectItem v-for="yearValue in yearOptions" :key="yearValue.toString()" :value="yearValue.toString()">
                  {{ yearValue }}
                </SelectItem>
              </SelectContent>
            </Select>
          </CalendarHeading>
        </CalendarHeader>

        <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
          <CalendarGrid v-for="month in grid" :key="month.value.toString()">
            <CalendarGridHead>
              <CalendarGridRow class="justify-between">
                <CalendarHeadCell v-for="day in weekDays" :key="day">
                  {{ day }}
                </CalendarHeadCell>
              </CalendarGridRow>
            </CalendarGridHead>
            <CalendarGridBody class="grid">
              <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`"
                class="mt-2 w-full justify-between">
                <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate"
                  @click="selectDate(weekDate)">
                  <CalendarCellTrigger :day="weekDate" :month="month.value" />
                </CalendarCell>
              </CalendarGridRow>
            </CalendarGridBody>
          </CalendarGrid>
        </div>
      </CalendarRoot>
    </PopoverContent>
  </Popover>
</template>
