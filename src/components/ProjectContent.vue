<template>
  <div class="card-content">
    <div class="content">
      <p>
        <span v-if="project.description">{{ project.description }} - </span>
        <a
          :href="project.webUrl"
          target="_blank"
          rel="noopener noreferrer"
        >Open project on GitLab</a>
      </p>

      <div
        v-if="project.tags.length > 0"
        class="tags"
      >
        <span
          v-for="tag in project.tags"
          class="tag"
          :key="tag"
        >{{
          tag
        }}</span>
      </div>

      <p v-if="pipelines.length > 0">
        <strong>Pipelines:</strong>
      </p>
      <ul v-if="pipelines.length > 0">
        <li
          v-for="pipeline in pipelines"
          :key="pipeline.id"
        >
          <custom-tag :status="pipeline.status" />
          {{ " " }}
          <timeago
            :datetime="pipeline.createdAt"
            :title="pipeline.createdAt"
            :auto-update="60"
            class="time-ago"
          />, duration: <pipeline-duration :seconds="pipeline.duration" />
          <span v-if="pipeline.rest">
            , ref: <a
              :href="
                project.webUrl + '/-/tree/' + pipeline.rest.ref
              "
              target="_blank"
              rel="noopener noreferrer"
            >{{ pipeline.rest.ref }}</a>
          </span> -
          <a
            :href="
              project.webUrl + '/-/pipelines/' + pipeline.id.replace(/.*\//, '')
            "
            target="_blank"
            rel="noopener noreferrer"
          >Open pipeline on GitLab</a>
          <template v-if="pipeline.status === 'FAILED'">
            -
            <button
              class="button is-small"
              @click="() => retryPipeline(project.id, pipeline.id.replace(/.*\//, ''))"
            >
              Retry pipeline
            </button>
          </template>
        </li>
      </ul>
      <p v-else>
        <em>No pipeline for this project.</em>
      </p>

      <p v-if="!schedulesLoading && (schedulesError || schedules.length > 0)">
        <strong>Schedules:</strong>
      </p>
      <ul v-if="!schedulesLoading && !schedulesError && schedules.length > 0">
        <li
          v-for="schedule in schedules"
          :key="schedule.id"
        >
          {{ schedule.description }}
          <ul>
            <li>Next run at: <custom-date :date="schedule.nextRunAt" /></li>
            <li>Cron: <pipeline-cron :cron="schedule.cron" /></li>
            <li>Active: {{ schedule.active }}</li>
            <li>
              Ref:
              <a
                :href="project.webUrl + '/-/tree/' + schedule.ref"
                target="_blank"
                rel="noopener noreferrer"
              >{{ schedule.ref }}</a>
            </li>
          </ul>
        </li>
      </ul>
      <b-loading
        :is-full-page="false"
        v-model="schedulesLoading"
        :can-cancel="false"
      />
      <b-message
        type="is-danger"
        v-if="!schedulesLoading && schedulesError"
      >
        {{ schedulesError }}
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'

import CustomDate from './CustomDate.vue'
import CustomTag from './CustomTag.vue'
import PipelineDuration from './PipelineDuration.vue'
import PipelineCron from './PipelineCron.vue'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { PipelineRest, PipelineWithRest, Project, Schedule } from '../types/api'

import type { State as QueryState } from '../store/query'
import type { VuexOidcState } from 'vuex-oidc'
const { useState } = createNamespacedHelpers<QueryState>('query')
const { useState: useOidcState } = createNamespacedHelpers<VuexOidcState>('oidc')

export default defineComponent({
  components: { CustomDate, CustomTag, PipelineDuration, PipelineCron },
  props: {
    project: { type: Object as () => Project, required: true },
    id: { type: String, required: true }
  },
  setup (props) {
    const { access_token: accessToken } = useOidcState(['access_token'])
    const { pollInterval } = useState(['pollInterval'])

    const retryPipeline = (projectId: number, pipelineId: number) => {
      fetch(`${window.APP_CONFIG.gitlab}/api/v4/projects/${projectId}/pipelines/${pipelineId}/retry`, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${accessToken.value}`
        })
      })
    }

    const schedulesQuery = useQuery(gql`
      query Schedules($id: string!) {
        schedules (id: $id) @rest(path: "/projects/{args.id}/pipeline_schedules", type: "[Schedule]") {
          id
          cron
          nextRunAt
          active
          description
          ref
        }
      }
    `, { id: props.id }, () => ({ pollInterval: pollInterval.value }))

    const pipelinesRestQuery = useQuery(gql`
      query Pipelines($id: string!) {
        pipelinesRest (id: $id) @rest(path: "/projects/{args.id}/pipelines", type: "[PipelineRest]") {
          id
          ref
          status
        }
      }
    `, { id: props.id }, () => ({ pollInterval: pollInterval.value }))

    const schedules = useResult<Array<Schedule>>(schedulesQuery.result)
    const schedulesLoading = schedulesQuery.loading
    const schedulesError = schedulesQuery.error

    const pipelinesRest = useResult<Array<PipelineRest>>(pipelinesRestQuery.result)
    const pipelines = computed(() => props.project.pipelines.nodes.map((pipeline): PipelineWithRest => {
      const rest = pipelinesRest.value?.filter(r => `gid://gitlab/Ci::Pipeline/${r.id}` === pipeline.id)[0]
      return {
        rest,
        ...pipeline
      }
    }))

    return {
      pipelines,
      schedules,
      schedulesLoading,
      schedulesError,
      retryPipeline
    }
  }
})
</script>

<style scoped>
.time-ago {
  border-bottom: 1px dashed #4a4a4a;
  cursor: help;
}
</style>
