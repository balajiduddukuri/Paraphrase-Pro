import React, { useState } from 'react';
import { X, Copy, Check, Mail } from 'lucide-react';
import { EmailDraft } from '../types';
import { triggerHaptic, focusClasses } from '../utils/ui';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  emailData: EmailDraft | null;
  tone: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, isLoading, emailData, tone }) => {
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: 'subject' | 'body') => {
    triggerHaptic();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-panel rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-border flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-app/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 id="modal-title" className="font-semibold text-body">Email Draft</h3>
              <p className="text-xs text-muted">Tone: <span className="text-primary">{tone}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full text-muted hover:text-body hover:bg-app transition-colors ${focusClasses}`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4" aria-live="polite">
              <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-muted font-medium">Drafting your email...</p>
            </div>
          ) : emailData ? (
            <div className="space-y-6">
              {/* Subject Line */}
              <div className="space-y-2">
                <label htmlFor="email-subject" className="text-xs font-semibold text-muted uppercase tracking-wide">Subject</label>
                <div className="group relative">
                  <input
                    id="email-subject"
                    readOnly
                    value={emailData.subject}
                    className={`w-full bg-input border border-border text-body text-sm rounded-lg p-3 pr-10 transition-colors ${focusClasses}`}
                  />
                  <button
                    onClick={() => handleCopy(emailData.subject, 'subject')}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-primary rounded-md transition-colors ${focusClasses}`}
                    title="Copy subject"
                    aria-label="Copy subject"
                  >
                    {copiedField === 'subject' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <label htmlFor="email-body" className="text-xs font-semibold text-muted uppercase tracking-wide">Body</label>
                <div className="group relative">
                  <textarea
                    id="email-body"
                    readOnly
                    value={emailData.body}
                    rows={10}
                    className={`w-full bg-input border border-border text-body text-sm rounded-lg p-4 pr-10 resize-none leading-relaxed transition-colors ${focusClasses}`}
                  />
                  <button
                    onClick={() => handleCopy(emailData.body, 'body')}
                    className={`absolute right-2 top-2 p-1.5 text-muted hover:text-primary rounded-md transition-colors ${focusClasses}`}
                    title="Copy body"
                    aria-label="Copy body"
                  >
                    {copiedField === 'body' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted">
              Failed to load email draft.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-app/50 border-t border-border flex justify-end shrink-0">
            <button
                onClick={onClose}
                className={`px-4 py-2 bg-panel border border-border text-body font-medium rounded-lg hover:bg-app transition-colors ${focusClasses}`}
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;