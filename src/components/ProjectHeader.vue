<template>
  <div
    class="card-header gitlab-project"
    role="button"
    :class="project.lastPipeline
      ? `pipeline-${project.lastPipeline.status}`.toLowerCase()
      : ''
    "
  >
    <p class="card-header-title">
      {{ projetName }}
    </p>
    <a class="card-header-icon">
      <span v-if="project.lastPipeline">
        <timeago
          :datetime="project.lastPipeline.createdAt"
          :auto-update="60"
        />
        {{ '' }}
        <custom-tag :status="project.lastPipeline.status" />
      </span>

      {{ open ? '▲' : '▼' }}
    </a>
  </div>
</template>

<script lang="ts">
import { Project } from '@/types/api'
import Vue from 'vue'
import CustomTag from './CustomTag.vue'

export default Vue.extend({
  components: { CustomTag },
  props: {
    project: {
      type: Object as () => Project,
      required: true
    },
    open: { type: Boolean, default: false }
  },
  computed: {
    projetName () {
      const project = this.project
      let name = project.name

      const namespace = project.namespace
      if (namespace) {
        if (namespace.fullName) {
          name = `${namespace.fullName} / ${name}`
        } else if (namespace.fullPath) {
          name = `${namespace.fullPath} / ${name}`
        }
      } else {
        if (project.fullPath) {
          const splittedPath = project.fullPath.split('/')
          if (splittedPath.length > 1) {
            splittedPath.pop()
          }
          const prefixPath = splittedPath.join(' / ')
          name = `${prefixPath} / ${name}`
        }
      }

      return name
    }
  }
})
</script>

<style lang="scss">
.gitlab-project {
  border-left: 5px solid grey;
  opacity: 0.2;

  &.pipeline-created,
  &.pipeline-waiting_for_response,
  &.pipeline-preparing,
  &.pipeline-pending {
    border-left: 5px solid orange;
    opacity: 1;
  }

  &.pipeline-canceled {
    border-left: 5px solid black;
    opacity: 1;
  }

  &.pipeline-running,
  &.pipeline-scheduled {
    border-left: 5px solid #3298dc;
    opacity: 1;
  }

  &.pipeline-success {
    border-left: 5px solid #48c774;
    opacity: 1;
  }

  &.pipeline-failed {
    border-left: 5px solid #f14668;
    opacity: 1;
  }
}
</style>
