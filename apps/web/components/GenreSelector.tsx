'use client'

import { cn } from '@/lib/utils'
import type { Genre } from '@/types'

interface GenreSelectorProps {
  genres: Genre[]
  selected: string
  onChange: (id: string) => void
}

export function GenreSelector({ genres, selected, onChange }: GenreSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map(genre => (
        <button
          key={genre.id}
          type="button"
          onClick={() => onChange(genre.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            'border focus:outline-none focus:ring-2 focus:ring-brand-orange/50',
            selected === genre.id
              ? 'bg-brand-orange border-brand-orange text-white'
              : 'bg-bg-panel border-bg-border text-brand-text hover:border-brand-orange hover:text-brand-white'
          )}
          aria-pressed={selected === genre.id}
        >
          {genre.icon && <span aria-hidden="true">{genre.icon}</span>}
          {genre.name}
        </button>
      ))}
    </div>
  )
}
