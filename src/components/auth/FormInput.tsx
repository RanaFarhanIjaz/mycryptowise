'use client'

import React, { useState, ChangeEvent, FocusEvent } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { ValidationError } from '@/types'

interface FormInputProps {
  id: string
  name?: string
  type?: string
  label: string
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  showPasswordToggle?: boolean
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      name,
      type = 'text',
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      autoComplete,
      maxLength,
      minLength,
      pattern,
      showPasswordToggle = false,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            className={`
              w-full px-4 py-2 border rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              dark:bg-gray-800 dark:text-white dark:border-gray-700
              ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }
            `}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {value && !error && type !== 'password' && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

interface FormCheckboxProps {
  id: string
  name?: string
  label: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ id, name, label, checked, onChange, error, required = false, disabled = false }, ref) => (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-5 h-5 rounded border transition-colors
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            cursor-pointer
            ${
              error
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:ring-blue-500/20 checked:bg-blue-600 checked:border-blue-600'
            }
          `}
        />
        <label htmlFor={id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
)

FormCheckbox.displayName = 'FormCheckbox'

interface FormErrorSummaryProps {
  errors: ValidationError[]
  title?: string
}

export const FormErrorSummary = ({ errors, title = 'Please fix the following errors' }: FormErrorSummaryProps) => {
  if (errors.length === 0) return null

  return (
    <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-4">
      <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
        <AlertCircle size={20} />
        {title}
      </h3>
      <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
        {errors.map((error, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-red-500 mt-1">•</span>
            <span>{error.message}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface PasswordStrengthMeterProps {
  password: string
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[@$!%*?&]/.test(pwd)) score++

    if (score <= 1) return { score, label: 'Very Weak', color: 'bg-red-500' }
    if (score <= 2) return { score, label: 'Weak', color: 'bg-orange-500' }
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' }
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' }
    return { score, label: 'Strong', color: 'bg-green-500' }
  }

  if (!password) return null

  const { score, label, color } = getStrength(password)

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? color : 'bg-gray-300 dark:bg-gray-600'}`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${color.replace('bg-', 'text-')}`}>{label}</span>
    </div>
  )
}
