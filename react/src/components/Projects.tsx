import { useOidcUser, OidcUserStatus, useOidcAccessToken } from '@axa-fr/react-oidc';
import { useQuery } from 'react-query';
import { getProjects } from '../lib/gitlab';
import Project from './Project';

const Projects = () => {
  const { accessToken } = useOidcAccessToken();
  const { oidcUserLoadingState } = useOidcUser();

  const isLoggedIn = accessToken && oidcUserLoadingState === OidcUserStatus.Loaded;

  const projects = useQuery<any, Error>('gitlab-projects', () => getProjects(accessToken, ['monitoring']));
  if (!isLoggedIn) {
    return <div className="container"><p>You are not logged in. Try to refresh the page.</p></div>
  }

  if (projects.isLoading) {
    return <div className="container"><p>Projects are loading…</p></div>
  }

  if (projects.isSuccess) {
    return <div className="container"><ul>{projects.data.map((project: any, i: number) => {
      return <Project key={i} project={project} />
    })}</ul></div>
  }

  return <div className="container">
    <p>There was an issue while fetching projects…</p>
  </div>
};

export default Projects;
