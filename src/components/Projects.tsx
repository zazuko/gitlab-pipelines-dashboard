import { useState } from 'react';
import { useOidcUser, OidcUserStatus, useOidcAccessToken } from '@axa-fr/react-oidc';
import env from '@ludovicm67/react-dotenv';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../lib/gitlab';
import { AugmentedProject } from '../lib/gitlabTypes';
import Project from './Project';

const Projects = () => {
  const [ filter, setFilter ] = useState<string>('');
  const { accessToken } = useOidcAccessToken();
  const { oidcUserLoadingState } = useOidcUser();
  const selectedTags = `${env.SELECTED_TAGS}`.split(',').map(tag => tag.trim());

  const isLoggedIn = accessToken && oidcUserLoadingState === OidcUserStatus.Loaded;

  const projects = useQuery<AugmentedProject[], Error>(['gitlab-projects'], () => getProjects(accessToken, selectedTags), {
    refetchInterval: 120000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    refetchOnReconnect: true,
  });

  let filteredProjects = projects.data ?? [];
  if (filter) {
    filteredProjects = filteredProjects.filter((project: AugmentedProject) => {
      return `${project.name_with_namespace}`.toLocaleLowerCase().includes(filter);
    });
  }

  if (!isLoggedIn) {
    return <div className="container"><p>You are not logged in. Try to refresh the page.</p></div>
  }

  if (projects.isLoading) {
    return <div className="container"><p>Projects are loading…</p></div>
  }

  if (projects.isSuccess) {
    return <div className="container">
      <div className="projects-filter">
        <input type="text" placeholder="Filter projects by name…" onChange={(e) => setFilter(e.target.value.toLocaleLowerCase())} value={filter} />
      </div>
      {filteredProjects.map((project: AugmentedProject, i: number) => {
        return <Project key={i} project={project} />
      })}
    </div>
  }

  return <div className="container">
    <p>There was an issue while fetching projects…</p>
  </div>
};

export default Projects;
