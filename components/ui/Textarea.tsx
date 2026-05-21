import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-secondary)] font-medium"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`px-4 py-3 border bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-[16px] font-sans focus:outline-none transition-colors resize-none ${
            error
              ? 'border-[var(--accent-bordeaux)] focus:border-[var(--accent-bordeaux)]'
              : 'border-[var(--border)] focus:border-[var(--text-primary)]'
          } ${className}`}
          style={{ borderRadius: 0 }}
          {...props}
        />
        {error && (
          <p className="font-mono text-[13px] text-[var(--accent-bordeaux)]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';