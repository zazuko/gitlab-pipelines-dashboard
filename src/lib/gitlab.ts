import gitlabQuery from "./gitlabQuery";
import { AugmentedBranch, AugmentedProject, Branch, Pipeline, PipelineSchedule, Project } from "./gitlabTypes";

/**
 * Generate some useful URLs from a GitLab project.
 *
 * @param project Project to get URLs from.
 * @returns List of useful URLs.
 */
const projectUrls = (project: Project) => {
  const base = `/v4/projects/${project.id}`;
  return {
    project: `${base}`,
    branches: `${base}/repository/branches`,
    pipelines: `${base}/pipelines`,
    pipelinesSchedules: `${base}/pipeline_schedules`,
  }
};

/**
 * Filter a list of projects to have a specific tag.
 * Returns all projects if `tags` is empty.
 *
 * @param projects List of projects.
 * @param tags Tags to filter projects.
 * @returns Filtered projects.
 */
const filterProjectsByTags = (projects: Project[], tags: string[]): Project[] => {
  if (tags.length === 0) {
    return projects;
  }
  return projects.filter((project: Project) => tags.some(tag => project.topics.includes(tag)));
};

/**
 * Add more information to a project.
 *
 * @param accessToken AccessToken to query GitLab API.
 * @param project GitLab project.
 * @returns Project with additional fields, like `branches`, `schedules`, `pipelines` and `status`.
 */
const addAddtionalProjectFields = async (accessToken: string, project: Project): Promise<AugmentedProject> => {
  const urls = projectUrls(project);

  const rawBranches = await gitlabQuery<Branch>(urls.branches, accessToken);
  const branches = await Promise.all(rawBranches.map(async (b: Branch) => {
    const branch = b as AugmentedBranch;
    branch.status = undefined;
    branch.pipelines = await gitlabQuery(urls.pipelines, accessToken, `ref=${encodeURI(branch.name)}&sort=desc&per_page=1`);
    if (branch.pipelines.length > 0) {
      branch.status = branch.pipelines[0].status;
    }
    return branch;
  }));

  const augmentedProject = project as AugmentedProject;

  augmentedProject.branches = branches;
  augmentedProject.schedules = await gitlabQuery<PipelineSchedule>(urls.pipelinesSchedules, accessToken);
  augmentedProject.status = undefined;
  augmentedProject.pipelines = await gitlabQuery<Pipeline>(urls.pipelines, accessToken, 'sort=desc&per_page=10');
  if (augmentedProject.pipelines.length > 0) {
    augmentedProject.status = augmentedProject.pipelines[0].status.replace('waiting_for_resource', 'pending');
  }

  return augmentedProject;
};

/**
 * Get the weight of a specific pipeline status.
 * This is used for sorting the list of projects.
 *
 * @param status Status of the last pipeline run.
 * @returns Weight of the given status.
 */
const statusWeight = (status?: string): number => {
  switch (status) {
    case 'created':
      return 5;
    case 'waiting_for_resource':
      return 6;
    case 'preparing':
      return 7;
    case 'pending':
      return 8;
    case 'running':
      return 10;
    case 'success':
      return 9;
    case 'failed':
      return 11;
    case 'canceled':
      return 4;
    case 'skipped':
      return 3;
    case 'manual':
      return 1;
    case 'scheduled':
      return 2;
  }

  return 0;
}

/**
 * Get a list of GitLab projects.
 *
 * @param accessToken AccessToken to query GitLab API.
 * @param tags Tags to filter projects.
 * @returns List of GitLab projects.
 */
export const getProjects = async (accessToken: string, tags: string[]): Promise<AugmentedProject[]> => {
  const projects = await gitlabQuery<Project>('/v4/projects', accessToken);
  const filteredProjects = filterProjectsByTags(projects, tags);
  const projectsWithBranches = await Promise.all(filteredProjects.map(async (project: Project) => await addAddtionalProjectFields(accessToken, project)));
  const sortedProjects = projectsWithBranches.sort((a, b) => {
    const weight = statusWeight(b.status) - statusWeight(a.status);
    if (weight !== 0) {
      return weight;
    }

    const aLastPipelineRun = a.pipelines.length > 0 ? (new Date(a.pipelines[0].created_at)).getTime() : 0;
    const bLastPipelineRun = b.pipelines.length > 0 ? (new Date(b.pipelines[0].created_at)).getTime() : 0;

    return bLastPipelineRun - aLastPipelineRun;
  });
  return sortedProjects;
};
