import { FC, useState } from "react";
import cronstrue from "cronstrue";
import { AugmentedBranch, AugmentedProject, Pipeline, PipelineSchedule } from "../lib/gitlabTypes";

type Props = {
  project: AugmentedProject;
}

const Project: FC<Props> = ({ project }) => {
  const [open, setOpen] = useState<boolean>(false);

  const openStatusClass = open ? 'open' : 'close';
  const arrow = open ? '▲' : '▼';

  let reversedPipelines: Pipeline[] = [];
  reversedPipelines = reversedPipelines.concat(project.pipelines).reverse();

  return <div className={`project-item ${openStatusClass}`}>
    <div className="project-title" onClick={() => setOpen(!open)}>
      <div className="project-title-left"><p>{ project.name_with_namespace }</p></div>
      <div className="project-title-right">
        { reversedPipelines.map((p: Pipeline) => <span className={ `pipeline-dot badge-${p.status}` } title={p.ref} key={p.id}>{ `${p.ref}`.charAt(0).toLocaleUpperCase() }</span>)}
        <span className={ `badge badge-${project.status}` }>{ project.status }</span>
        { arrow }
      </div>
    </div>
    <div className="project-details">
      <p>{ project.description && `${project.description} - ` }<a href={ project.web_url } target="_blank" rel="noopener noreferrer">Open project on GitLab</a></p>

      <p>Branches:</p>
      <ul>
        { project.branches.map((branch: AugmentedBranch) => {
          const branchStatus = `branch-${branch.status || 'unknown'}`;
          const branchLink = <a href={ `${project.web_url}/-/tree/${encodeURI(branch.name)}` } target="_blank" rel="noopener noreferrer">{ branch.default ? <strong>{ branch.name }</strong> : branch.name }</a>;
          return <li key={branch.name} className={branchStatus}>{ branchLink }</li>;
        })}
      </ul>

      { project.schedules.length > 0 && <>
        <p>Schedules:</p>
        <ul>
          { project.schedules.map((schedule: PipelineSchedule) => {
            const cronString = cronstrue.toString(schedule.cron, { use24HourTimeFormat: true });
            return <li key={schedule.id}>
                <p><strong>{ schedule.description }</strong> (ref: <a href={ `${project.web_url}/-/tree/${encodeURI(schedule.ref)}` } target="_blank" rel="noopener noreferrer">{ schedule.ref }</a>)</p>
                <p>Runs: <abbr title={schedule.cron}>{ cronString }</abbr> ({ schedule.cron_timezone } timezone)</p>
              </li>
          })}
        </ul>
      </>}

    </div>
  </div>
};

export default Project;
