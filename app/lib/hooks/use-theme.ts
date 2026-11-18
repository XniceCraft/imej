import { useSyncExternalStore } from 'react'

import { getTheme, setTheme, subscribe } from '@/lib/theme'

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'system' as const)
  return { theme, setTheme }
}
