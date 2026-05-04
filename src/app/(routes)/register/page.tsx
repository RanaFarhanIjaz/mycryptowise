'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserPlus, Loader, Mail, Phone, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FormInput, FormCheckbox, FormErrorSummary, PasswordStrengthMeter } from '@/components/auth/FormInput'
import { validateSignUpForm } from '@/lib/auth/validation'
import { SignUpFormData, ValidationError } from '@/types'
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'react-hot-toast'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [apiError, setApiError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
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
    if (name === 'phoneNumber') {
      setPhoneNumber(value)
      return
    }
    if (name === 'verificationCode') {
      setVerificationCode(value)
      return
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear errors for this field when user starts typing
    setErrors(prev => prev.filter(err => err.field !== name))
    setApiError('')
    setSuccessMessage('')
  }

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log('recaptcha resolved')
        }
      })
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setApiError('')
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast.success('Account created with Google!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Google Sign-In Error:', error)
      setApiError(error.message || 'Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setApiError('')

    try {
      if (!confirmationResult) {
        setupRecaptcha()
        const appVerifier = (window as any).recaptchaVerifier
        const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        setConfirmationResult(result)
        toast.success('Verification code sent!')
      } else {
        await confirmationResult.confirm(verificationCode)
        toast.success('Phone verified successfully!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Phone Sign-In Error:', error)
      setApiError(error.message || 'Failed to sign in with phone')
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear()
        delete (window as any).recaptchaVerifier
      }
    } finally {
      setIsLoading(false)
    }
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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      
      // Update profile with username/name if possible
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`.trim() || formData.username
      })

      setSuccessMessage('Account created successfully! Redirecting to login...')
      toast.success('Account created!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      setApiError(error.message || 'An error occurred during registration. Please try again.')
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

            <div className="flex gap-2 mb-6">
              <Button 
                variant={loginMethod === 'email' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setLoginMethod('email')}
              >
                <Mail className="w-4 h-4 mr-2" /> Email
              </Button>
              <Button 
                variant={loginMethod === 'phone' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setLoginMethod('phone')}
              >
                <Phone className="w-4 h-4 mr-2" /> Phone
              </Button>
            </div>

            {loginMethod === 'email' ? (
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
            ) : (
              <form onSubmit={handlePhoneSignIn} className="space-y-4">
                {!confirmationResult ? (
                  <FormInput
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    label="Phone Number"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                ) : (
                  <FormInput
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    label="Verification Code"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                )}
                <div id="recaptcha-container"></div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {confirmationResult ? 'Verify Code' : 'Send Code'}
                    </>
                  )}
                </Button>
                {confirmationResult && (
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setConfirmationResult(null)}
                    disabled={isLoading}
                  >
                    Change Number
                  </Button>
                )}
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-gray-500">
                  Or join with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mb-4"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>

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
