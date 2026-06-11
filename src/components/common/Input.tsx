import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, required, disabled, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              error ? 'text-red-600' : 'text-slate-700',
              disabled && 'text-slate-400',
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200',
              'placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-slate-800/20',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 shake'
                : 'border-slate-200 focus:border-slate-400',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              disabled && 'cursor-not-allowed bg-slate-50 text-slate-400',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, required, disabled, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              error ? 'text-red-600' : 'text-slate-700',
              disabled && 'text-slate-400',
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 resize-y',
            'placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-slate-800/20',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-slate-400',
            disabled && 'cursor-not-allowed bg-slate-50 text-slate-400',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, required, disabled, options, placeholder, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              error ? 'text-red-600' : 'text-slate-700',
              disabled && 'text-slate-400',
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'block w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 shadow-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-slate-800/20',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-slate-400',
              disabled && 'cursor-not-allowed bg-slate-50 text-slate-400',
              !props.value && placeholder && 'text-slate-400',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
