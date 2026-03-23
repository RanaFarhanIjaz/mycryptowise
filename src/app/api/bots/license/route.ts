import { NextResponse } from 'next/server'
import { generateHardwareId, validateActivation } from '@/lib/bots/license-generator'

const licenses: any[] = []

export async function POST(request: Request) {
  try {
    const { licenseKey, botId, action } = await request.json()
    
    const hardwareId = generateHardwareId()
    
    const license = licenses.find(l => l.key === licenseKey && l.botId === botId)
    
    if (!license) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid license key' 
      }, { status: 404 })
    }

    switch (action) {
      case 'activate':
        if (!validateActivation(license, hardwareId)) {
          return NextResponse.json({ 
            valid: false, 
            error: 'License expired or max activations reached' 
          }, { status: 403 })
        }
        
        license.activations++
        license.lastActivation = new Date().toISOString()
        
        return NextResponse.json({
          valid: true,
          message: 'License activated successfully',
          expiresAt: license.expiresAt,
          activationsLeft: license.maxActivations - license.activations
        })

      case 'verify':
        return NextResponse.json({
          valid: true,
          expiresAt: license.expiresAt,
          activationsLeft: license.maxActivations - license.activations
        })

      case 'deactivate':
        license.activations = Math.max(0, license.activations - 1)
        return NextResponse.json({
          valid: true,
          message: 'License deactivated'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
