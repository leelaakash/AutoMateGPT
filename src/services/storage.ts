import { WorkflowResult, AppSettings } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'automate_gpt_history',
  SETTINGS: 'automate_gpt_settings'
};

export const saveResult = (result: WorkflowResult): void => {
  const history = getHistory();
  history.unshift(result);
  
  // Keep only last 50 results
  const trimmedHistory = history.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmedHistory));
};

export const getHistory = (): WorkflowResult[] => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000
    };
  } catch {
    return {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000
    };
  }
};

export const exportHistory = (): void => {
  const history = getHistory();
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `automate-gpt-history-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};