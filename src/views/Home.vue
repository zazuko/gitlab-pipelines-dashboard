<template>
  <div class="home">
    <app-header />

    <div v-if="group && group.projects">
      <div v-for="project in group.projects.nodes" :key="project.id">
        <b-collapse
          class="card"
          animation="slide"
          :open="isOpen == project.id"
          @open="isOpen = project.id"
        >
          <project-header slot="trigger" slot-scope="props" :project="project" :open="props.open" />
          <project-content :project="project" />
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import AppHeader from '../components/AppHeader.vue'
import ProjectHeader from '../components/ProjectHeader.vue'
import ProjectContent from '../components/ProjectContent.vue'

export default {
  data () {
    return {
      isOpen: '0'
    }
  },
  components: { AppHeader, ProjectHeader, ProjectContent },
  apollo: {
    group: gql`
      query {
        group(fullPath: "pipelines") {
          id
          projects {
            nodes {
              id
              webUrl
              name
              visibility
              avatarUrl
              description
              tagList
              namespace {
                fullName
                description
              }
              pipelines(first: 10) {
                nodes {
                  createdAt
                  duration
                  id
                  status
                  user {
                    name
                  }
                }
              }
              createdAt
            }
          }
        }
      }
    `
  }
}
</script>
