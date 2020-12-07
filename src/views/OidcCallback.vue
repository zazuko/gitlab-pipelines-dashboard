<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'OidcCallback',
  async mounted () {
    try {
      const redirectPath = await this.$store.dispatch('oidc/oidcSignInCallback')
      this.$router.push(redirectPath)
    } catch (err) {
      console.error(err)
      // this.$router.push({ name: 'OidcError' })
    }
  }
})
</script>
