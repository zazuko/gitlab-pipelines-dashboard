export type Schedule = {
  id: string;
  cron: string;
  nextRunAt: string;
  active: boolean;
  description: string;
  ref: string;
}

export type Actor = {
  name: string;
}

export type Namespace = {
  fullName: string;
  description: string;
};

export type Pipeline = {
  createdAt: string;
  duration: number;
  id: string;
  status: PipelineStatus;
  user: Actor;
}

export type Project = {
  id: string;
  webUrl: string;
  name: string;
  visibility: string;
  avatarUrl: string;
  description: string;
  tagList: string;
  namespace: Namespace;
  createdAt: string;
  pipelines: {
    nodes: Pipeline[];
  };
}

export type MappedProject = Project & {
  isOpen: boolean;
  lastPipeline?: Pipeline;
  tags: string[];
}

export type Query = {
  projects: {
    nodes: Project[];
  };
}

export enum PipelineStatus {
  Created = 'CREATED',
  WaitingForResource = 'WAITING_FOR_RESOURCE',
  Preparing = 'PREPARING',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Failed = 'FAILED',
  Success = 'SUCCESS',
  Canceled = 'CANCELED',
  Skipped = 'SKIPPED',
  Manual = 'MANUAL',
  Scheduled = 'SCHEDULED',
}
