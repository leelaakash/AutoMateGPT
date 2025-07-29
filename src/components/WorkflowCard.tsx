import React, { useState, useRef } from 'react';
import { Upload, Loader2, Copy, Check, Download, FileText } from 'lucide-react';
import { WorkflowTemplate } from '../types';
import { readFileAsText, validateFile } from '../utils/fileReader';

interface WorkflowCardProps {
  workflow: WorkflowTemplate;
  onGenerate: (input: string) => Promise<void>;
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onGenerate,
  isLoading,
  result,
  error
}) => {
  const [input, setInput] = useState('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const text = await readFileAsText(file);
      setInput(text);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to read file');
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) return;
    onGenerate(input);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.id}-result-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center mb-3">
          <span className="text-3xl mr-4">{workflow.emoji}</span>
          <div>
            <h2 className="text-xl font-semibold text-white">{workflow.title}</h2>
            <p className="text-gray-300 text-sm mt-1">{workflow.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={workflow.placeholder}
              className="w-full h-32 p-4 border border-gray-600 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
            
            {workflow.id === 'summarizer' && (
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File (.txt or .pdf)
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {input.length} characters
            </div>
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border-l-4 border-red-500">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-white">Result</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedToClipboard ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={downloadResult}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                title="Download as text file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-600">
            <pre className="whitespace-pre-wrap text-sm text-gray-200 font-sans">
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};