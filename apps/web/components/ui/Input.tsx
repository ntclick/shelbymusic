'use client'

import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

export function Input({ label, error, helpText, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-brand-white">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg bg-bg-panel border text-brand-white placeholder-brand-text text-sm',
          'focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange',
          'transition-colors duration-150',
          error ? 'border-red-500' : 'border-bg-border',
          className
        )}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-400">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-xs text-brand-text">
          {helpText}
        </p>
      )}
    </div>
  )
}
