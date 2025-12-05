import React, { useState } from 'react';
import { Wand2, AlertCircle } from 'lucide-react';
import { LoadingState } from '../types';
import { triggerHaptic, focusClasses } from '../utils/ui';

interface InputSectionProps {
  onGenerate: (message: string) => void;
  loadingState: LoadingState;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, loadingState }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      triggerHaptic();
      onGenerate(input);
    }
  };

  const isGenerating = loadingState === LoadingState.LOADING;

  return (
    <section aria-labelledby="input-heading" className="bg-panel rounded-2xl shadow-sm border border-border p-6 transition-colors duration-300">
      <h2 id="input-heading" className="sr-only">Input Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="message" className="block text-sm font-semibold text-body mb-2 transition-colors duration-300">
            Original Message
          </label>
          <div className="relative">
            <textarea
                id="message"
                rows={4}
                className={`block w-full rounded-xl border-border bg-input p-4 text-body shadow-sm text-base leading-relaxed resize-none border transition-all duration-300 placeholder:text-muted/60 ${focusClasses}`}
                placeholder="e.g., The discounted rates are still on the higher side..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isGenerating}
                aria-required="true"
                aria-describedby="input-hint"
            />
          </div>
          <p id="input-hint" className="mt-2 text-xs text-muted">
            Enter the text you want to paraphrase. The AI will generate multiple variations.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted" role="note">
                <AlertCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>AI results may vary. Always review before sending.</span>
            </div>
            <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className={`inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-all ${focusClasses}
                ${!input.trim() || isGenerating 
                    ? 'bg-muted cursor-not-allowed opacity-50 shadow-none' 
                    : 'bg-primary hover:bg-primary-hover hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0'
                }`}
                aria-busy={isGenerating}
            >
                {isGenerating ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                </>
                ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Paraphrase</span>
                </>
                )}
            </button>
        </div>
      </form>
    </section>
  );
};

export default InputSection;