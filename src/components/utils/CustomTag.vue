<template>
  <div
    class="tag"
    :class="computedClass"
  >
    {{ computedTag }}
  </div>
</template>

<script lang="ts">
import { PipelineStatus } from '@/types/api'
import Vue from 'vue'
export default Vue.extend({
  props: {
    status: {
      type: String as () => PipelineStatus,
      required: true
    }
  },
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
