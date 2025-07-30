import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, TrendingUp, Award } from 'lucide-react';
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
  const [workflowInputs, setWorkflowInputs] = useState<Record<string, string>>({});
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
        console.log('Attempting Hugging Face API call...');
        const hfResponse = await generateHuggingFaceResponse(prompt, settings.maxTokens);
        content = hfResponse.content;
        tokens = hfResponse.tokens;
        console.log('Hugging Face API success:', content.substring(0, 100) + '...');
      } catch (hfError) {
        console.warn('Hugging Face API failed, trying OpenAI fallback:', hfError);
        try {
          const openaiResponse = await generateResponse(prompt, settings.model, settings.maxTokens);
          content = openaiResponse.content;
          tokens = openaiResponse.tokens;
          console.log('OpenAI API success:', content.substring(0, 100) + '...');
        } catch (openaiError) {
          console.error('Both APIs failed:', openaiError);
          throw new Error('Both AI services are currently unavailable. Please try again later.');
        }
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

  const handleInputChange = (workflowId: string, input: string) => {
    setWorkflowInputs(prev => ({
      ...prev,
      [workflowId]: input
    }));
  };

  const handleSignOut = () => {
    signOut();
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
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

      <div className="flex-1 p-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 relative">
            <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl mr-4 shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-1">
                        Welcome back, {user.name}!
                      </h1>
                      <p className="text-purple-200 text-lg">Ready to automate your workflow?</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="flex space-x-4">
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 text-center min-w-[100px]">
                    <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-300">{history.length}</div>
                    <div className="text-xs text-green-200">Workflows</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-orange-400/30 text-center min-w-[100px]">
                    <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-300">{settings.maxTokens}</div>
                    <div className="text-xs text-orange-200">Max Tokens</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 text-center min-w-[100px]">
                    <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-300">{settings.model.includes('4') ? 'GPT-4' : 'GPT-3.5'}</div>
                    <div className="text-xs text-blue-200">AI Model</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Workflow Header */}
          <div className="mb-6 relative">
            <div className="bg-gradient-to-r from-indigo-800/40 to-purple-800/40 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-5xl mr-4 filter drop-shadow-lg">
                    {currentWorkflow.emoji}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-2">
                      {currentWorkflow.title}
                    </h2>
                    <p className="text-indigo-200 text-lg">{currentWorkflow.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30">
                    <div className="text-sm text-purple-200 mb-1">Active Workflow</div>
                    <div className="text-lg font-semibold text-purple-100">{currentWorkflow.title}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legacy content for reference - will be replaced by new design above */}
          <div className="hidden">
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
            input={workflowInputs[selectedWorkflow] || ''}
            onInputChange={(input) => handleInputChange(selectedWorkflow, input)}
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