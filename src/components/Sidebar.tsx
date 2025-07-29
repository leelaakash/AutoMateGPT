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
    <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-2">AutoMateGPT</h1>
        <p className="text-gray-300 text-sm">AI Workflow Assistant</p>
        
        {user && (
          <div className="mt-3 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
            <div className="flex items-center text-blue-300 text-sm">
              <User className="w-4 h-4 mr-2" />
              <span>{user.name}</span>
            </div>
          </div>
        )}
        
        {hasApiKey && (
          <div className="mt-3 p-3 bg-green-900/20 border border-green-600 rounded-lg">
            <div className="flex items-center text-green-300 text-sm">
              <Key className="w-4 h-4 mr-2" />
              <span>AI models configured</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
          Workflows
        </h3>
        <div className="space-y-2">
          {WORKFLOW_TEMPLATES.map((workflow) => (
            <button
              key={workflow.id}
              onClick={() => onWorkflowSelect(workflow.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedWorkflow === workflow.id
                  ? 'bg-blue-900/30 border border-blue-600 text-blue-300'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">{workflow.emoji}</span>
                <div>
                  <div className="font-medium text-sm">{workflow.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{workflow.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={onShowSettings}
          className="w-full flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 mr-3" />
          <span className="text-sm">Settings</span>
        </button>
        
        <button
          onClick={onShowHistory}
          className="w-full flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <History className="w-4 h-4 mr-3" />
          <span className="text-sm">History</span>
        </button>
        
        <button
          onClick={onExportHistory}
          className="w-full flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 mr-3" />
          <span className="text-sm">Export History</span>
        </button>
        
        <button
          onClick={onClearHistory}
          className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          <span className="text-sm">Clear History</span>
        </button>
        
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="w-full flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors border-t border-gray-700 mt-2 pt-4"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};