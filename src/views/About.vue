<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>{{ projects }}</div>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'

export default {
  apollo: {
    currentUser: gql`
      query {
        currentUser {
          email
          name
        }
      }
    `,
    projects: gql`
      query {
        projects(membership: true, searchNamespaces: true) {
          nodes {
            id
            webUrl
            name,
            description
            namespace {
              fullName
              description
            }
            pipelines(first: 3) {
              nodes {
                createdAt
                duration
                id
                status
              }
            }
            createdAt
          }
        }
      }
    `
  }
}
</script>
