<template>
  <div
    class="card-header gitlab-project"
    role="button"
    v-bind:class="project.lastPipeline
        ? `pipeline-${project.lastPipeline.status}`.toLowerCase()
        : ''
    "
  >
    <p class="card-header-title">
      {{ project.name }}
    </p>
    <a class="card-header-icon">
      <span v-if="project.lastPipeline">
        <timeago
          :datetime="project.lastPipeline.createdAt"
          :auto-update="60"
        ></timeago>
        {{ '' }}
        <custom-tag :status="project.lastPipeline.status" />
      </span>

      {{ open ? '▲' : '▼' }}
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomTag from './CustomTag.vue'

export default Vue.extend({
  components: { CustomTag },
  props: [
    'project',
    'open'
  ]
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

  &.pipeline-running {
    border-left: 5px solid yellow;
    opacity: 1;
  }

  &.pipeline-canceled {
    border-left: 5px solid black;
    opacity: 1;
  }

  &.pipeline-scheduled {
    border-left: 5px solid blue;
    opacity: 1;
  }

  &.pipeline-success {
    border-left: 5px solid green;
    opacity: 1;
  }

  &.pipeline-failed {
    border-left: 5px solid red;
    opacity: 1;
  }
}
</style>
