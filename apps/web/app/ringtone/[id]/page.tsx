import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicRingtoneById } from '@/lib/storage'
import { AudioPlayer } from '@/components/ui/AudioPlayer'
import { formatDuration, timeAgo } from '@/lib/utils'
import { Download, ArrowLeft, Wand2, Share2 } from 'lucide-react'
import type { Ringtone } from '@/types'

interface RingtonePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: RingtonePageProps): Promise<Metadata> {
  const ringtone = await getPublicRingtoneById(params.id)
  if (!ringtone) return { title: 'Ringtone Not Found' }

  const title = ringtone.title || ringtone.prompt.slice(0, 60)

  return {
    title,
    description: `AI-generated ${ringtone.genre} ringtone — ${ringtone.prompt}`,
    openGraph: {
      title: `${title} | PhoneZoo AI Ringtone`,
      description: ringtone.prompt,
      type: 'music.song',
      audio: ringtone.audio_url ? [{ url: ringtone.audio_url, type: 'audio/mpeg' }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description: ringtone.prompt,
    },
  }
}

export default async function RingtonePage({ params }: RingtonePageProps) {
  const ringtone = await getPublicRingtoneById(params.id)
  if (!ringtone) notFound()

  const displayTitle = ringtone.title || ringtone.prompt.slice(0, 60)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-brand-text hover:text-brand-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Library
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-brand-orange/10 text-brand-orange rounded-full capitalize">
            {ringtone.genre}
          </span>
          <span className="text-xs text-brand-text">
            {formatDuration(ringtone.duration_seconds)}
          </span>
          <span className="text-xs text-brand-text">·</span>
          <span className="text-xs text-brand-text">{timeAgo(ringtone.created_at)}</span>
        </div>
        <h1 className="text-2xl font-bold text-brand-white">{displayTitle}</h1>
      </div>

      {/* Audio Player */}
      {ringtone.audio_url && (
        <AudioPlayer src={ringtone.audio_url} title={displayTitle} />
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {ringtone.audio_url && (
          <a
            href={ringtone.audio_url}
            download={`${displayTitle}.mp3`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-orange hover:bg-brand-orangeHover text-white font-semibold text-sm transition-colors"
          >
            <Download size={16} />
            Download MP3
          </a>
        )}
        <Link
          href={`/generate?prompt=${encodeURIComponent(ringtone.prompt)}&genre=${ringtone.genre}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-bg-border hover:border-brand-orange text-brand-white font-semibold text-sm transition-colors"
        >
          <Wand2 size={16} />
          Create Similar
        </Link>
        <button
          onClick={() => {}}
          className="w-11 h-11 flex items-center justify-center rounded-lg border border-bg-border hover:border-brand-orange text-brand-text hover:text-brand-orange transition-colors"
          aria-label="Share"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Details */}
      <div className="bg-bg-panel border border-bg-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-brand-white uppercase tracking-wide">Details</h2>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-brand-text mb-1">Prompt</dt>
            <dd className="text-brand-white">{ringtone.prompt}</dd>
          </div>
          {ringtone.lyrics && (
            <div>
              <dt className="text-brand-text mb-1">Lyrics</dt>
              <dd className="text-brand-white whitespace-pre-line">{ringtone.lyrics}</dd>
            </div>
          )}
          <div className="flex gap-6">
            <div>
              <dt className="text-brand-text mb-1">Genre</dt>
              <dd className="text-brand-white capitalize">{ringtone.genre}</dd>
            </div>
            <div>
              <dt className="text-brand-text mb-1">Duration</dt>
              <dd className="text-brand-white">{formatDuration(ringtone.duration_seconds)}</dd>
            </div>
            {ringtone.generation_time_ms && (
              <div>
                <dt className="text-brand-text mb-1">Gen time</dt>
                <dd className="text-brand-white">{formatDuration(Math.floor(ringtone.generation_time_ms / 1000))}</dd>
              </div>
            )}
          </div>
        </dl>
      </div>
    </div>
  )
}
