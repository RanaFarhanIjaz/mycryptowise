'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = ({ 
  children, 
  open, 
  onOpenChange 
}: { 
  children: React.ReactNode; 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg outline-none"
            >
              {children}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>
}

const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("grid gap-4", className)}>{children}</div>
}

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>
}

const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{children}</div>
}

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>
}

const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
