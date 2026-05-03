# CryptoWise - User Profile, Auth & Bot Management Features

## Overview

This document describes the implementation of user authentication (Login/Sign Up with BVA testing), profile & settings management, transaction history, and bot detail & deployment pages for the CryptoWise platform.

## Features Implemented

### 1. **BVA Testing for Authentication** ✅

Boundary Value Analysis testing has been implemented for all form inputs with strict validation rules:

#### Validation Rules (`src/lib/auth/validation.ts`)

- **Email**: 5-254 characters, must match email pattern
- **Password**: 8-128 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)
- **Username**: 3-32 characters, alphanumeric + hyphen/underscore
- **Names**: 1-50 characters, letters/spaces/hyphens/apostrophes only

#### Validation Functions

```typescript
// Individual field validators
validateEmail(email: string): FormValidationResult
validatePassword(password: string): FormValidationResult
validateUsername(username: string): FormValidationResult
validateName(name: string, fieldName: 'firstName' | 'lastName'): FormValidationResult
validatePasswordMatch(password: string, confirmPassword: string): FormValidationResult

// Complete form validators
validateLoginForm(formData: LoginFormData): FormValidationResult
validateSignUpForm(formData: SignUpFormData): FormValidationResult

// Helper functions
getFieldError(errors: ValidationError[], fieldName: string): string | null
hasFieldError(errors: ValidationError[], fieldName: string): boolean
```

### 2. **Login Page** (`src/app/(routes)/login/page.tsx`) ✅

**Features:**
- Email and password inputs with BVA validation
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Real-time error display
- Form error summary component
- Smooth animations with Framer Motion
- Disabled state during submission
- Link to sign up page

**Form Validation:**
- All BVA rules applied on submit
- Field-level error clearing on user input
- API error handling

### 3. **Sign Up Page** (`src/app/(routes)/register/page.tsx`) ✅

**Features:**
- First name, last name (optional)
- Email input with BVA validation
- Username with availability checking structure
- Password with strength meter visualization
- Confirm password matching
- Terms and conditions acceptance
- Real-time error display
- Success messaging with automatic redirect
- Password strength indicator (Very Weak → Strong)

**Password Strength Meter:**
- Visual 5-bar indicator
- Color-coded levels (red → green)
- Real-time feedback based on:
  - Length (8, 12+ characters)
  - Case variation (upper + lower)
  - Numbers and special characters

### 4. **Transaction History Component** (`src/components/prices/TransactionHistory.tsx`) ✅

**Displayed Fields:**
- Transaction Type (BUY, SELL, BOT)
- Asset (cryptocurrency symbol)
- Date/Time (timestamp breakdown)
- Quantity (amount of crypto)
- Price (unit price at transaction time)
- Total Value (quantity × price)
- Status (completed, pending, failed)

**Features:**
- **Sorting**: Click headers to sort by date, amount, or type
- **Filtering**: Filter by transaction type (ALL, BUY, SELL, BOT)
- **Search**: Real-time search by asset or type
- **Summary Cards**: Total value, buy/sell/bot counts
- **Status Badges**: Color-coded status indicators
- **Export**: Export button hook for CSV/PDF export
- **Pagination**: Shows transaction count info
- **Responsive**: Horizontal scroll on mobile

**Example Usage:**
```typescript
import { TransactionHistory } from '@/components/prices/TransactionHistory'

export default function MyPage() {
  const handleExport = () => {
    // Export logic
  }

  return (
    <TransactionHistory
      transactions={transactionList}
      onExport={handleExport}
      isLoading={false}
    />
  )
}
```

### 5. **User Profile & Settings Page** (`src/app/(routes)/profile/page.tsx`) ✅

#### Profile Tab
- **Personal Information**: First name, last name, username, email
- **Bio**: Short biography
- **Contact**: Phone number, country, timezone
- **Avatar**: Display initials, upload button placeholder
- **Save/Cancel Actions**: Form submission with loading states

#### Notifications Tab
- **Channels**:
  - Email notifications toggle
  - Push notifications toggle
- **Alert Types**:
  - Price alerts
  - Transaction alerts
  - Bot trading alerts
- **Reports**:
  - Weekly report subscription
  - Monthly report subscription
- **Color-coded sections** for different notification types

#### Security Tab
- **Change Password**:
  - Current password field (with visibility toggle)
  - New password field
  - Confirm new password field
  - Validation on submit
- **Two-Factor Authentication**:
  - Toggle authenticator app 2FA
  - Status display (Active/Inactive)
- **Login Activity**:
  - Last login details (IP, device, time)
  - Previous login history
- **Logout All Sessions**: Sign out from all devices

**Features:**
- Tabbed interface with icon indicators
- Form validation and error handling
- Success/error messaging
- Loading states during save
- Disabled fields (username, email) for security
- Password strength validation
- Mock data for demonstration

### 6. **Bot Detail & Deployment Page** (`src/app/(routes)/bots/[id]/page.tsx`) ✅

#### Performance Overview Cards
- **Total Profit/Loss**: Dollar amount with percentage change
- **Total Trades**: Count with win/loss breakdown
- **Win Rate**: Percentage with visual progress bar
- **Sharpe Ratio**: Risk-adjusted return metric

#### Performance Chart
- Line chart showing daily profit over 7 days
- Tooltip on hover for details
- Responsive design

#### Bot Settings Section
- **Configuration Fields**:
  - Trading pair (e.g., BTC/USDT)
  - Timeframe (1h, 4h, 1d, etc.)
  - Max trade size
  - Stop loss percentage
  - Take profit percentage
  - Risk per trade percentage
- **Edit/Save Toggle**: Switch between view and edit modes
- **Controls**: Start/Pause buttons based on status

#### Deployment Configuration Section
- **Exchange Setup**:
  - Select exchange (Binance, Kraken, etc.)
  - API key input (password field)
  - API secret input (password field)
- **Trading Modes**:
  - Paper trading checkbox (simulation)
  - Live trading checkbox (real money)
- **Settings**:
  - Max concurrent trades limit
  - Notification email address
- **Deploy Button**: Validates credentials before deployment

#### Bot Information Card
- Strategy name
- Creation date
- Last update date
- Bot ID (for reference)

**Features:**
- Real-time status display (Active/Paused/Inactive)
- Loading states during operations
- Success/error messaging
- Framer Motion animations
- Responsive grid layout
- Mock data and performance metrics
- Back button navigation

## Type Definitions (`src/types/index.ts`)

### User Types
```typescript
interface User
interface UserProfile extends User
interface NotificationPreferences
interface AccountSecurity
interface LoginAttempt
```

### Transaction Types
```typescript
interface Transaction
interface TransactionFilters
```

### Bot Types
```typescript
interface Bot
interface BotSettings
interface BotDeploymentConfig
interface BotPerformance
```

### Prediction Types
```typescript
interface Prediction
```

### Form Types
```typescript
interface LoginFormData
interface SignUpFormData
interface ValidationError
interface FormValidationResult
```

## UI Components

### Form Components (`src/components/auth/FormInput.tsx`)

**FormInput**
- Text input with validation error display
- Password visibility toggle
- Success indicator
- Character count (with maxLength)
- Placeholder and label support

**FormCheckbox**
- Checkbox with label
- Error display
- Disabled state support

**FormErrorSummary**
- Aggregated error list display
- Alert icon indicator
- Customizable title

**PasswordStrengthMeter**
- 5-bar strength indicator
- Color-coded feedback
- Dynamic label generation

## Auth Service (`src/lib/auth/authService.ts`)

Utility functions for authentication operations:

```typescript
hashPassword(password: string): Promise<string>
generateToken(length?: number): string
checkEmailExists(email: string): Promise<boolean>
checkUsernameExists(username: string): Promise<boolean>
loginUser(email: string, password: string): Promise<any>
registerUser(userData: RegistrationData): Promise<any>
logoutUser(): void
getAuthToken(): string | null
getStoredUser(): User | null
isAuthenticated(): boolean
verifyPasswordResetToken(token: string): Promise<boolean>
requestPasswordReset(email: string): Promise<void>
resetPassword(token: string, newPassword: string): Promise<void>
setupTwoFactor(): Promise<any>
verify2FACode(code: string): Promise<void>
```

## Styling

All components use:
- **Tailwind CSS** for utility-first styling
- **Dark mode support** with `dark:` prefix
- **Responsive design** with mobile-first approach
- **Framer Motion** for smooth animations
- **Lucide React** for consistent icons

## Mock Data

Realistic mock data is included for testing:
- Transaction list with various types and statuses
- Bot performance metrics with 7-day chart data
- User profile with all fields populated
- Notification preferences configuration

## API Integration Points

The following functions are prepared for backend API integration with TODO comments:

1. `loginUser()` - POST `/api/auth/login`
2. `registerUser()` - POST `/api/auth/register`
3. `checkEmailExists()` - POST `/api/auth/check-email`
4. `checkUsernameExists()` - POST `/api/auth/check-username`
5. `updateProfile()` - PUT `/api/user/profile`
6. `updateNotifications()` - PUT `/api/user/notifications`
7. `changePassword()` - POST `/api/auth/change-password`
8. `setupTwoFactor()` - POST `/api/auth/2fa/setup`
9. `verify2FACode()` - POST `/api/auth/2fa/verify`
10. Bot-related endpoints in deployment

## Routing Structure

```
/login                    - Login page with BVA testing
/register                 - Sign up page with strength meter
/profile                  - User profile & settings (3 tabs)
/bots/[id]               - Bot detail & deployment page
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Dark mode support (prefers-color-scheme)

## Performance Considerations

- Form validation runs on client-side (no unnecessary API calls)
- Debouncing for search functionality
- Memoized computed values in transaction history
- Code splitting ready with Next.js dynamic imports

## Security Features

- Password strength validation
- Two-factor authentication support
- HTTPS ready (token management)
- Secure password field masking
- API key/secret masking in deployment config
- Session management with token storage

## Future Enhancements

1. Email verification on sign up
2. Password reset email flow
3. Social login integration
4. Advanced 2FA options (SMS, backup codes)
5. Session timeout handling
6. Rate limiting on login attempts
7. Account recovery options
8. Advanced bot analytics
9. Transaction export to CSV/PDF
10. Notification customization by asset

## Testing BVA Rules

To test the boundary value analysis:

### Email Validation
- ✓ 4 characters (too short)
- ✓ 5 characters (minimum valid)
- ✓ 253 characters (maximum valid)
- ✓ 254 characters (maximum valid)
- ✓ 255 characters (too long)
- ✓ Invalid format (no @)

### Password Validation
- ✓ 7 characters (too short)
- ✓ 8 characters (minimum)
- ✓ 127 characters (maximum)
- ✓ 128 characters (maximum)
- ✓ 129 characters (too long)
- ✓ No uppercase/number/special (weak)

### Username Validation
- ✓ 2 characters (too short)
- ✓ 3 characters (minimum)
- ✓ 31 characters (maximum)
- ✓ 32 characters (maximum)
- ✓ 33 characters (too long)
- ✓ Invalid characters (spaces)

## File Structure

```
src/
├── app/
│   ├── (routes)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── profile/page.tsx
│   │   └── bots/
│   │       └── [id]/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── providers.tsx
├── components/
│   ├── auth/
│   │   └── FormInput.tsx
│   ├── prices/
│   │   └── TransactionHistory.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Tabs.tsx
│   │   └── Badge.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── auth/
│   │   ├── validation.ts
│   │   └── authService.ts
│   ├── utils.ts
│   └── ...
└── types/
    └── index.ts
```

## Development

To use these components in your application:

1. **Import components:**
```typescript
import { TransactionHistory } from '@/components/prices/TransactionHistory'
import { FormInput } from '@/components/auth/FormInput'
```

2. **Use validation:**
```typescript
import { validateLoginForm } from '@/lib/auth/validation'

const result = validateLoginForm(formData)
if (!result.isValid) {
  // Handle errors
}
```

3. **Access types:**
```typescript
import { Transaction, Bot, UserProfile } from '@/types'
```

## Support

For questions or issues, refer to the inline code comments and mock data examples provided in each component.
