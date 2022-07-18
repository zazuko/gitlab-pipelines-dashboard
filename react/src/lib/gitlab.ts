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
    branch.pipelines = await gitlabQuery(urls.pipelines, accessToken, `ref=${encodeURI(branch.name)}&sort=desc&per_page=1`);
    return branch;
  }));

  project.branches = branches;
  project.schedules = await gitlabQuery(urls.pipelinesSchedules, accessToken);

  return project;
};

export const getProjects = async (accessToken: string, tags = ['monitoring']): Promise<{}> => {
  const projects = await gitlabQuery('/v4/projects', accessToken);
  const filteredProjects = filterProjectsByTags(projects, tags);
  const projectsWithBranches = await Promise.all(filteredProjects.map(async (project: any) => await addAddtionalProjectFields(accessToken, project)));
  return projectsWithBranches;
};
