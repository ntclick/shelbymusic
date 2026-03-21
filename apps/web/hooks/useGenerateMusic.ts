'use client'

import { useEffect, useRef, useState } from 'react'
import { submitGeneration, pollStatus } from '@/lib/api'
import type { GenerateRequest, JobStatus } from '@/types'

const POLL_INTERVAL_MS = 2000
const TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export interface UseGenerateMusicReturn {
  generate: (input: GenerateRequest) => Promise<void>
  reset: () => void
  status: JobStatus | null
  audioUrl: string | null
  isSubmitting: boolean
  error: string | null
  elapsedMs: number
  jobId: string | null
}

export function useGenerateMusic(): UseGenerateMusicReturn {
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<JobStatus | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)

  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const elapsedRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    if (elapsedRef.current) { clearInterval(elapsedRef.current); elapsedRef.current = null }
  }

  const reset = () => {
    stopPolling()
    setJobId(null)
    setStatus(null)
    setAudioUrl(null)
    setIsSubmitting(false)
    setError(null)
    setElapsedMs(0)
  }

  // Start polling when jobId is set and not yet terminal
  useEffect(() => {
    if (!jobId || status === 'completed' || status === 'failed') {
      stopPolling()
      return
    }

    startTimeRef.current = Date.now()

    // Elapsed time counter (updates every second for UX)
    elapsedRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current)
    }, 1000)

    // Status polling every 2 seconds
    pollRef.current = setInterval(async () => {
      // Timeout guard
      if (Date.now() - startTimeRef.current > TIMEOUT_MS) {
        stopPolling()
        setStatus('failed')
        setError('Generation timed out. Please try again.')
        return
      }

      try {
        const result = await pollStatus(jobId)
        setStatus(result.status)

        if (result.status === 'completed') {
          setAudioUrl(result.audio_url || null)
          stopPolling()
        } else if (result.status === 'failed') {
          setError(result.error || 'Generation failed. Please try again.')
          stopPolling()
        }
      } catch (err) {
        console.error('Poll error:', err)
        // Don't stop polling on transient network errors
      }
    }, POLL_INTERVAL_MS)

    return stopPolling
  }, [jobId]) // eslint-disable-line react-hooks/exhaustive-deps

  const generate = async (input: GenerateRequest) => {
    reset()
    setIsSubmitting(true)

    try {
      const response = await submitGeneration(input)
      setJobId(response.job_id)
      setStatus('processing')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start generation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { generate, reset, status, audioUrl, isSubmitting, error, elapsedMs, jobId }
}
