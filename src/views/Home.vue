<template>
  <div class="home">
    <app-header />

    <div class="container">
      <div v-for="project in projects" :key="project.id">
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
          <project-content :project="project" />
        </b-collapse>
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

type Actor = {
  name: string;
}

type Namespace = {
  fullName: string;
  description: string;
};

type Schedule = {
  id: string;
  cron: string;
  nextRunAt: string;
  active: boolean;
  description: string;
  ref: string;
}

type Pipeline = {
  createdAt: string;
  duration: number;
  id: string;
  status: PipelineStatus;
  user: Actor;
}

type Project = {
  id: string;
  webUrl: string;
  name: string;
  visibility: string;
  avatarUrl: string;
  description: string;
  tagList: string;
  schedules: Schedule[];
  namespace: Namespace;
  createdAt: string;
  pipelines: {
    nodes: Pipeline[];
  };
}

type MappedProject = Project & {
  isOpen: boolean;
  lastPipeline?: Pipeline;
  tags: string[];
}

type Query = {
  group: {
    id: string;
    projects: {
      nodes: Project[];
    };
  };
}

enum PipelineStatus {
  Created = 'CREATED',
  WaitingForResource = 'WAITING_FOR_RESOURCE',
  Preparing = 'PREPARING',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Failed = 'FAILED',
  Success = 'SUCCESS',
  Canceled = 'CANCELED',
  Skipped = 'SKIPPED',
  Manual = 'MANUAL',
  Scheduled = 'SCHEDULED',
}

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
    const { result } = useQuery<Query>(gql`
      query {
        group(fullPath: "pipelines") {
          id
          projects {
            nodes {
              id @export(as: "id")
              webUrl
              name
              visibility
              avatarUrl
              description
              tagList
              schedules @rest(path: "/projects/{exportVariables.id}/pipeline_schedules", type: "[PipelineSchedule]") {
                id
                cron
                nextRunAt
                active
                description
                ref
              }
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
    `)

    const projects = useResult(result, [] as Project[], (data) => data.group.projects.nodes)

    const state = reactive<{ open: string | null }>({
      open: null
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

    function open (id: string) {
      state.open = id
    }

    return {
      projects: mappedProjects,
      state,
      open
    }
  }
})
</script>
