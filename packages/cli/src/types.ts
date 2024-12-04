export interface Spinner {
  start: (message: string) => void
  stop: (message: string) => void
}

export interface FrontendOption {
  value: string
  label: string
  hint?: string
}

export type FrontendOptionResponse = string

export interface CloneProjectOption {
  label: string
  value: any
}

export interface CloneProjectOptionResponse {
  label: string
  createdAt: string
}

export type ProjectIdentifier = {
  projectSlug?: string;
  projectId?: string;
}
