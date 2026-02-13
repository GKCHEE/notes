
import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, RefreshCcw } from 'lucide-react';
import { GenerationResult } from '../types';

interface SqlOutputProps {
  result: GenerationResult | null;
  loading: boolean;
  onRetry: () => void;
}

const SqlOutput: React.FC<SqlOutputProps> = ({ result, loading, onRetry }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.sql) {
      navigator.clipboard.writeText(result.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-zinc-500">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <DatabaseIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" />
        </div>
        <p className="mt-6 font-medium animate-pulse">Architecting database schema...</p>
        <p className="text-sm mt-1">Applying RLS policies & storage rules</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-zinc-500 bg-zinc-900/50 rounded-xl border-2 border-dashed border-zinc-800">
        <Terminal size={48} className="mb-4 opacity-20" />
        <p>Your generated SQL will appear here.</p>
        <p className="text-xs mt-2 opacity-50">Enter a prompt to begin architecting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded border border-indigo-500/20 font-bold uppercase tracking-wider">
            PostgreSQL Output
          </span>
          <span className="text-zinc-500 text-xs flex items-center gap-1">
            <ShieldIcon className="w-3 h-3" /> RLS Enabled
          </span>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={onRetry}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Regenerate"
            >
                <RefreshCcw size={18} />
            </button>
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm transition-all active:scale-95"
            >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy SQL'}
            </button>
        </div>
      </div>

      <div className="relative group">
        <pre className="mono p-6 bg-black rounded-xl border border-zinc-800 overflow-x-auto text-sm leading-relaxed max-h-[600px] custom-scrollbar">
          <code className="text-indigo-200">
            {result.sql}
          </code>
        </pre>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded border border-zinc-800 hover:text-white transition-colors">
                Run in Supabase <ExternalLink size={10} />
            </a>
        </div>
      </div>

      {result.explanation && (
        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-indigo-300 mb-1 flex items-center gap-2">
            Architect's Notes
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export default SqlOutput;
