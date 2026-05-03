'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserPlus, Loader } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FormInput, FormCheckbox, FormErrorSummary, PasswordStrengthMeter } from '@/components/auth/FormInput'
import { validateSignUpForm } from '@/lib/auth/validation'
import { SignUpFormData, ValidationError } from '@/types'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [apiError, setApiError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    termsAccepted: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear errors for this field when user starts typing
    setErrors(prev => prev.filter(err => err.field !== name))
    setApiError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setApiError('')
    setSuccessMessage('')

    // Validate form using BVA testing rules
    const validationResult = validateSignUpForm(formData)
    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      return
    }

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate successful registration
      console.log('Registration attempt:', {
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      
      setSuccessMessage('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setApiError('An error occurred during registration. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-xl dark:bg-slate-900">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Create CryptoWise Account</CardTitle>
            <CardDescription>
              Join thousands of crypto traders using AI-powered predictions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.length > 0 && <FormErrorSummary errors={errors} />}
            {apiError && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
                {apiError}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="firstName"
                  name="firstName"
                  type="text"
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  error={errors.find(err => err.field === 'firstName')?.message}
                  disabled={isLoading}
                  autoComplete="given-name"
                  maxLength={50}
                />
                <FormInput
                  id="lastName"
                  name="lastName"
                  type="text"
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  error={errors.find(err => err.field === 'lastName')?.message}
                  disabled={isLoading}
                  autoComplete="family-name"
                  maxLength={50}
                />
              </div>

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.find(err => err.field === 'email')?.message}
                required
                disabled={isLoading}
                autoComplete="email"
                maxLength={254}
              />

              <FormInput
                id="username"
                name="username"
                type="text"
                label="Username"
                placeholder="cryptotrader_2024"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.find(err => err.field === 'username')?.message}
                required
                disabled={isLoading}
                autoComplete="username"
                maxLength={32}
                minLength={3}
              />

              <div className="space-y-2">
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.find(err => err.field === 'password')?.message}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  showPasswordToggle
                  minLength={8}
                  maxLength={128}
                />
                <PasswordStrengthMeter password={formData.password} />
              </div>

              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.find(err => err.field === 'confirmPassword')?.message}
                required
                disabled={isLoading}
                autoComplete="new-password"
                showPasswordToggle
                minLength={8}
                maxLength={128}
              />

              <FormCheckbox
                id="termsAccepted"
                name="termsAccepted"
                label={
                  <>
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </>
                }
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                error={errors.find(err => err.field === 'termsAccepted')?.message}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link href="/login">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                Sign In
              </Button>
            </Link>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              We respect your privacy. Check our{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Privacy Policy
              </Link>
              {' '}to learn how we protect your data.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
