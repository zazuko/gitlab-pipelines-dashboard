<template>
  <abbr :title="date">{{ computedDate }}</abbr>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: [
    'date'
  ],
  computed: {
    computedDate () {
      const d = new Date(`${this.date}`)
      return `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
    }
  }
})
</script>

<style scoped>
abbr {
  cursor: help;
}
</style>
