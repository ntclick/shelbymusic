/**
 * Merge Tailwind class names (simple version — no clsx dependency needed)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate a random integer seed for ACE-Step
 */
export function generateSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647)
}

/**
 * Format seconds to M:SS display
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Build the absolute webhook URL Modal will POST to when generation completes.
 * Uses NEXT_PUBLIC_APP_URL so it works with ngrok in local dev.
 */
export function buildWebhookUrl(appUrl: string, jobId: string): string {
  return `${appUrl.replace(/\/$/, '')}/api/webhook`
}

/**
 * Truncate a string to max length with ellipsis
 */
export function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}…` : str
}

/**
 * Format a date to a human-readable relative string
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
