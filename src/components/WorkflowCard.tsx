import React, { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, Copy, Check, Download, FileText, Sparkles } from 'lucide-react';
import { WorkflowTemplate } from '../types';
import { readFileAsText, validateFile } from '../utils/fileReader';

interface WorkflowCardProps {
  workflow: WorkflowTemplate;
  input: string;
  onInputChange: (input: string) => void;
  onGenerate: (input: string) => Promise<void>;
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  input,
  onInputChange,
  onGenerate,
  isLoading,
  result,
  error
}) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsProcessingFile(true);
    try {
      const text = await readFileAsText(file);
      // Add file info to the extracted text
      const fileInfo = `[File: ${file.name} (${(file.size / 1024).toFixed(1)}KB)]\n\n${text}`;
      onInputChange(fileInfo);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to read file');
    } finally {
      setIsProcessingFile(false);
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
    <div className="bg-gradient-to-br from-slate-800/80 via-blue-900/60 to-indigo-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-400/30 overflow-hidden relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 pointer-events-none"></div>
      
      <div className="relative p-6 border-b border-blue-400/30">
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 p-4 rounded-xl mr-4 border border-cyan-400/40 shadow-lg">
            <span className="text-4xl filter drop-shadow-lg">{workflow.emoji}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">{workflow.title}</h2>
            <p className="text-blue-200 text-sm mt-1">{workflow.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={workflow.placeholder}
              className="w-full h-32 p-4 border border-blue-400/40 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 placeholder-blue-300/60 shadow-inner"
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
                  disabled={isProcessingFile}
                  className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:text-white transition-all duration-300 rounded-lg border border-cyan-400/30 hover:border-cyan-400/60 backdrop-blur-sm disabled:opacity-50"
                >
                  {isProcessingFile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File (.txt, .pdf, .csv)
                    </>
                  )}
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
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105"
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
        <div className="relative p-4 bg-gradient-to-r from-red-900/40 to-pink-900/40 backdrop-blur-sm border-l-4 border-red-400 rounded-r-xl">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="relative p-6 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-emerald-400" />
              Generated Result
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-3 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 hover:text-white transition-all duration-300 rounded-lg border border-blue-400/40 hover:border-blue-400/70 backdrop-blur-sm"
                title="Copy to clipboard"
              >
                {copiedToClipboard ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={downloadResult}
                className="p-3 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-300 hover:text-white transition-all duration-300 rounded-lg border border-emerald-400/40 hover:border-emerald-400/70 backdrop-blur-sm"
                title="Download as text file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-sm rounded-xl border border-emerald-400/30 shadow-inner">
            <pre className="whitespace-pre-wrap text-sm text-emerald-100 font-sans leading-relaxed">
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};