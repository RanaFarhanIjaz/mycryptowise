'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Shield,
  Smartphone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FormInput, FormCheckbox } from '@/components/auth/FormInput'
import { UserProfile, NotificationPreferences, AccountSecurity } from '@/types'

interface ProfileSettingsPageProps {
  initialUser?: UserProfile
  initialNotifications?: NotificationPreferences
  initialSecurity?: AccountSecurity
}

export default function ProfileSettingsPage({
  initialUser,
  initialNotifications,
  initialSecurity,
}: ProfileSettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Profile state
  const [profile, setProfile] = useState<Partial<UserProfile>>(
    initialUser || {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      username: 'johndoe',
      bio: 'Passionate crypto trader',
      phoneNumber: '+1-555-0123',
      country: 'United States',
      timezone: 'EST',
    }
  )

  // Notification preferences state
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    initialNotifications || {
      userId: 'user-1',
      emailNotifications: true,
      pushNotifications: true,
      priceAlerts: true,
      transactionAlerts: true,
      botAlerts: true,
      weeklyReport: true,
      monthlyReport: true,
    }
  )

  // Security state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialSecurity?.twoFactorEnabled || false)

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNotificationChange = (field: keyof NotificationPreferences, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveMessage({ type: 'success', message: 'Profile updated successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to save profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveMessage({ type: 'success', message: 'Notification preferences updated!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to save preferences. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setSaveMessage({ type: 'error', message: 'New passwords do not match.' })
      return
    }

    if (passwords.new.length < 8) {
      setSaveMessage({ type: 'error', message: 'Password must be at least 8 characters.' })
      return
    }

    setIsSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveMessage({ type: 'success', message: 'Password changed successfully!' })
      setPasswords({ current: '', new: '', confirm: '' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to change password. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle2FA = async (enabled: boolean) => {
    setIsSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTwoFactorEnabled(enabled)
      setSaveMessage({
        type: 'success',
        message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}!`,
      })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to update 2FA setting.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings & Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account, preferences, and security</p>
        </motion.div>

        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-lg ${
              saveMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            {saveMessage.message}
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Lock },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
          {/* Profile Tab */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Upload New Photo
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        JPG, PNG or GIF (max 5MB)
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6" />

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      id="firstName"
                      type="text"
                      label="First Name"
                      value={profile.firstName || ''}
                      onChange={e => handleProfileChange('firstName', e.target.value)}
                    />
                    <FormInput
                      id="lastName"
                      type="text"
                      label="Last Name"
                      value={profile.lastName || ''}
                      onChange={e => handleProfileChange('lastName', e.target.value)}
                    />
                  </div>

                  <FormInput
                    id="username"
                    type="text"
                    label="Username"
                    value={profile.username || ''}
                    onChange={e => handleProfileChange('username', e.target.value)}
                    disabled
                  />

                  <FormInput
                    id="email"
                    type="email"
                    label="Email Address"
                    value={profile.email || ''}
                    onChange={e => handleProfileChange('email', e.target.value)}
                    disabled
                  />

                  <FormInput
                    id="bio"
                    type="text"
                    label="Bio"
                    placeholder="Tell us about yourself"
                    value={profile.bio || ''}
                    onChange={e => handleProfileChange('bio', e.target.value)}
                  />

                  {/* Contact & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      id="phoneNumber"
                      type="tel"
                      label="Phone Number"
                      placeholder="+1-555-0123"
                      value={profile.phoneNumber || ''}
                      onChange={e => handleProfileChange('phoneNumber', e.target.value)}
                    />
                    <FormInput
                      id="country"
                      type="text"
                      label="Country"
                      placeholder="United States"
                      value={profile.country || ''}
                      onChange={e => handleProfileChange('country', e.target.value)}
                    />
                  </div>

                  <FormInput
                    id="timezone"
                    type="text"
                    label="Timezone"
                    placeholder="EST"
                    value={profile.timezone || ''}
                    onChange={e => handleProfileChange('timezone', e.target.value)}
                  />

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Notifications Tab */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        Notification Channels
                      </h3>
                      <div className="space-y-3">
                        <FormCheckbox
                          id="emailNotifications"
                          label="Email Notifications"
                          checked={notifications.emailNotifications}
                          onChange={e =>
                            handleNotificationChange('emailNotifications', e.target.checked)
                          }
                        />
                        <FormCheckbox
                          id="pushNotifications"
                          label="Push Notifications"
                          checked={notifications.pushNotifications}
                          onChange={e =>
                            handleNotificationChange('pushNotifications', e.target.checked)
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                        Alert Types
                      </h3>
                      <div className="space-y-3">
                        <FormCheckbox
                          id="priceAlerts"
                          label="Price Alerts"
                          checked={notifications.priceAlerts}
                          onChange={e => handleNotificationChange('priceAlerts', e.target.checked)}
                        />
                        <FormCheckbox
                          id="transactionAlerts"
                          label="Transaction Alerts"
                          checked={notifications.transactionAlerts}
                          onChange={e =>
                            handleNotificationChange('transactionAlerts', e.target.checked)
                          }
                        />
                        <FormCheckbox
                          id="botAlerts"
                          label="Bot Trading Alerts"
                          checked={notifications.botAlerts}
                          onChange={e => handleNotificationChange('botAlerts', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                        Reports
                      </h3>
                      <div className="space-y-3">
                        <FormCheckbox
                          id="weeklyReport"
                          label="Weekly Report"
                          checked={notifications.weeklyReport}
                          onChange={e => handleNotificationChange('weeklyReport', e.target.checked)}
                        />
                        <FormCheckbox
                          id="monthlyReport"
                          label="Monthly Report"
                          checked={notifications.monthlyReport}
                          onChange={e => handleNotificationChange('monthlyReport', e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
                    <Button variant="outline">Reset to Default</Button>
                    <Button onClick={handleSaveNotifications} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Security Tab */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="relative">
                      <FormInput
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        label="Current Password"
                        value={passwords.current}
                        onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        showPasswordToggle
                      />
                    </div>

                    <div className="relative">
                      <FormInput
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        label="New Password"
                        value={passwords.new}
                        onChange={e => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                        showPasswordToggle
                        minLength={8}
                      />
                    </div>

                    <div className="relative">
                      <FormInput
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm New Password"
                        value={passwords.confirm}
                        onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                        showPasswordToggle
                        minLength={8}
                      />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleChangePassword} disabled={isSaving}>
                        <Lock className="w-4 h-4 mr-2" />
                        {isSaving ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Authenticator App
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Use an app like Google Authenticator or Authy
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleToggle2FA(!twoFactorEnabled)}
                        disabled={isSaving}
                        variant={twoFactorEnabled ? 'default' : 'outline'}
                      >
                        {twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>

                    {twoFactorEnabled && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-0 mb-2">
                          Active
                        </Badge>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Two-factor authentication is enabled on your account.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Login Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Login Activity
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Last login
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Today at 10:30 AM
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            IP: 192.168.1.1 | Device: Chrome on Windows
                          </p>
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-0">
                          Current
                        </Badge>
                      </div>

                      <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Previous login
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Yesterday at 3:45 PM
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            IP: 192.168.1.2 | Device: Safari on macOS
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Logout All Sessions */}
                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                      <LogOut className="w-5 h-5" />
                      Logout All Sessions
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Sign out from all devices and sessions. You will need to log in again on all devices.
                    </p>
                    <Button variant="outline" className="border-red-200 dark:border-red-800">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout All Sessions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
