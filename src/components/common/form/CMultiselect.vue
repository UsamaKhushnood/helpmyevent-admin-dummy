<script setup>
import { computed, ref, watch } from 'vue'
import {
    TagsInputRoot,
    ComboboxContent,
    ComboboxInput,
    ComboboxLabel,
    ComboboxRoot,
    useFilter,
} from 'reka-ui'
import {
    ComboboxAnchor,
    ComboboxGroup,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxTrigger,
    ComboboxViewport,
} from '@/components/ui/combobox'
import {
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
} from '@/components/ui/tags-input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { X, ChevronsUpDown, Check } from 'lucide-vue-next'
import { useVModel, useElementSize } from '@vueuse/core'
import ComboboxEmpty from '@/components/ui/combobox/ComboboxEmpty.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Type to search...' },
    disabled: { type: Boolean, default: false },
    triggerClass: { type: [String, Object], default: '' },
    emptyText: { type: String, default: 'No results found.' },
})

const emits = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
})

const { contains } = useFilter({ sensitivity: 'base' })

const query = ref('')
const open = ref(false)
const openCombobox = ref(false)
const trigger = ref(null)
const { width: triggerWidth } = useElementSize(trigger)
const inputWidth = computed(() =>
    triggerWidth.value > 0 ? `${triggerWidth.value + 12}px` : 'auto'
)

const filteredOptions = computed(() =>
    props.options.filter(
        (option) =>
            contains(option, query.value) && !modelValue.value?.includes(option)
    )
)

watch(
    modelValue,
    () => {
        query.value = ''
    },
    { deep: true }
)
</script>

<template>
    <div class="select-none w-full">
        <Popover :open="open || openCombobox">
            <ComboboxRoot v-model="modelValue" v-model:open="openCombobox" multiple ignore-filter :disabled="disabled"
                class="relative">
                <PopoverTrigger class="cursor-pointer" as-child>
                    <ComboboxAnchor @click="openCombobox = true" ref="trigger"
                        class="w-full flex items-center justify-between rounded-md p-[5px] dark:bg-input/30 border-input border gap-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        :class="triggerClass">
                        <TagsInputRoot v-model="modelValue"
                            class="flex gap-1 gap-x-2 items-center rounded-md pr-6 whitespace-nowrap overflow-auto w-full flex-1">
                            <TagsInputItem v-for="item in modelValue" :key="item" :value="item"
                                class="flex items-center justify-center gap-1 text-white bg-primary rounded-[5px] p-1">
                                <TagsInputItemText class="text-sm px-1" />
                                <TagsInputItemDelete class="m-0 cursor-pointer">
                                    <X class="h-4 w-4" />
                                </TagsInputItemDelete>
                            </TagsInputItem>
                            <ComboboxTrigger>
                                <ComboboxInput v-model="query" as-child>
                                    <TagsInputInput :placeholder="placeholder" @keydown.enter.prevent />
                                </ComboboxInput>
                            </ComboboxTrigger>
                            <ChevronsUpDown class="size-4 text-muted-foreground absolute right-3" />
                        </TagsInputRoot>
                    </ComboboxAnchor>
                </PopoverTrigger>
                <PopoverContent align="end" class="w-auto !min-w-[300px] p-0" :style="{ width: inputWidth }">
                    <ComboboxContent>
                        <ComboboxViewport>
                            <ComboboxGroup v-if="filteredOptions.length">
                                <ComboboxLabel class="px-2 py-1.5 font-medium text-xs text-muted-foreground">
                                    {{ placeholder }}
                                </ComboboxLabel>
                                <ComboboxItem v-for="(option, index) in filteredOptions" :key="index" :value="option">
                                    <div class="size-4 rounded border "></div>
                                    <ComboboxItemIndicator>
                                        <Check class="h-4 w-4" />
                                    </ComboboxItemIndicator>
                                    <span>{{ option }}</span>
                                </ComboboxItem>
                            </ComboboxGroup>
                            <ComboboxEmpty v-else>
                                {{ emptyText }}
                            </ComboboxEmpty>
                        </ComboboxViewport>
                    </ComboboxContent>
                </PopoverContent>
            </ComboboxRoot>
        </Popover>
    </div>
</template>
