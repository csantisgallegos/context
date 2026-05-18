import * as path from 'path';

export const SCHEMAS_DIR = path.resolve(__dirname);

export const SCHEMA_PATHS = {
  project: path.join(SCHEMAS_DIR, 'project.schema.json'),
  task: path.join(SCHEMAS_DIR, 'task.schema.json'),
  agent: path.join(SCHEMAS_DIR, 'agent.schema.json'),
  signal: path.join(SCHEMAS_DIR, 'signal.schema.json'),
} as const;

export type SchemaName = keyof typeof SCHEMA_PATHS;

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  version?: string;
  language?: 'es' | 'en';
  domain?: string;
  agents?: string[];
}

export interface ContextTask {
  id: string;
  title: string;
  created?: string;
  status: 'active' | 'paused' | 'blocked';
  context?: {
    why?: string;
    background?: string;
  };
  scope: {
    can_modify?: string[];
    cannot_modify?: string[];
    must_ask_before?: string[];
  };
  steps?: string[];
  done_when: string[];
  completedAt?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: 'developer' | 'reviewer' | 'architect' | 'security-auditor' | 'qa-engineer' | 'devops' | 'doc-writer';
  capabilities: Array<'read-code' | 'write-code' | 'run-tests' | 'run-commands' | 'read-docs' | 'write-docs' | 'security-review' | 'architecture-review'>;
  scope?: {
    file_patterns?: string[];
    excluded_patterns?: string[];
  };
  restrictions: string[];
  instructions?: string;
}

export interface SignalFile {
  generatedAt: string;
  source: string;
  type?: string;
  data: Record<string, unknown>;
}
