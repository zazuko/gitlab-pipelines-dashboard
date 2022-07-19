import { FC, useState } from "react";

type Props = {
  project: any;
}

const Project: FC<Props> = ({ project }) => {
  const [open, setOpen] = useState<boolean>(false);

  const openStatusClass = open ? 'open' : 'close';
  const arrow = open ? '▲' : '▼';

  const reversedPipelines = [].concat(project.pipelines).reverse();

  return <div className={`project-item ${openStatusClass}`} onClick={() => setOpen(!open)}>
    <div className="project-title">
      <div className="project-title-left"><p>{ project.name_with_namespace }</p></div>
      <div className="project-title-right">
        { reversedPipelines.map((p: any, i: number) => <span className={ `pipeline-dot badge-${p.status}` } title={p.ref} key={i}>{ `${p.ref}`.charAt(0).toLocaleUpperCase() }</span>)}
        <span className={ `badge badge-${project.status}` }>{ project.status }</span>
        { arrow }
      </div>
    </div>
    <div className="project-details">
      <p>{ project.description && `${project.description} - ` }<a href={ project.web_url } target="_blank" rel="noopener noreferrer">Open project on GitLab</a></p>

      <p>Branches:</p>
      <ul>
        { project.branches.map((branch: any) => {
          const branchStatus = `branch-${branch.status || 'unknown'}`;
          const branchLink = <a href={ `${project.web_url}/-/tree/${encodeURI(branch.name)}` } target="_blank" rel="noopener noreferrer">{ branch.default ? <strong>{ branch.name }</strong> : branch.name }</a>;
          return <li key={branch.name} className={branchStatus}>{ branchLink }</li>;
        })}
      </ul>

      <p>Schedules:</p>
      <ul>
        { project.schedules.map((schedule: any, i: number) => {
          return <li key={i}>
              <ul>
                <li><strong>{ schedule.description }</strong></li>
                <li>Ref: { schedule.ref }</li>
                <li>Cron: { schedule.cron }</li>
              </ul>
            </li>
        })}
      </ul>
    </div>
  </div>
};

export default Project;
