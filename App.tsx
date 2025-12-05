import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsList from './components/ResultsList';
import { generateParaphrasedOptions } from './services/geminiService';
import { ParaphraseOption, LoadingState } from './types';
import { AlertTriangle } from 'lucide-react';
import { focusClasses } from './utils/ui';

/**
 * Main Application Component
 * Orchestrates the flow between input, AI generation, and results display.
 */
const App: React.FC = () => {
  const [results, setResults] = useState<ParaphraseOption[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the request to generate paraphrased options.
   * @param message The original text input by the user.
   */
  const handleGenerate = async (message: string) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResults([]);

    try {
      const data = await generateParaphrasedOptions(message);
      setResults(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setLoadingState(LoadingState.ERROR);
      setError(err.message || "Failed to generate paraphrases. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-app transition-colors duration-500 flex flex-col font-sans">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded-md shadow-lg ${focusClasses}`}
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <InputSection 
          onGenerate={handleGenerate} 
          loadingState={loadingState} 
        />

        <div aria-live="polite" className="mt-8">
          {error && (
            <div 
              role="alert" 
              className="mb-8 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-fade-in"
            >
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                  <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Generation Failed</h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          <ResultsList results={results} />
        </div>
      </main>
      
      <footer className="w-full max-w-4xl mx-auto px-4 py-8 mt-auto text-center border-t border-border/40" role="contentinfo">
        <div className="text-xs text-muted flex flex-col gap-2 items-center">
           <p>Powered by <span className="font-semibold text-body">Gemini 2.5 Flash</span> • Data Source: AI Generated</p>
           <p className="font-medium text-primary opacity-90">Author: BalajiDuddukuri</p>
        </div>
      </footer>
    </div>
  );
};

export default App;