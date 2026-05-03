import { LoginFormData, SignUpFormData, FormValidationResult, ValidationError } from '@/types'

// Validation rules for BVA (Boundary Value Analysis) Testing
export const VALIDATION_RULES = {
  email: {
    minLength: 5,
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessages: {
      required: 'Email is required',
      invalid: 'Please enter a valid email address',
      tooLong: 'Email must be less than 254 characters',
      tooShort: 'Email must be at least 5 characters'
    }
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    errorMessages: {
      required: 'Password is required',
      tooShort: 'Password must be at least 8 characters',
      tooLong: 'Password must be less than 128 characters',
      weak: 'Password must contain uppercase, lowercase, number, and special character',
      mismatch: 'Passwords do not match'
    }
  },
  username: {
    minLength: 3,
    maxLength: 32,
    pattern: /^[a-zA-Z0-9_-]+$/,
    errorMessages: {
      required: 'Username is required',
      tooShort: 'Username must be at least 3 characters',
      tooLong: 'Username must be less than 32 characters',
      invalid: 'Username can only contain letters, numbers, hyphens, and underscores'
    }
  },
  firstName: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    errorMessages: {
      invalid: 'First name can only contain letters, spaces, hyphens, and apostrophes',
      tooLong: 'First name must be less than 50 characters'
    }
  },
  lastName: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    errorMessages: {
      invalid: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      tooLong: 'Last name must be less than 50 characters'
    }
  }
}

// Email validation with comprehensive checks
export function validateEmail(email: string): FormValidationResult {
  const errors: ValidationError[] = []

  if (!email || email.trim() === '') {
    errors.push({
      field: 'email',
      message: VALIDATION_RULES.email.errorMessages.required,
      code: 'REQUIRED'
    })
    return { isValid: false, errors }
  }

  // Boundary value testing: length checks
  if (email.length < VALIDATION_RULES.email.minLength) {
    errors.push({
      field: 'email',
      message: VALIDATION_RULES.email.errorMessages.tooShort,
      code: 'TOO_SHORT'
    })
  }

  if (email.length > VALIDATION_RULES.email.maxLength) {
    errors.push({
      field: 'email',
      message: VALIDATION_RULES.email.errorMessages.tooLong,
      code: 'TOO_LONG'
    })
  }

  // Format validation
  if (!VALIDATION_RULES.email.pattern.test(email)) {
    errors.push({
      field: 'email',
      message: VALIDATION_RULES.email.errorMessages.invalid,
      code: 'INVALID_FORMAT'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Password validation with strength requirements
export function validatePassword(password: string): FormValidationResult {
  const errors: ValidationError[] = []

  if (!password || password.trim() === '') {
    errors.push({
      field: 'password',
      message: VALIDATION_RULES.password.errorMessages.required,
      code: 'REQUIRED'
    })
    return { isValid: false, errors }
  }

  // Boundary value testing: length checks
  if (password.length < VALIDATION_RULES.password.minLength) {
    errors.push({
      field: 'password',
      message: VALIDATION_RULES.password.errorMessages.tooShort,
      code: 'TOO_SHORT'
    })
  }

  if (password.length > VALIDATION_RULES.password.maxLength) {
    errors.push({
      field: 'password',
      message: VALIDATION_RULES.password.errorMessages.tooLong,
      code: 'TOO_LONG'
    })
  }

  // Strength requirements
  if (!VALIDATION_RULES.password.pattern.test(password)) {
    errors.push({
      field: 'password',
      message: VALIDATION_RULES.password.errorMessages.weak,
      code: 'WEAK_PASSWORD'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Username validation
export function validateUsername(username: string): FormValidationResult {
  const errors: ValidationError[] = []

  if (!username || username.trim() === '') {
    errors.push({
      field: 'username',
      message: VALIDATION_RULES.username.errorMessages.required,
      code: 'REQUIRED'
    })
    return { isValid: false, errors }
  }

  if (username.length < VALIDATION_RULES.username.minLength) {
    errors.push({
      field: 'username',
      message: VALIDATION_RULES.username.errorMessages.tooShort,
      code: 'TOO_SHORT'
    })
  }

  if (username.length > VALIDATION_RULES.username.maxLength) {
    errors.push({
      field: 'username',
      message: VALIDATION_RULES.username.errorMessages.tooLong,
      code: 'TOO_LONG'
    })
  }

  if (!VALIDATION_RULES.username.pattern.test(username)) {
    errors.push({
      field: 'username',
      message: VALIDATION_RULES.username.errorMessages.invalid,
      code: 'INVALID_FORMAT'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Name validation
export function validateName(name: string, fieldName: 'firstName' | 'lastName'): FormValidationResult {
  const errors: ValidationError[] = []
  const rules = VALIDATION_RULES[fieldName]

  if (!name || name.trim() === '') {
    return { isValid: true, errors }
  }

  if (name.length > rules.maxLength) {
    errors.push({
      field: fieldName,
      message: rules.errorMessages.tooLong,
      code: 'TOO_LONG'
    })
  }

  if (!rules.pattern.test(name)) {
    errors.push({
      field: fieldName,
      message: rules.errorMessages.invalid,
      code: 'INVALID_FORMAT'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Password confirmation validation
export function validatePasswordMatch(password: string, confirmPassword: string): FormValidationResult {
  const errors: ValidationError[] = []

  if (password !== confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: VALIDATION_RULES.password.errorMessages.mismatch,
      code: 'MISMATCH'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Complete login form validation
export function validateLoginForm(formData: LoginFormData): FormValidationResult {
  const errors: ValidationError[] = []

  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors)
  }

  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Complete sign-up form validation
export function validateSignUpForm(formData: SignUpFormData): FormValidationResult {
  const errors: ValidationError[] = []

  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors)
  }

  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.isValid) {
    errors.push(...usernameValidation.errors)
  }

  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors)
  }

  const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword)
  if (!passwordMatchValidation.isValid) {
    errors.push(...passwordMatchValidation.errors)
  }

  if (formData.firstName) {
    const firstNameValidation = validateName(formData.firstName, 'firstName')
    if (!firstNameValidation.isValid) {
      errors.push(...firstNameValidation.errors)
    }
  }

  if (formData.lastName) {
    const lastNameValidation = validateName(formData.lastName, 'lastName')
    if (!lastNameValidation.isValid) {
      errors.push(...lastNameValidation.errors)
    }
  }

  if (!formData.termsAccepted) {
    errors.push({
      field: 'termsAccepted',
      message: 'You must accept the terms and conditions',
      code: 'REQUIRED'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Get error message for a specific field
export function getFieldError(errors: ValidationError[], fieldName: string): string | null {
  const error = errors.find(err => err.field === fieldName)
  return error ? error.message : null
}

// Check if field has error
export function hasFieldError(errors: ValidationError[], fieldName: string): boolean {
  return errors.some(err => err.field === fieldName)
}
