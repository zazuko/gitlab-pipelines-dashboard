export type Project = {
  id: number;
  description: string;
  name_with_namespace: string;
  default_branch: string;
  topics: string[];
  web_url: string;
};

export type AugmentedProject = Project & {
  status?: string;
  pipelines: Pipeline[];
  branches: AugmentedBranch[];
  schedules: PipelineSchedule[];
};

export type Branch = {
  name: string;
  default: boolean;
  web_url: string;
};

export type AugmentedBranch = Branch & {
  status?: string;
  pipelines: Pipeline[];
};

export type PipelineStatus = "created"
  | "waiting_for_resource"
  | "preparing"
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "canceled"
  | "skipped"
  | "manual"
  | "scheduled";

export type Pipeline = {
  id: number;
  iid: number;
  project_id: number;
  ref: string;
  status: PipelineStatus;
  source: string;
  web_url: string;
};

export type PipelineSchedule = {
  id: number;
  description: string;
  ref: string;
  cron: string;
  cron_timezone: string;
  next_run_at: string;
  active: boolean;
};
