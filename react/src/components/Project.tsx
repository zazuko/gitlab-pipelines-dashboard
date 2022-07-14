import { FC } from "react";

type Props = {
  project: any;
}

const Project: FC<Props> = ({ project }) => {

  return <div>
    <p>{ project.name_with_namespace }</p>
    <p>{ project.description && `${project.description} - ` }<a href={ project.web_url } target="_blank" rel="noopener noreferrer">Open project on GitLab</a></p>

    <p></p>
    {JSON.stringify(project)}
  </div>
};

export default Project;
