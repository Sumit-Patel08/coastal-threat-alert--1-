import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { alertId, recipients, notificationType } = await request.json()
    const supabase = await createClient()

    // Get alert details
    const { data: alert } = await supabase
      .from('alert_logs')
      .select('*')
      .eq('id', alertId)
      .single()

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    const notifications = []

    // Send notifications to each recipient
    for (const recipient of recipients) {
      let status = 'Sent'
      let sentAt: string | null = new Date().toISOString()

      // Simulate notification sending
      try {
        switch (notificationType) {
          case 'SMS':
            // Simulate SMS API call
            console.log(`SMS sent to ${recipient}: ${alert.type} alert in ${alert.location}`)
            break
          case 'Email':
            // Simulate email API call
            console.log(`Email sent to ${recipient}: ${alert.description}`)
            break
          case 'Web':
            // Web notification (real-time via WebSocket would be implemented here)
            console.log(`Web notification sent to ${recipient}`)
            break
          case 'Push':
            // Push notification API call
            console.log(`Push notification sent to ${recipient}`)
            break
        }
      } catch (error) {
        status = 'Failed'
        sentAt = null
      }

      // Log notification
      const { data: notification } = await supabase
        .from('notification_logs')
        .insert({
          alert_id: alertId,
          notification_type: notificationType,
          recipient: recipient,
          status: status,
          sent_at: sentAt
        })
        .select()
        .single()

      notifications.push(notification)
    }

    return NextResponse.json({ 
      message: 'Notifications sent',
      notifications: notifications
    })

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: notifications } = await supabase
      .from('notification_logs')
      .select(`
        *,
        alert_logs (
          type,
          severity,
          location,
          description
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}
