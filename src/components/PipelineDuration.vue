<template>
  <span :title="computedSeconds">{{ computedDuration }}</span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['seconds'],
  computed: {
    computedSeconds () {
      return `${this.seconds} seconds`
    },
    computedDuration () {
      const propsSeconds = this.seconds as number
      const hours = Math.floor(propsSeconds / 3600)
      const minutes = Math.floor((propsSeconds - (hours * 3600)) / 60)
      const seconds = propsSeconds - (hours * 3600) - (minutes * 60)

      if (hours > 0) {
        if (minutes > 0) {
          return `${hours}h ${minutes}min`
        } else {
          return `${hours} hours`
        }
      } else {
        if (minutes > 0) {
          return `${minutes}min ${seconds}s`
        } else {
          return `${seconds} seconds`
        }
      }
    }
  }
})
</script>
