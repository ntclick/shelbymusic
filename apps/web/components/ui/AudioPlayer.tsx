'use client'

import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { formatDuration } from '@/lib/utils'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
}

export function AudioPlayer({ src, title, className = '' }: AudioPlayerProps) {
  const { audioRef, isPlaying, currentTime, duration, toggle, seek } = useAudioPlayer(src)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    seek(pct)
  }

  return (
    <div className={`bg-bg-panel border border-bg-border rounded-xl p-4 ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {title && (
        <p className="text-brand-white text-sm font-medium mb-3 truncate">{title}</p>
      )}

      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={toggle}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white flex-shrink-0 transition-colors"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-brand-text w-8 text-right tabular-nums">
            {formatDuration(Math.floor(currentTime))}
          </span>

          <div
            className="flex-1 h-1.5 bg-bg-border rounded-full cursor-pointer relative group"
            onClick={handleBarClick}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Audio progress"
          >
            <div
              className="h-full bg-brand-orange rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          <span className="text-xs text-brand-text w-8 tabular-nums">
            {duration > 0 ? formatDuration(Math.floor(duration)) : '--:--'}
          </span>

          <Volume2 size={14} className="text-brand-text flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
