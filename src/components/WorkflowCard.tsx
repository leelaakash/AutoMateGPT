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
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      
      <div className="relative p-6 border-b border-purple-500/20">
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-xl mr-4 border border-purple-400/30 shadow-lg">
            <span className="text-4xl filter drop-shadow-lg">{workflow.emoji}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">{workflow.title}</h2>
            <p className="text-purple-200 text-sm mt-1">{workflow.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={workflow.placeholder}
              className="w-full h-32 p-4 border border-purple-500/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-purple-300/60 shadow-inner"
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
                  className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 hover:text-white transition-all duration-300 rounded-lg border border-indigo-400/30 hover:border-indigo-400/60 backdrop-blur-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File (.txt or .pdf)
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-purple-300/80">
              {input.length} characters
            </div>
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
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
        <div className="relative p-4 bg-gradient-to-r from-red-900/30 to-pink-900/30 backdrop-blur-sm border-l-4 border-red-400 rounded-r-xl">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="relative p-6 bg-gradient-to-br from-green-900/10 to-emerald-900/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-green-400" />
              Generated Result
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 hover:text-white transition-all duration-300 rounded-lg border border-blue-400/30 hover:border-blue-400/60 backdrop-blur-sm"
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
                className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 hover:text-white transition-all duration-300 rounded-lg border border-green-400/30 hover:border-green-400/60 backdrop-blur-sm"
                title="Download as text file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm rounded-xl border border-green-400/20 shadow-inner">
            <pre className="whitespace-pre-wrap text-sm text-green-100 font-sans leading-relaxed">
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};