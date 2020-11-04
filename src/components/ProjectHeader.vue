<template>
  <div
    class="card-header gitlab-project"
    role="button"
    v-bind:class="
      project.pipelines.nodes.length > 0 && project.pipelines.nodes[0].status
        ? `pipeline-${project.pipelines.nodes[0].status}`.toLowerCase()
        : ''
    "
  >
    <p class="card-header-title">
      {{ project.name }}
    </p>
    <a class="card-header-icon">
      <span v-if="project.pipelines.nodes.length > 0">
        <timeago
          :datetime="project.pipelines.nodes[0].createdAt"
          :auto-update="60"
        ></timeago>
        (duration: {{ project.pipelines.nodes[0].duration }}s)
        {{ project.pipelines.nodes[0].status }}
      </span>
      <b-icon :icon="open ? 'menu-up' : 'menu-down'"> </b-icon>
    </a>
  </div>
</template>

<script lang="ts">
export default {
  props: [
    'project',
    'open'
  ]
}
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
