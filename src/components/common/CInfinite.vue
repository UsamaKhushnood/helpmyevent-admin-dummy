<template>
  <InfiniteLoading v-if="has_more_pages" :distance="200" firstload @infinite="load">
    <template v-slot:spinner>
      <slot name="spinner">
        <div v-show="!hideSpinner" class="flex justify-center">
          <Spinner/>
        </div>
      </slot>
    </template>
    <template v-slot:complete>
      <div></div>
    </template>
    <template v-slot:error>
      <div></div>
    </template>
  </InfiniteLoading>
  <!-- <h6 class="text-center py-6" v-else>No more data</h6> -->
</template>
<script>
import InfiniteLoading from 'v3-infinite-loading'
import Spinner from '@/components/common/Spinner.vue'

export default {
  components: {InfiniteLoading, Spinner},
  props: {
    has_more_pages: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 250
    },
    hideSpinner: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    load($state) {
      if (this.has_more_pages && !this.loading) {
        setTimeout(() => {
          this.$emit('load', $state)
        }, this.timeout)
      }
      if (!this.has_more_pages) {
        $state.complete()
      }
    }
  }
}
</script>
