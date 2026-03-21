import { NextRequest, NextResponse } from 'next/server'
import { completeJob, markJobFailed } from '@/lib/storage'
import type { WebhookPayload } from '@/types'

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.WEBHOOK_SECRET
  if (webhookSecret) {
    const received = req.headers.get('x-webhook-secret')
    if (received !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let payload: WebhookPayload
  try { payload = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload.job_id || !payload.status) {
    return NextResponse.json({ error: 'Missing job_id or status' }, { status: 400 })
  }

  if (payload.status === 'completed') {
    await completeJob(payload.job_id, {
      audio_url: payload.audio_url || '',
      audio_size_kb: payload.audio_size_kb,
      generation_time_ms: payload.generation_time_ms,
    })
  } else if (payload.status === 'failed') {
    await markJobFailed(payload.job_id)
  } else {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
