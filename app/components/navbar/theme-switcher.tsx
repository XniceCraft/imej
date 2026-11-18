import { useTheme } from '@/lib/hooks/use-theme'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunDimIcon } from '@phosphor-icons/react/ssr'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <SunDimIcon size={16} weight="bold" />
      ) : (
        <MoonIcon size={16} weight="bold" />
      )}
    </Button>
  )
}
