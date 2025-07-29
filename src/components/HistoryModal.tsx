import React from 'react';
import { X, History as HistoryIcon, Clock, FileText } from 'lucide-react';
import { WorkflowResult } from '../types';
import { WORKFLOW_TEMPLATES } from '../config/workflows';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: WorkflowResult[];
  onSelectResult: (result: WorkflowResult) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult
}) => {
  if (!isOpen) return null;

  const getWorkflowTemplate = (workflowId: string) => {
    return WORKFLOW_TEMPLATES.find(w => w.id === workflowId);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl m-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <HistoryIcon className="w-5 h-5 mr-2 text-gray-300" />
            <h2 className="text-xl font-semibold text-white">History</h2>
            <span className="ml-3 px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
              {history.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No workflow results yet</p>
              <p className="text-gray-500 text-sm mt-2">Generate some content to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((result) => {
                const workflow = getWorkflowTemplate(result.workflowId);
                return (
                  <div
                    key={result.id}
                    className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => {
                      onSelectResult(result);
                      onClose();
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{workflow?.emoji}</span>
                        <div>
                          <h3 className="font-medium text-white">{workflow?.title}</h3>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(result.timestamp)}
                            {result.tokens && (
                              <span className="ml-4">{result.tokens} tokens</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      <strong>Input:</strong> {result.input.substring(0, 150)}
                      {result.input.length > 150 && '...'}
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      <strong>Output:</strong> {result.output.substring(0, 200)}
                      {result.output.length > 200 && '...'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};