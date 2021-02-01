export interface Schedule {
  id: string
  cron: string
  nextRunAt: string
  active: boolean
  description: string
  ref: string
}

export interface PipelineRest {
  id: number;
  ref: string;
  status: string;
}

export interface Actor {
  name: string
}

export interface Namespace {
  fullName: string
  fullPath: string
  description: string
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

export interface Pipeline {
  createdAt: string
  duration: number
  id: string
  status: PipelineStatus
  user: Actor
}

export type PipelineWithRest = Pipeline & {
  rest?: PipelineRest
}

export interface Project {
  id: string
  webUrl: string
  name: string
  visibility: string
  avatarUrl: string
  description: string
  tagList: string
  fullPath: string
  namespace: Namespace
  createdAt: string
  pipelines: {
    nodes: Pipeline[]
  }
}

export type MappedProject = Project & {
  isOpen: boolean
  lastPipeline?: Pipeline
  tags: string[]
}

export interface Query {
  projects: {
    nodes: Project[]
  }
}
