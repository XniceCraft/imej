import { Separator } from '@/components/ui/separator'
import { FilesIcon, LightningIcon, ShieldCheckIcon } from '@phosphor-icons/react/ssr'

import { faqItems } from '@/lib/contents/faq'

export function Content() {
  return (
    <>
      <div className="mx-auto max-w-5xl px-6 sm:px-4">
        <Separator />
      </div>

      <section aria-labelledby="features-heading" className="mx-auto max-w-5xl px-6 py-12 sm:px-4">
        <div className="mb-8 space-y-2 text-center">
          <h2 id="features-heading" className="text-foreground text-2xl font-bold tracking-tight">
            Why Choose Imej?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-sm">
            Designed for privacy, speed, and cross-platform reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-card border-border space-y-3 rounded-xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <ShieldCheckIcon className="size-5" />
            </div>
            <h3 className="text-foreground text-base font-semibold">100% Client-Side Privacy</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Files are processed exclusively inside your web browser. Zero server transfers means
              complete confidentiality for your personal documents and photos.
            </p>
          </div>

          <div className="bg-card border-border space-y-3 rounded-xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <LightningIcon className="size-5" />
            </div>
            <h3 className="text-foreground text-base font-semibold">Instant Processing</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Skip long upload wait times. Conversion happens instantly using local browser hardware
              acceleration.
            </p>
          </div>

          <div className="bg-card border-border space-y-3 rounded-xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <FilesIcon className="size-5" />
            </div>
            <h3 className="text-foreground text-base font-semibold">Broad Format Support</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Convert between modern web formats like WebP and AVIF, or traditional JPG, PNG, and
              PDF documents.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 sm:px-4">
        <Separator />
      </div>

      <section
        aria-labelledby="how-it-works-heading"
        className="mx-auto max-w-5xl px-6 py-12 sm:px-4"
      >
        <div className="mb-8 space-y-2 text-center">
          <h2
            id="how-it-works-heading"
            className="text-foreground text-2xl font-bold tracking-tight"
          >
            How It Works
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-sm">
            Convert your media files in three simple steps.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <li className="bg-card border-border space-y-2 rounded-xl border p-6 shadow-sm">
            <span className="text-accent text-xs font-bold tracking-wider uppercase">Step 1</span>
            <h3 className="text-foreground text-base font-semibold">Select Output Settings</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Choose your target output format (JPG, PNG, WebP, or PDF) and adjust compression
              quality.
            </p>
          </li>

          <li className="bg-card border-border space-y-2 rounded-xl border p-6 shadow-sm">
            <span className="text-accent text-xs font-bold tracking-wider uppercase">Step 2</span>
            <h3 className="text-foreground text-base font-semibold">Upload Files</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Drag and drop your images into the dropzone or click to choose files from your device.
            </p>
          </li>

          <li className="bg-card border-border space-y-2 rounded-xl border p-6 shadow-sm">
            <span className="text-accent text-xs font-bold tracking-wider uppercase">Step 3</span>
            <h3 className="text-foreground text-base font-semibold">Download Converted Media</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Download your converted images individually or batch save them all in seconds.
            </p>
          </li>
        </ol>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto max-w-5xl px-6 py-12 sm:px-4">
        <div className="mb-8 space-y-2 text-center">
          <h2 id="faq-heading" className="text-foreground text-2xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-sm">
            Answers to common questions about Imej and in-browser file conversion.
          </p>
        </div>

        <div className="border-border bg-card divide-y rounded-xl border p-6 shadow-sm">
          {faqItems.map((item) => (
            <article key={item.question} className="space-y-1.5 py-4 first:pt-0 last:pb-0">
              <h3 className="text-foreground text-sm font-semibold">{item.question}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
