<template>
  <div class="select-none w-full">
    <h6
      v-if="showLabel"
      class="text-xs mb-1 font-medium text-muted-foreground"
    >
      {{ placeholder }}
    </h6>
    <Select v-model="modelValue" :disabled="loading || disabled">
      <SelectTrigger
        ref="trigger"
        class="w-full bg-background cursor-pointer"
        :class="triggerClass"
      >
        <div class="flex items-center truncate w-full">
          <Spinner v-if="loading" class="size-4 mr-2" />
          <slot name="selected" :placeholder="placeholder" :value="modelValue">
            <SelectValue
              class="truncate"
              :placeholder="placeholder"
            ></SelectValue>
            <slot name="badge"></slot>
          </slot>
        </div>
      </SelectTrigger>
      <SelectContent :style="{ maxWidth: inputWidth }">
        <SelectGroup>
          <SelectLabel
            v-if="!loading && !options?.length"
            class="py-20 text-center text-base font-normal text-muted-foreground"
            >No Options Available
          </SelectLabel>
          <SelectLabel v-else class="text-xs text-muted-foreground">{{
            placeholder
          }}</SelectLabel>
          <template v-if="!loading">
            <slot>
              <SelectItem
                v-for="(option, index) in options"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
              >
                <slot name="item" :option="option">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="option.img"
                      :src="option.img"
                      class="w-[20px]"
                      alt="icon"
                      aria-hidden="true"
                    />
                    <component
                      :is="option.icon"
                      v-if="option.icon"
                      alt="icon"
                      aria-hidden="true"
                    />
                    {{ option.label }}
                  </div>
                </slot>
              </SelectItem>
            </slot>
          </template>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useVModel, useElementSize } from "@vueuse/core";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/common/Spinner.vue";

const props = defineProps({
  defaultValue: { type: [String, Number] },
  modelValue: { type: [String, Number] },
  class: { type: null },
  placeholder: { type: String },
  options: { type: null },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showLabel: { type: Boolean, default: false },
  triggerClass: { type: null, default: "" },
});

const emits = defineEmits(["update:modelValue"]);
const trigger = ref(null);
const { width: triggerWidth } = useElementSize(trigger);
const inputWidth = computed(() => {
  return triggerWidth.value > 0 ? `${triggerWidth.value + 30}px` : "auto";
});

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>
