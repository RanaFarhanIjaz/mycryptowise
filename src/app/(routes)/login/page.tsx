'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogIn, Loader, Mail, Phone, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FormInput, FormCheckbox, FormErrorSummary } from '@/components/auth/FormInput'
import { validateLoginForm } from '@/lib/auth/validation'
import { LoginFormData, ValidationError } from '@/types'
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [apiError, setApiError] = useState<string>('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
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
      toast.success('Signed in with Google!')
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

    // Validate form using BVA testing rules
    const validationResult = validateLoginForm(formData)
    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      return
    }

    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      toast.success('Successfully signed in!')
      router.push('/dashboard')
    } catch (error: any) {
      setApiError(error.message || 'An error occurred during login. Please try again.')
      console.error('Login error:', error)
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
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl dark:bg-slate-900">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Sign In to CryptoWise</CardTitle>
            <CardDescription>
              Access your crypto predictions and trading insights
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.length > 0 && <FormErrorSummary errors={errors} />}
            {apiError && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                {apiError}
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
                />

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
                  autoComplete="current-password"
                  showPasswordToggle
                  minLength={8}
                />

                <div className="flex items-center justify-between">
                  <FormCheckbox
                    id="rememberMe"
                    name="rememberMe"
                    label="Remember me"
                    checked={formData.rememberMe || false}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
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
                  Or continue with
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
                  Don't have an account?
                </span>
              </div>
            </div>

            <Link href="/register">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </Link>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Having trouble signing in?{' '}
          <Link
            href="/support"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Contact support
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
