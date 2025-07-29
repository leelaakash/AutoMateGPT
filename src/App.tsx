import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WorkflowCard } from './components/WorkflowCard';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { WORKFLOW_TEMPLATES } from './config/workflows';
import { initializeOpenAI, generateResponse } from './services/openai';
import { saveResult, getHistory, clearHistory, exportHistory, saveSettings, getSettings } from './services/storage';
import { WorkflowResult, AppSettings } from './types';

function App() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(WORKFLOW_TEMPLATES[0].id);
  const [settings, setSettings] = useState<AppSettings>({
    ...getSettings(),
    apiKey: 'sk-proj-configured' // Pre-configured API key indicator
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
      const { content, tokens } = await generateResponse(prompt, settings.model, settings.maxTokens);
      
      setResult(content);

      // Save to history
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
}

export default App;