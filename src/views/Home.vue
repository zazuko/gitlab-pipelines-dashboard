<template>
  <div class="home">
    <app-header />

    <div class="container">
      <b-field
        grouped
        class="my-4"
      >
        <b-field
          label="Filter by name"
          expanded
          custom-class="is-small"
        >
          <b-input v-model="state.name" />
        </b-field>

        <b-field
          label="Pipeline status"
          custom-class="is-small"
        >
          <b-dropdown
            v-model="state.statuses"
            multiple
            aria-role="list"
          >
            <button
              class="button is-primary"
              type="button"
              slot="trigger"
            >
              <span v-if="state.statuses.length === 0">No filter</span>
              <span v-else>Selected ({{ state.statuses.length }})</span>
            </button>

            <b-dropdown-item
              v-for="status in allStatuses"
              :key="status"
              :value="status"
              aria-role="listitem"
            >
              <span>{{ status }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-field>

        <b-field
          label="Project tags"
          custom-class="is-small"
        >
          <b-dropdown
            v-model="state.tags"
            multiple
            aria-role="list"
          >
            <button
              class="button is-primary"
              type="button"
              slot="trigger"
            >
              <span v-if="state.tags.length === 0">No filter</span>
              <span v-else>Selected ({{ state.tags.length }})</span>
            </button>

            <b-dropdown-item
              v-for="tag in allTags"
              :key="tag"
              :value="tag"
              aria-role="listitem"
            >
              <span>{{ tag }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-field>
      </b-field>

      <b-loading
        :is-full-page="false"
        v-model="loading"
        :can-cancel="false"
      />

      <div v-if="!loading && !error">
        <div
          v-for="project in projects"
          :key="project.id"
        >
          <b-collapse
            class="card"
            animation="slide"
            :open="project.isOpen"
            @open="open(project.id)"
          >
            <project-header
              slot="trigger"
              slot-scope="props"
              :project="project"
              :open="props.open"
            />
            <project-content
              :project="project"
              :id="project.id"
            />
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import AppHeader from '../components/AppHeader.vue'
import ProjectHeader from '../components/ProjectHeader.vue'
import ProjectContent from '../components/ProjectContent.vue'
import { PipelineStatus, Query, Project, MappedProject } from '../types/api'

const statusOrder = (status: PipelineStatus): number => {
  switch (status) {
    case PipelineStatus.Created:
    case PipelineStatus.WaitingForResource:
    case PipelineStatus.Preparing:
    case PipelineStatus.Pending:
      return 3
    case PipelineStatus.Running:
      return 2
    case PipelineStatus.Canceled:
      return 5
    case PipelineStatus.Scheduled:
      return 4
    case PipelineStatus.Success:
      return 6
    case PipelineStatus.Failed:
      return 1
    case PipelineStatus.Skipped:
    case PipelineStatus.Manual:
    default:
      return 7
  }
}

export default defineComponent({
  components: { AppHeader, ProjectHeader, ProjectContent },
  setup () {
    const { result, loading, error } = useQuery<Query>(gql`
      query {
        projects {
          nodes {
            id
            webUrl
            name
            visibility
            avatarUrl
            description
            tagList
            fullPath
            namespace {
              name
              fullName
              fullPath
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
    `)

    const projects = useResult(result, [] as Project[], (data) => data.projects.nodes)

    let defaultTags
    const selectedTags = window.APP_CONFIG.selectedTags
    if (selectedTags) {
      defaultTags = [...new Set(selectedTags.split(','))]
    } else {
      defaultTags = []
    }

    const state = reactive<{ open: string | null; statuses: string[]; name: string; tags: string[] }>({
      open: null,
      statuses: [],
      name: '',
      tags: defaultTags
    })

    const mappedProjects = computed(() => projects.value.map((project: Project): MappedProject => ({
      ...project,
      isOpen: project.id === state.open,
      lastPipeline: project.pipelines.nodes[0],
      tags: [...new Set(project.tagList.split(',').map(tag => tag.trim()))].filter(tag => tag !== '')
    })).sort((a, b) => {
      // Make the project without pipelines go to the end of the list
      if (!a.lastPipeline && !b.lastPipeline) {
        // and compare them by name
        return a.name.localeCompare(b.name)
      } else if (!a.lastPipeline) {
        return 1
      } else if (!b.lastPipeline) {
        return -1
      } else {
        // else, compare their status
        const diff = statusOrder(a.lastPipeline.status) - statusOrder(b.lastPipeline.status)
        if (diff === 0) {
          // if they have the same status, order them by name
          return a.name.localeCompare(b.name)
        } else {
          return diff
        }
      }
    }))

    const allStatuses = computed(() => [...new Set(mappedProjects.value.map((project: MappedProject) => {
      if (!project.lastPipeline) {
        return 'without pipeline'
      } else {
        return project.lastPipeline.status.toLocaleLowerCase()
      }
    }))])

    const allTags = computed(() => {
      const tagsSet = new Set(mappedProjects.value.map((project: MappedProject) => {
        if (project.tags.length === 0) {
          return 'without tag'
        } else {
          return project.tags
        }
      }).flat())

      defaultTags.forEach(tag => {
        tagsSet.add(tag)
      })

      return [...tagsSet]
    })

    const filteredProjects = computed(() => mappedProjects.value.filter((project: MappedProject) => {
      let displayProject = false
      if (state.statuses.length > 0) {
        if (state.statuses.includes('without pipeline')) {
          if (!project.lastPipeline) {
            displayProject = true
          }
        }
        if (project.lastPipeline) {
          if (state.statuses.includes(project.lastPipeline.status.toLocaleLowerCase())) {
            displayProject = true
          }
        }
      } else {
        displayProject = true
      }

      if (!displayProject) {
        return false
      }

      if (state.name.length > 0) {
        if (!project.name.toLocaleLowerCase().includes(state.name.toLocaleLowerCase())) {
          return false
        }
      }

      displayProject = false
      if (state.tags.length > 0) {
        if (state.tags.includes('without tag')) {
          if (project.tags.length === 0) {
            displayProject = true
          }
        }
        if (project.tags.length > 0) {
          displayProject = project.tags.some(t => state.tags.includes(t))
        }
      } else {
        displayProject = true
      }

      return displayProject
    }))

    function open (id: string) {
      state.open = id
    }

    return {
      projects: filteredProjects,
      allStatuses,
      allTags,
      state,
      open,
      loading,
      error
    }
  }
})
</script>
