import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  // Here you would typically store the webhook data in a database
  console.log('Received webhook:', body)

  // For now, we'll just return a success response
  return NextResponse.json({ status: 'success', message: 'Webhook received' })
}

