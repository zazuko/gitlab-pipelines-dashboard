import gitlabQuery from "./gitlabQuery";
import { AugmentedBranch, AugmentedProject, Branch, Pipeline, PipelineSchedule, Project } from "./gitlabTypes";

const projectUrls = (project: Project) => {
  const base = `/v4/projects/${project.id}`;
  return {
    project: `${base}`,
    branches: `${base}/repository/branches`,
    pipelines: `${base}/pipelines`,
    pipelinesSchedules: `${base}/pipeline_schedules`,
  }
};

const filterProjectsByTags = (projects: Project[], tags: string[]): Project[] => {
  if (tags.length === 0) {
    return projects;
  }
  return projects.filter((project: Project) => tags.some(tag => project.topics.includes(tag)));
};

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

export const getProjects = async (accessToken: string, tags: string[]): Promise<AugmentedProject[]> => {
  const projects = await gitlabQuery<Project>('/v4/projects', accessToken);
  const filteredProjects = filterProjectsByTags(projects, tags);
  const projectsWithBranches = await Promise.all(filteredProjects.map(async (project: Project) => await addAddtionalProjectFields(accessToken, project)));
  const sortedProjects = projectsWithBranches.sort((a, b) => {
    return statusWeight(b.status) - statusWeight(a.status);
  });
  return sortedProjects;
};
