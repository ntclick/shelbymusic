import type { Metadata } from 'next'
import { getSupabaseAdminClient } from '@/lib/supabase'
import { GenerateForm } from '@/components/GenerateForm'
import type { Genre } from '@/types'

export const metadata: Metadata = {
  title: 'Generate AI Ringtone',
  description: 'Create a custom AI ringtone in seconds. Choose your genre, describe your sound, and download a unique MP3.',
}

async function getGenres(): Promise<Genre[]> {
  try {
    const supabase = getSupabaseAdminClient()
    const { data } = await supabase.from('genres').select('*').order('sort_order')
    return (data as Genre[]) || []
  } catch {
    return []
  }
}

interface GeneratePageProps {
  searchParams: { genre?: string; prompt?: string }
}

export default async function GeneratePage({ searchParams }: GeneratePageProps) {
  const genres = await getGenres()
  const defaultGenre = searchParams.genre && genres.some(g => g.id === searchParams.genre)
    ? searchParams.genre
    : 'pop'
  const defaultPrompt = searchParams.prompt || ''

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-brand-white">Generate Ringtone</h1>
        <p className="text-brand-text">
          Describe the sound you want and our AI will compose a unique ringtone for you.
        </p>
      </div>

      <GenerateForm
        genres={genres}
        defaultGenre={defaultGenre}
        defaultPrompt={defaultPrompt}
      />

      {/* Tips */}
      <div className="mt-10 p-4 bg-bg-panel border border-bg-border rounded-xl space-y-2">
        <p className="text-xs font-semibold text-brand-white uppercase tracking-wide">Tips for better results</p>
        <ul className="text-xs text-brand-text space-y-1 list-disc list-inside">
          <li>Be specific: &quot;upbeat summer pop with piano and acoustic guitar&quot;</li>
          <li>Mention tempo: &quot;fast 128 BPM&quot; or &quot;slow and mellow&quot;</li>
          <li>Add mood: &quot;happy&quot;, &quot;mysterious&quot;, &quot;epic&quot;, &quot;relaxing&quot;</li>
          <li>First generation takes ~90 seconds (GPU warm-up). Subsequent ones are faster.</li>
        </ul>
      </div>
    </div>
  )
}
