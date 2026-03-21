import Link from 'next/link'
import { Music } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-bg-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-text">
        <div className="flex items-center gap-2">
          <Music size={16} className="text-brand-orange" />
          <span>PhoneZoo AI Ringtones</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/generate" className="hover:text-brand-white transition-colors">Generate</Link>
          <Link href="/library" className="hover:text-brand-white transition-colors">Library</Link>
          <a href="https://phonezoo.com" className="hover:text-brand-white transition-colors">
            PhoneZoo.com
          </a>
        </div>
        <span>© {new Date().getFullYear()} PhoneZoo</span>
      </div>
    </footer>
  )
}
