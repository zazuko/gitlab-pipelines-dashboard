<template>
  <div class="card-content">
    <div class="content">
      <p>
        <span v-if="project.description">{{ project.description }} - </span>
        <a :href="project.webUrl" target="_blank" rel="noopener noreferrer"
          >Open project on GitLab</a
        >
      </p>

      <div v-if="project.tags.length > 0" class="tags">
        <span v-for="tag in project.tags" class="tag" :key="tag">{{
          tag
        }}</span>
      </div>

      <p v-if="project.pipelines.nodes.length > 0">
        <strong>Pipelines:</strong>
      </p>
      <ul v-if="project.pipelines.nodes.length > 0">
        <li v-for="pipeline in project.pipelines.nodes" :key="pipeline.id">
          <custom-tag :status="pipeline.status" />
          {{ " " }}
          <timeago
            :datetime="pipeline.createdAt"
            :title="pipeline.createdAt"
            :auto-update="60"
            class="time-ago"
          ></timeago
          >, duration: <pipeline-duration :seconds="pipeline.duration" /> -
          <a
            :href="
              project.webUrl + '/-/pipelines/' + pipeline.id.replace(/.*\//, '')
            "
            target="_blank"
            rel="noopener noreferrer"
            >Open pipeline on GitLab</a
          >
        </li>
      </ul>
      <p v-else><em>No pipeline for this project.</em></p>

      <p v-if="!loading && (error || schedules.length > 0)">
        <strong>Schedules:</strong>
      </p>
      <ul v-if="!loading && !error && schedules.length > 0">
        <li v-for="schedule in schedules" :key="schedule.id">
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
                >{{ schedule.ref }}</a
              >
            </li>
          </ul>
        </li>
      </ul>
      <b-loading :is-full-page="false" v-model="loading" :can-cancel="false" />
      <b-message type="is-danger" v-if="!loading && error">
        {{ error }}
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import CustomDate from './CustomDate.vue'
import CustomTag from './CustomTag.vue'
import PipelineDuration from './PipelineDuration.vue'
import PipelineCron from './PipelineCron.vue'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { Schedule } from '../types/api'

export default defineComponent({
  components: { CustomDate, CustomTag, PipelineDuration, PipelineCron },
  props: [
    'project',
    'id'
  ],
  setup (props) {
    const { result, loading, error } = useQuery(gql`
      query Schedules($id: string!) {
        schedules (id: $id) @rest(path: "/projects/{args.id}/pipeline_schedules", type: "[PipelineSchedule]") {
          id
          cron
          nextRunAt
          active
          description
          ref
        }
      }
    `, { id: props.id })

    const schedules = useResult<Array<Schedule>>(result)

    return {
      schedules,
      loading,
      error
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
