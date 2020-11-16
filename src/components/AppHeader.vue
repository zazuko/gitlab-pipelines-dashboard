<template>
  <b-navbar wrapper-class="container" :spaced="true" :shadow="true">
    <template slot="brand">
      <b-navbar-item
        tag="a"
        href="https://zazuko.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="../assets/zazuko-logo.svg" alt="Zazuko" />
      </b-navbar-item>
    </template>

    <template slot="start">
      <b-navbar-item href="/">Pipelines Dashboard</b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <p v-if="currentUser">
          Logged in as
          <strong>
            {{ currentUser.name }}
            <small>({{ currentUser.email }})</small>
          </strong>
        </p>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

export default Vue.extend({
  apollo: {
    currentUser: gql`
      query {
        currentUser {
          email
          name
        }
      }
    `
  }
})
</script>
