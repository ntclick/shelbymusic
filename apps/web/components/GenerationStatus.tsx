'use client'

import { useEffect, useRef, useState } from 'react'
import { AudioPlayer } from '@/components/ui/AudioPlayer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDuration } from '@/lib/utils'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import type { JobStatus } from '@/types'

interface GenerationStatusProps {
  status: JobStatus
  audioUrl: string | null
  elapsedMs: number
  error: string | null
  onReset: () => void
}

const PHASE_LABELS = [
  'Composing melody...',
  'Adding harmonics...',
  'Mixing instruments...',
  'Mastering audio...',
  'Applying final touches...',
]

const FAKE_PROGRESS_DURATION_MS = 90_000 // 90 seconds to reach 95%

export function GenerationStatus({
  status,
  audioUrl,
  elapsedMs,
  error,
  onReset,
}: GenerationStatusProps) {
  const [fakeProgress, setFakeProgress] = useState(0)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (status === 'processing' || status === 'pending') {
      // Advance fake progress bar smoothly to 95% over 90 seconds
      progressRef.current = setInterval(() => {
        setFakeProgress(prev => {
          const next = prev + (95 / (FAKE_PROGRESS_DURATION_MS / 200))
          return Math.min(next, 95)
        })
      }, 200)
    } else if (status === 'completed') {
      setFakeProgress(100)
      if (progressRef.current) clearInterval(progressRef.current)
    } else if (status === 'failed') {
      if (progressRef.current) clearInterval(progressRef.current)
    }

    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [status])

  const phaseLabel = PHASE_LABELS[Math.floor((fakeProgress / 95) * (PHASE_LABELS.length - 1))]
  const elapsedSec = Math.floor(elapsedMs / 1000)

  if (status === 'completed' && audioUrl) {
    return (
      <div className="animate-slide-up space-y-4">
        <div className="flex items-center gap-2 text-brand-success">
          <CheckCircle size={20} />
          <span className="font-semibold">Ringtone ready!</span>
          <span className="text-brand-text text-sm ml-auto">
            Generated in {formatDuration(elapsedSec)}
          </span>
        </div>

        <AudioPlayer src={audioUrl} title="Your AI Ringtone" />

        <div className="flex gap-3">
          <a
            href={audioUrl}
            download="ringtone.mp3"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange hover:bg-brand-orangeHover text-white font-semibold text-sm transition-colors"
          >
            Download MP3
          </a>
          <Button variant="secondary" onClick={onReset} className="flex-1">
            Create Another
          </Button>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="flex items-center gap-2 text-red-400">
          <XCircle size={20} />
          <span className="font-semibold">Generation failed</span>
        </div>
        {error && <p className="text-brand-text text-sm">{error}</p>}
        <Button variant="primary" onClick={onReset}>
          Try Again
        </Button>
      </div>
    )
  }

  // pending or processing
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-brand-text">
        {status === 'pending' ? (
          <>
            <Clock size={18} />
            <span className="text-sm">Queuing your request...</span>
          </>
        ) : (
          <>
            <LoadingSpinner size={18} className="text-brand-orange" />
            <span className="text-sm">{phaseLabel}</span>
            <span className="ml-auto text-xs tabular-nums">{elapsedSec}s</span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-orange rounded-full transition-all duration-200 ease-out"
          style={{ width: `${fakeProgress}%` }}
        />
      </div>

      {elapsedSec > 30 && status === 'processing' && (
        <p className="text-xs text-brand-text">
          AI generation can take 60–120 seconds. Hang tight!
        </p>
      )}
    </div>
  )
}
