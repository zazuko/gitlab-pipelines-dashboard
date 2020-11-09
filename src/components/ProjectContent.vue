<template>
  <div class="card-content">
    <div class="content">
      <p>
        {{ project.description }} -
        <a :href="project.webUrl" target="_blank" rel="noopener noreferrer"
          >Open project on GitLab</a
        >
      </p>

      <p v-if="project.pipelines.nodes.length > 0">Pipelines:</p>
      <ul v-if="project.pipelines.nodes.length > 0">
        <li v-for="pipeline in project.pipelines.nodes" :key="pipeline.id">
          {{ pipeline.status }} (<timeago
          :datetime="pipeline.createdAt"
          :title="pipeline.createdAt"
          :auto-update="60"
          class="time-ago"
        ></timeago>, duration:
          {{ pipeline.duration }}s) -
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
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: [
    'project'
  ]
}
</script>

<style scoped>
.time-ago {
  border-bottom: 1px dashed #4a4a4a;
  cursor: help;
}
</style>
