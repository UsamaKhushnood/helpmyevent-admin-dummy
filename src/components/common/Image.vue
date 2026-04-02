<template>
  <div v-if="loading || showError" :class="rounded" class="relative h-fit overflow-hidden">
    <Skeleton :class="cn('w-full h-10', skeletonClass)"></Skeleton>
    <div class="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]">
      <!--      <Spinner :class="iconSize" v-if="loading"></Spinner>-->
      <template v-if="showError">
        <slot name="errorIcon">
          <ImageOff :class="iconSize"/>
        </slot>
      </template>
    </div>
  </div>
  <img
    v-show="!loading && !showError"
    ref="imgRef"
    :class="rounded"
    :src="src"
    v-bind="$attrs"
    @error="showBlank"
    @load="loading = false"
  />
</template>
<script>
import {cn} from '@/lib/utils'
import {ImageOff} from 'lucide-vue-next'

export default {
  components: {ImageOff},
  inheritAttrs: false,
  props: {
    skeletonClass: {
      type: String
    },
    rounded: {
      type: String,
      default: 'rounded-md'
    },
    src: {
      type: null
    },
    iconSize: {
      type: String
    }
  },
  data() {
    return {
      loading: true,
      imgRef: null,
      showError: false
    }
  },
  watch: {
    src: {
      immediate: true,
      handler(image) {
        if (!image) {
          this.loading = false
          this.showError = true
        } else {
          this.loading = true
          this.showError = false
        }
      }
    }
  },
  mounted() {
    this.setUpRef()
  },

  methods: {
    cn,
    setUpRef() {
      this.imgRef = this.$refs.imgRef
    },
    showBlank() {
      this.loading = false
      this.showError = true
      this.$emit('error')
    }
  }
}
</script>
