/**
 * Input Component
 * Standardized input field with label and error states
 */

import React from 'react';

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  type = 'text',
  min,
  max,
  disabled,
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = [
    'px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed',
    error ? 'border-red-500' : 'border-gray-300',
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        min={min}
        max={max}
        disabled={disabled}
        className={inputClasses}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export interface TextAreaProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  rows?: number;
  disabled?: boolean;
}

export function TextArea({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  rows,
  disabled,
}: TextAreaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const textareaClasses = [
    'px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed resize-vertical',
    error ? 'border-red-500' : 'border-gray-300',
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
