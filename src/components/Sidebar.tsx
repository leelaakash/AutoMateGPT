import React from 'react';
import { Settings, History, Trash2, Download, Key, LogOut, User } from 'lucide-react';
import { WORKFLOW_TEMPLATES } from '../config/workflows';
import { User as UserType } from '../types';

interface SidebarProps {
  selectedWorkflow: string;
  onWorkflowSelect: (workflowId: string) => void;
  onShowSettings: () => void;
  onShowHistory: () => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
  hasApiKey?: boolean;
  user?: UserType;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedWorkflow,
  onWorkflowSelect,
  onShowSettings,
  onShowHistory,
  onClearHistory,
  onExportHistory,
  hasApiKey = true,
  user,
  onSignOut,
}) => {
  return (
    <div className="w-80 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-sm border-r border-purple-500/20 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg mr-3 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">AutoMateGPT</h1>
            <p className="text-purple-200 text-sm">AI Workflow Assistant</p>
          </div>
        </div>
        
        {user && (
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/40 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-blue-200 text-sm">
              <User className="w-4 h-4 mr-2" />
              <span>{user.name}</span>
            </div>
          </div>
        )}
        
        {hasApiKey && (
          <div className="mt-3 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-green-200 text-sm">
              <Key className="w-4 h-4 mr-2" />
              <span>AI models configured</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 bg-gradient-to-b from-transparent to-purple-900/10">
        <h3 className="text-sm font-semibold text-purple-300 mb-4 uppercase tracking-wide flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Workflows
        </h3>
        <div className="space-y-2">
          {WORKFLOW_TEMPLATES.map((workflow) => (
            <button
              key={workflow.id}
              onClick={() => onWorkflowSelect(workflow.id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedWorkflow === workflow.id
                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-400/50 text-purple-200 shadow-lg shadow-purple-500/20'
                  : 'hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 text-gray-300 border border-transparent hover:border-gray-600/30'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  selectedWorkflow === workflow.id 
                    ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30' 
                    : 'bg-gray-700/50'
                }`}>
                  <span className="text-lg">{workflow.emoji}</span>
                </div>
                <div>
                  <div className="font-medium text-sm">{workflow.title}</div>
                  <div className={`text-xs mt-1 ${
                    selectedWorkflow === workflow.id ? 'text-purple-300/80' : 'text-gray-400'
                  }`}>{workflow.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-purple-500/20 space-y-2 bg-gradient-to-r from-gray-900/50 to-black/50">
        <button
          onClick={onShowSettings}
          className="w-full flex items-center p-3 text-gray-300 hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-300 hover:text-white border border-transparent hover:border-indigo-400/30"
        >
          <Settings className="w-4 h-4 mr-3" />
          <span className="text-sm">Settings</span>
        </button>
        
        <button
          onClick={onShowHistory}
          className="w-full flex items-center p-3 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 rounded-xl transition-all duration-300 hover:text-white border border-transparent hover:border-blue-400/30"
        >
          <History className="w-4 h-4 mr-3" />
          <span className="text-sm">History</span>
        </button>
        
        <button
          onClick={onExportHistory}
          className="w-full flex items-center p-3 text-gray-300 hover:bg-gradient-to-r hover:from-green-600/20 hover:to-emerald-600/20 rounded-xl transition-all duration-300 hover:text-white border border-transparent hover:border-green-400/30"
        >
          <Download className="w-4 h-4 mr-3" />
          <span className="text-sm">Export History</span>
        </button>
        
        <button
          onClick={onClearHistory}
          className="w-full flex items-center p-3 text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 rounded-xl transition-all duration-300 hover:text-red-300 border border-transparent hover:border-red-400/30"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          <span className="text-sm">Clear History</span>
        </button>
        
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="w-full flex items-center p-3 text-gray-300 hover:bg-gradient-to-r hover:from-gray-600/20 hover:to-gray-700/20 rounded-xl transition-all duration-300 hover:text-white border-t border-purple-500/20 mt-2 pt-4 border border-transparent hover:border-gray-400/30"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};