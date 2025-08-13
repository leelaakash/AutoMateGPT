export interface WorkflowTemplate {
  id: string;
  title: string;
  emoji: string;
  description: string;
  placeholder: string;
  prompt: string;
}

export interface WorkflowResult {
  id: string;
  workflowId: string;
  input: string;
  output: string;
  timestamp: number;
  tokens?: number;
}

export interface AppSettings {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  signedInAt: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}