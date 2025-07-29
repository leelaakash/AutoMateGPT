import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { WorkflowCard } from './WorkflowCard';
import { SettingsModal } from './SettingsModal';
import { HistoryModal } from './HistoryModal';
import { WORKFLOW_TEMPLATES } from '../config/workflows';
import { generateResponse } from '../services/openai';
import { generateHuggingFaceResponse } from '../services/huggingface';
import { saveResult, getHistory, clearHistory, exportHistory, saveSettings, getSettings } from '../services/storage';
import { signOut } from '../services/auth';
import { WorkflowResult, AppSettings, User } from '../types';

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(WORKFLOW_TEMPLATES[0].id);
  const [settings, setSettings] = useState<AppSettings>({
    ...getSettings(),
    apiKey: 'sk-proj-configured'
  });
  const [history, setHistory] = useState<WorkflowResult[]>(getHistory());
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const currentWorkflow = WORKFLOW_TEMPLATES.find(w => w.id === selectedWorkflow)!;

  const handleGenerate = async (input: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prompt = currentWorkflow.prompt.replace('{input}', input);
      
      // Use Hugging Face API as primary, fallback to OpenAI
      let content: string;
      let tokens: number;
      
      try {
        const hfResponse = await generateHuggingFaceResponse(prompt, settings.maxTokens);
        content = hfResponse.content;
        tokens = hfResponse.tokens;
      } catch (hfError) {
        console.warn('Hugging Face API failed, falling back to OpenAI:', hfError);
        const openaiResponse = await generateResponse(prompt, settings.model, settings.maxTokens);
        content = openaiResponse.content;
        tokens = openaiResponse.tokens;
      }
      
      setResult(content);

      const workflowResult: WorkflowResult = {
        id: Date.now().toString(),
        workflowId: selectedWorkflow,
        input,
        output: content,
        timestamp: Date.now(),
        tokens
      };

      saveResult(workflowResult);
      setHistory(getHistory());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleSelectResult = (workflowResult: WorkflowResult) => {
    setSelectedWorkflow(workflowResult.workflowId);
    setResult(workflowResult.output);
    setError(null);
  };

  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    setResult(null);
    setError(null);
  };

  const handleSignOut = () => {
    signOut();
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar
        selectedWorkflow={selectedWorkflow}
        onWorkflowSelect={handleWorkflowSelect}
        onShowSettings={() => setShowSettings(true)}
        onShowHistory={() => setShowHistory(true)}
        onClearHistory={handleClearHistory}
        onExportHistory={exportHistory}
        hasApiKey={!!settings.apiKey}
        user={user}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {currentWorkflow.emoji} {currentWorkflow.title}
                </h1>
                <p className="text-gray-300">{currentWorkflow.description}</p>
              </div>
              <div className="text-right text-sm text-gray-400">
                <div>Welcome, {user.name}</div>
                <div>Model: {settings.model}</div>
                <div>Max Tokens: {settings.maxTokens}</div>
                <div>History: {history.length} items</div>
              </div>
            </div>
          </div>

          <WorkflowCard
            workflow={currentWorkflow}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            result={result}
            error={error}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelectResult={handleSelectResult}
      />
    </div>
  );
};