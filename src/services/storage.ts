import { WorkflowResult, AppSettings, User } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'automate_gpt_history',
  SETTINGS: 'automate_gpt_settings',
  USER_SESSIONS: 'automate_gpt_user_sessions'
};

// Enhanced history management with user-specific storage
export const saveResult = (result: WorkflowResult, userId?: string): void => {
  try {
    const history = getHistory(userId);
    
    // Truncate large content to prevent quota issues
    const truncateContent = (content: string, maxLength: number = 10000): string => {
      if (content.length <= maxLength) return content;
      return content.substring(0, maxLength) + '... [truncated]';
    };
    
    // Add metadata
    const enhancedResult = {
      ...result,
      input: truncateContent(result.input || ''),
      output: truncateContent(result.output || ''),
      userId: userId || 'anonymous',
      createdAt: new Date().toISOString(),
      sessionId: getSessionId()
    };
    
    history.unshift(enhancedResult);
    
    // Keep only last 50 results per user to reduce storage usage
    const trimmedHistory = history.slice(0, 50);
    
    const storageKey = userId ? `${STORAGE_KEYS.HISTORY}_${userId}` : STORAGE_KEYS.HISTORY;
    
    // Try to save with additional error handling
    try {
      localStorage.setItem(storageKey, JSON.stringify(trimmedHistory));
      // Also save to a global backup for data persistence
      saveToGlobalBackup(enhancedResult);
    } catch (quotaError) {
      // If still quota exceeded, clear old data and try again
      if (quotaError.name === 'QuotaExceededError') {
        // Keep only last 20 results and try again
        const minimalHistory = history.slice(0, 20);
        localStorage.setItem(storageKey, JSON.stringify(minimalHistory));
        console.warn('Storage quota exceeded. Reduced history to 20 items.');
      } else {
        throw quotaError;
      }
    }
    
  } catch (error) {
    console.error('Failed to save result:', error);
  }
};

export const getHistory = (userId?: string): WorkflowResult[] => {
  try {
    const storageKey = userId ? `${STORAGE_KEYS.HISTORY}_${userId}` : STORAGE_KEYS.HISTORY;
    const history = localStorage.getItem(storageKey);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
};

export const clearHistory = (userId?: string): void => {
  try {
    const storageKey = userId ? `${STORAGE_KEYS.HISTORY}_${userId}` : STORAGE_KEYS.HISTORY;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const saveSettings = (settings: AppSettings, userId?: string): void => {
  try {
    const storageKey = userId ? `${STORAGE_KEYS.SETTINGS}_${userId}` : STORAGE_KEYS.SETTINGS;
    const enhancedSettings = {
      ...settings,
      lastUpdated: new Date().toISOString(),
      userId: userId || 'anonymous'
    };
    localStorage.setItem(storageKey, JSON.stringify(enhancedSettings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const getSettings = (userId?: string): AppSettings => {
  try {
    const storageKey = userId ? `${STORAGE_KEYS.SETTINGS}_${userId}` : STORAGE_KEYS.SETTINGS;
    const settings = localStorage.getItem(storageKey);
    const defaultSettings = {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000
    };
    
    return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000
    };
  }
};

export const exportHistory = (userId?: string): void => {
  try {
    const history = getHistory(userId);
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: userId || 'anonymous',
      totalResults: history.length,
      results: history
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automate-gpt-history-${userId || 'anonymous'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export history:', error);
  }
};

// Session management
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('automate_gpt_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('automate_gpt_session', sessionId);
  }
  return sessionId;
};

// Global backup system for data persistence
const saveToGlobalBackup = (result: WorkflowResult): void => {
  try {
    const backupKey = 'automate_gpt_global_backup';
    const backup = JSON.parse(localStorage.getItem(backupKey) || '[]');
    backup.unshift(result);
    
    // Keep only last 500 results globally
    const trimmedBackup = backup.slice(0, 500);
    localStorage.setItem(backupKey, JSON.stringify(trimmedBackup));
  } catch (error) {
    console.error('Failed to save global backup:', error);
  }
};

// Analytics and usage tracking
export const getUsageStats = (userId?: string): any => {
  try {
    const history = getHistory(userId);
    const workflowCounts: { [key: string]: number } = {};
    let totalTokens = 0;
    
    history.forEach(result => {
      workflowCounts[result.workflowId] = (workflowCounts[result.workflowId] || 0) + 1;
      totalTokens += result.tokens || 0;
    });
    
    return {
      totalResults: history.length,
      workflowCounts,
      totalTokens,
      averageTokensPerResult: history.length > 0 ? Math.round(totalTokens / history.length) : 0,
      lastUsed: history.length > 0 ? history[0].timestamp : null
    };
  } catch (error) {
    console.error('Failed to get usage stats:', error);
    return {
      totalResults: 0,
      workflowCounts: {},
      totalTokens: 0,
      averageTokensPerResult: 0,
      lastUsed: null
    };
  }
};

// Data migration and cleanup
export const migrateUserData = (oldUserId: string, newUserId: string): void => {
  try {
    const oldHistory = getHistory(oldUserId);
    const oldSettings = getSettings(oldUserId);
    
    if (oldHistory.length > 0) {
      // Migrate history
      oldHistory.forEach(result => {
        result.userId = newUserId;
      });
      localStorage.setItem(`${STORAGE_KEYS.HISTORY}_${newUserId}`, JSON.stringify(oldHistory));
      localStorage.removeItem(`${STORAGE_KEYS.HISTORY}_${oldUserId}`);
    }
    
    // Migrate settings
    saveSettings(oldSettings, newUserId);
    localStorage.removeItem(`${STORAGE_KEYS.SETTINGS}_${oldUserId}`);
    
  } catch (error) {
    console.error('Failed to migrate user data:', error);
  }
};