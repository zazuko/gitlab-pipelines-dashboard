<template>
  <div class="tag" :class="computedClass">
    {{ computedTag }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: [
    'status'
  ],
  computed: {
    computedClass () {
      switch (`${this.status}`.toLocaleLowerCase()) {
        case 'failed':
          return 'is-danger'
        case 'success':
          return 'is-success'
        default:
          return 'is-info'
      }
    },
    computedTag () {
      return this.status.toLocaleLowerCase()
    }
  }
})
</script>
