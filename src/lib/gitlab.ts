import gitlabQuery from "./gitlabQuery";

const projectUrls = (project: any) => {
  const base = `/v4/projects/${project.id}`;
  return {
    project: `${base}`,
    branches: `${base}/repository/branches`,
    pipelines: `${base}/pipelines`,
    pipelinesSchedules: `${base}/pipeline_schedules`,
  }
};

const filterProjectsByTags = (projects: any, tags: string[]) => {
  if (tags.length === 0) {
    return projects;
  }
  return projects.filter((project: any) => tags.every(tag => project.topics.includes(tag)));
};

const addAddtionalProjectFields = async (accessToken: string, project: any): Promise<{}> => {
  const urls = projectUrls(project);

  const rawBranches = await gitlabQuery(urls.branches, accessToken) as any[];
  const branches = await Promise.all(rawBranches.map(async (branch: any) => {
    branch.status = undefined;
    branch.pipelines = await gitlabQuery(urls.pipelines, accessToken, `ref=${encodeURI(branch.name)}&sort=desc&per_page=1`);
    if (branch.pipelines.length > 0) {
      branch.status = branch.pipelines[0].status;
    }
    return branch;
  }));

  project.branches = branches;
  project.schedules = await gitlabQuery(urls.pipelinesSchedules, accessToken);
  project.status = undefined;
  project.pipelines = await gitlabQuery(urls.pipelines, accessToken, 'sort=desc&per_page=10');
  if (project.pipelines.length > 0) {
    project.status = project.pipelines[0].status.replace('waiting_for_resource', 'pending');
  }

  return project;
};

const statusWeight = (status: string): number => {
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

export const getProjects = async (accessToken: string, tags: string[]): Promise<{}> => {
  const projects = await gitlabQuery('/v4/projects', accessToken);
  const filteredProjects = filterProjectsByTags(projects, tags);
  const projectsWithBranches = await Promise.all(filteredProjects.map(async (project: any) => await addAddtionalProjectFields(accessToken, project)));
  const sortedProjects = projectsWithBranches.sort((a, b) => {
    return statusWeight(b.status) - statusWeight(a.status);
  });
  return sortedProjects;
};
