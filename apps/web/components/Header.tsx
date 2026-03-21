import Link from 'next/link'
import { Music } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg-main/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-white hover:text-brand-orange transition-colors">
          <Music size={22} className="text-brand-orange" />
          PhoneZoo
          <span className="text-xs font-normal text-brand-text ml-1">AI Ringtones</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-2 text-sm text-brand-text hover:text-brand-white rounded-lg hover:bg-bg-panel transition-colors"
          >
            Home
          </Link>
          <Link
            href="/generate"
            className="px-3 py-2 text-sm text-brand-text hover:text-brand-white rounded-lg hover:bg-bg-panel transition-colors"
          >
            Generate
          </Link>
          <Link
            href="/library"
            className="px-3 py-2 text-sm text-brand-text hover:text-brand-white rounded-lg hover:bg-bg-panel transition-colors"
          >
            Library
          </Link>
          <Link
            href="/generate"
            className="ml-2 px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-orangeHover text-white text-sm font-semibold transition-colors"
          >
            Create Free
          </Link>
        </nav>
      </div>
    </header>
  )
}
