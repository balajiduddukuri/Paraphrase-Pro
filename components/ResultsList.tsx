import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Mail, Filter } from 'lucide-react';
import { ParaphraseOption, EmailDraft } from '../types';
import EmailModal from './EmailModal';
import { generateEmailDraft } from '../services/geminiService';
import { triggerHaptic, focusClasses } from '../utils/ui';

interface ResultsListProps {
  results: ParaphraseOption[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  
  // Email Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [currentEmailData, setCurrentEmailData] = useState<EmailDraft | null>(null);
  const [currentTone, setCurrentTone] = useState<string>('');

  const tones = useMemo(() => {
    const allTones = results.map(r => r.tone);
    return ['All', ...Array.from(new Set(allTones))];
  }, [results]);

  const filteredResults = useMemo(() => {
    if (selectedFilter === 'All') return results;
    return results.filter(r => r.tone === selectedFilter);
  }, [results, selectedFilter]);

  const handleCopy = (text: string, index: number) => {
    triggerHaptic();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateEmail = async (message: string, tone: string) => {
    triggerHaptic();
    setIsModalOpen(true);
    setIsEmailLoading(true);
    setCurrentTone(tone);
    setCurrentEmailData(null);

    try {
      const data = await generateEmailDraft(message, tone);
      setCurrentEmailData(data);
    } catch (error) {
      console.error("Failed to generate email", error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleFilterClick = (tone: string) => {
    triggerHaptic();
    setSelectedFilter(tone);
  };

  if (results.length === 0) return null;

  return (
    <>
      <section aria-labelledby="results-heading" className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="results-heading" className="text-xl font-bold text-body tracking-tight">
              Generated Variations
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide" role="tablist" aria-label="Filter tones">
            <Filter className="w-4 h-4 text-muted flex-shrink-0 mr-1" aria-hidden="true" />
            {tones.map((tone) => (
              <button
                key={tone}
                role="tab"
                aria-selected={selectedFilter === tone}
                aria-controls="results-grid"
                onClick={() => handleFilterClick(tone)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${focusClasses} 
                  ${selectedFilter === tone 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-panel border border-border text-muted hover:text-body hover:border-primary/50'
                  }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
        
        {/* NFT-Style Card Grid */}
        <ul id="results-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5" role="list">
          {filteredResults.map((item, index) => {
            const originalIndex = results.indexOf(item);
            const lowerTone = item.tone.toLowerCase();
            
            // Dynamic styles based on tone for that "Art Fusion" feel
            let badgeStyle = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
            if (lowerTone.includes('professional')) badgeStyle = "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-800";
            else if (lowerTone.includes('diplomatic')) badgeStyle = "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-200 dark:border-purple-800";
            else if (lowerTone.includes('direct')) badgeStyle = "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200 dark:border-amber-800";
            else if (lowerTone.includes('persuasive')) badgeStyle = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800";
            else if (lowerTone.includes('social') || lowerTone.includes('twitter') || lowerTone.includes('linkedin')) badgeStyle = "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200 border-pink-200 dark:border-pink-800";
            else if (lowerTone.includes('motivational') || lowerTone.includes('inspiring')) badgeStyle = "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200 border-orange-200 dark:border-orange-800";

            return (
              <li key={originalIndex} className="group h-full" style={{ animationDelay: `${index * 75}ms` }}>
                <article className="h-full flex flex-col bg-panel rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                   {/* Top decorative accent */}
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${badgeStyle}`}>
                      {item.tone}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100">
                         {/* Actions visible on hover/focus for cleaner initial look */}
                         <button
                            onClick={() => handleGenerateEmail(item.message, item.tone)}
                            className={`p-1.5 text-muted hover:text-primary rounded-md hover:bg-app transition-colors ${focusClasses}`}
                            title="Draft Email"
                            aria-label={`Draft email for ${item.tone} variation`}
                        >
                            <Mail className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleCopy(item.message, originalIndex)}
                            className={`p-1.5 text-muted hover:text-primary rounded-md hover:bg-app transition-colors ${focusClasses}`}
                            title="Copy text"
                            aria-label={`Copy ${item.tone} variation to clipboard`}
                        >
                            {copiedIndex === originalIndex ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <p className="text-body text-[15px] leading-7 flex-grow font-medium tracking-wide whitespace-pre-line">
                    {item.message}
                  </p>

                  {/* Mobile-only visible actions (since hover doesn't work well on touch) */}
                  <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between sm:hidden">
                    <button
                        onClick={() => handleGenerateEmail(item.message, item.tone)}
                        className="text-xs font-semibold text-primary flex items-center gap-1 active:scale-95 transition-transform"
                    >
                        <Mail className="w-3.5 h-3.5" /> Draft Email
                    </button>
                    <button
                        onClick={() => handleCopy(item.message, originalIndex)}
                        className="text-xs font-semibold text-muted flex items-center gap-1 active:scale-95 transition-transform"
                    >
                         {copiedIndex === originalIndex ? (
                             <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copied</span>
                         ) : (
                             <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy</span>
                         )}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <EmailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isEmailLoading}
        emailData={currentEmailData}
        tone={currentTone}
      />
    </>
  );
};

export default ResultsList;