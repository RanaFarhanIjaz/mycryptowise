'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { FormInput } from '@/components/auth/FormInput'
import { Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { addTransaction } from '@/lib/db/transactions'
import { toast } from 'react-hot-toast'

export function AddTransactionDialog({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    asset: 'BTC',
    type: 'BUY' as 'BUY' | 'SELL',
    quantity: '',
    price: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const quantity = parseFloat(formData.quantity)
      const price = parseFloat(formData.price)
      
      await addTransaction({
        userId: user.uid,
        asset: formData.asset.toUpperCase(),
        type: formData.type,
        quantity,
        price,
        totalValue: quantity * price,
        date: new Date(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
      })

      toast.success('Transaction added successfully!')
      setOpen(false)
      onTransactionAdded()
      setFormData({ asset: 'BTC', type: 'BUY', quantity: '', price: '' })
    } catch (error) {
      console.error('Failed to add transaction:', error)
      toast.error('Failed to add transaction')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your crypto transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-4">
              <Button 
                type="button"
                variant={formData.type === 'BUY' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, type: 'BUY' }))}
              >
                BUY
              </Button>
              <Button 
                type="button"
                variant={formData.type === 'SELL' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, type: 'SELL' }))}
              >
                SELL
              </Button>
            </div>
            <FormInput
              id="asset"
              label="Asset Symbol"
              placeholder="BTC, ETH, SOL..."
              value={formData.asset}
              onChange={(e) => setFormData(prev => ({ ...prev, asset: e.target.value }))}
              required
            />
            <FormInput
              id="quantity"
              label="Quantity"
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              required
            />
            <FormInput
              id="price"
              label="Price (USD)"
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
