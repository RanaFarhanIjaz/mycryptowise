'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles, Home, LineChart, Bot, MessageSquare, Brain, DollarSign, GraduationCap, Moon, Sun, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsAuthenticated(Boolean(firebaseUser))
      setAuthReady(true)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    setIsOpen(false)
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Prices', href: '/prices', icon: DollarSign },
    { name: 'Predictions', href: '/predictions', icon: Brain },
    { name: 'Bots', href: '/bots', icon: Bot },
    { name: 'Assistant', href: '/assistant', icon: MessageSquare },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'About', href: '/about', icon: Sparkles },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-gray-900'
      } border-b border-gray-200 dark:border-gray-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CryptoWise
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5
                      ${active 
                        ? 'text-primary bg-primary/10' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              )}
              {mounted && authReady && (
                isAuthenticated ? (
                  <>
                    <Button asChild size="sm" variant="outline" className="ml-2">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button size="sm" className="ml-2" onClick={handleLogout}>Logout</Button>
                  </>
                ) : (
                  <Button asChild size="sm" className="ml-2">
                    <Link href="/login">Login</Link>
                  </Button>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition touch-target"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition touch-target"
                aria-label="Menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-lg">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 touch-target"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  {navItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg transition-colors touch-target
                          ${active 
                            ? 'text-primary bg-primary/10' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {active && <ChevronRight className="h-4 w-4" />}
                      </Link>
                    )
                  })}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  {authReady && isAuthenticated ? (
                    <>
                      <Button asChild className="w-full touch-target" variant="outline">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                      </Button>
                      <Button className="w-full touch-target" onClick={handleLogout}>Logout</Button>
                    </>
                  ) : (
                    <Button asChild className="w-full touch-target">
                      <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}