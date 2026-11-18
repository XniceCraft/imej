import { ThemeSwitcher } from './theme-switcher'
import { Link } from 'react-router'

export function Navbar() {
  return (
    <div className="absolute z-1 w-full">
      <nav className="mx-auto flex h-18 w-full max-w-5xl items-center justify-between gap-12 px-6 text-white sm:px-4">
        <Link
          to="/"
          className="inline-flex h-9 items-center gap-2 text-2xl/none font-bold tracking-tight"
        >
          <img src="/assets/image/logo.webp" alt="Imej Logo" className="block size-8 rounded-lg" />
          Imej
        </Link>

        <ThemeSwitcher />
      </nav>
    </div>
  )
}
