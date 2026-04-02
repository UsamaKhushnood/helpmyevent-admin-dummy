<template>
  <div class="flex items-center">
    <div v-for="x in 5" :key="x" :class="{ 'cursor-pointer': editable }">
      <i
        class="bi bi-star-fill"
        :class="[
          editable
            ? active >= x
              ? 'text-yellow-500'
              : 'text-gray-400'
            : rating >= x
              ? 'text-yellow-500'
              : 'text-gray-400',
          size
        ]"
        @mouseover="highlight(x)"
        @mouseout="highlight(rating)"
        @click="$emit('rate', x)"
      ></i>
    </div>
    <h5 v-if="showCount" class="font-size-16-md font-size-22 mb-0 font-tertiary ms-1">
      {{ getFixed }}
    </h5>
  </div>
</template>
<script>
export default {
  props: {
    rating: {
      type: [Number, String],
      default: null
    },
    showCount: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'text-md'
    }
  },
  data() {
    return {
      active: 0
    }
  },
  computed: {
    getFixed() {
      return this.rating ? parseFloat(this.rating).toFixed(1) : ''
    }
  },
  watch: {
    rating(newVal) {
      if (this.editable) {
        this.highlight(newVal)
      }
    }
  },
  mounted() {
    this.active = this.rating
  },
  methods: {
    highlight(index) {
      this.active = index
    }
  }
}
</script>
