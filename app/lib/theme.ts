export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'
const isBrowser = typeof window !== 'undefined'

const listeners = new Set<() => void>()

function read(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

let current: Theme = isBrowser ? read() : 'system'

function apply(): void {
  const dark =
    current === 'dark' || (current === 'system' && window.matchMedia(MEDIA_QUERY).matches)
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}

function emit(): void {
  listeners.forEach((listener) => listener())
}

export function getTheme(): Theme {
  return current
}

export function setTheme(theme: Theme): void {
  if (theme === current) return
  current = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {}
  apply()
  emit()
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

if (isBrowser) {
  apply()

  window.matchMedia(MEDIA_QUERY).addEventListener('change', () => {
    if (current === 'system') apply()
  })

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    current = read()
    apply()
    emit()
  })
}
