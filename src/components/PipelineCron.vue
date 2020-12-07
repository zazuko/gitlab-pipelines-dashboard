<template>
  <span :title="cron">{{ computedCron }}</span>
</template>

<script lang="ts">
import Vue from 'vue'
import cronstrue from 'cronstrue'

export default Vue.extend({
  props: { cron: { type: String, required: true } },
  computed: {
    computedCron () {
      return cronstrue.toString(this.cron, {
        use24HourTimeFormat: true,
        verbose: true
      })
    }
  }
})
</script>
