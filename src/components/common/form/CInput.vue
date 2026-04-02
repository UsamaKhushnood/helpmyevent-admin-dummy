<template>
  <Input @blur="handleBlur"/>
</template>
<script setup>
import { useFieldContext } from '@/components/common/form/cFieldContext.js'
import { Input } from '@/components/ui/input'

const {handleBlur} = useFieldContext()
</script>
