export function Footer() {
  return (
    <footer className="border-border bg-background mt-auto w-full border-t py-10">
      <div className="mx-auto max-w-5xl px-6 sm:px-4">
        <div className="mb-8 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-lg font-bold">
            <img
              src="/assets/image/logo.webp"
              alt="Imej Logo"
              className="block size-8 rounded-lg"
            />
            <span>Imej</span>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm">
            Fast, privacy-focused media converter for images and documents directly in your web
            browser.
          </p>
        </div>

        <div className="border-border text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row">
          {/* oxlint-disable-next-line */}
          <p>© {new Date().getFullYear()} Imej. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
