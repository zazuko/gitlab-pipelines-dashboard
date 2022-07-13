import { useOidcUser, OidcUserStatus, useOidcAccessToken } from '@axa-fr/react-oidc';
import { useQuery } from 'react-query';
import gitlabQuery from '../lib/gitlabQuery';

const Projects = () => {
  const { accessToken } = useOidcAccessToken();
  const { oidcUserLoadingState } = useOidcUser();

  const isLoggedIn = accessToken && oidcUserLoadingState === OidcUserStatus.Loaded;

  const projects = useQuery<any, Error>('gitlab-projects', () => gitlabQuery('/v4/projects', accessToken));
  if (!isLoggedIn) {
    return <div className="container"><p>You are not logged in. Try to refresh the page.</p></div>
  }

  if (projects.isLoading) {
    return <div className="container"><p>Projects are loading…</p></div>
  }

  if (projects.isSuccess) {
    return <ul>{projects.data.map((project: any, i: number) => <li key={i}>{ project.name_with_namespace }</li>)}</ul>
  }

  return <div className="container">
    <p>List of all projects:</p>
  </div>
};

export default Projects;
