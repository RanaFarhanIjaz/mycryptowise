// Authentication utilities

/**
 * Hash a password (client-side hashing - should also hash server-side)
 * @param password - The password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Generate a secure random token
 * @param length - Length of the token
 * @returns A random token
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Check if email is already registered (mock implementation)
 * @param email - Email to check
 * @returns Promise resolving to true if email exists
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/check-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // })
    // return response.json()
    return false
  } catch (error) {
    console.error('Error checking email:', error)
    return false
  }
}

/**
 * Check if username is already taken (mock implementation)
 * @param username - Username to check
 * @returns Promise resolving to true if username exists
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/check-username', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username }),
    // })
    // return response.json()
    return false
  } catch (error) {
    console.error('Error checking username:', error)
    return false
  }
}

/**
 * Login user with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise with user data and token
 */
export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with user data and token
 */
export async function registerUser(userData: {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
}) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }

    const data = await response.json()
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

/**
 * Logout user
 */
export function logoutUser() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
}

/**
 * Get stored auth token
 * @returns Auth token or null
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

/**
 * Get stored user data
 * @returns User object or null
 */
export function getStoredUser() {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

/**
 * Check if user is authenticated
 * @returns True if user has valid auth token
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

/**
 * Verify password reset token
 * @param token - Password reset token
 * @returns Promise resolving to token validity
 */
export async function verifyPasswordResetToken(token: string): Promise<boolean> {
  try {
    // TODO: Replace with actual API call
    return true
  } catch (error) {
    console.error('Error verifying token:', error)
    return false
  }
}

/**
 * Request password reset
 * @param email - User email
 * @returns Promise
 */
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    throw error
  }
}

/**
 * Reset password with token
 * @param token - Password reset token
 * @param newPassword - New password
 * @returns Promise
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    })
  } catch (error) {
    console.error('Password reset error:', error)
    throw error
  }
}

/**
 * Enable two-factor authentication
 * @returns Promise with setup instructions
 */
export async function setupTwoFactor() {
  try {
    const response = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('2FA setup failed')
    }

    return await response.json()
  } catch (error) {
    console.error('2FA setup error:', error)
    throw error
  }
}

/**
 * Verify two-factor authentication code
 * @param code - 6-digit 2FA code
 * @returns Promise
 */
export async function verify2FACode(code: string): Promise<void> {
  try {
    const response = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error('2FA verification failed')
    }
  } catch (error) {
    console.error('2FA verification error:', error)
    throw error
  }
}
