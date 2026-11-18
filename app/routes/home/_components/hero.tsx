import { Badge } from '@/components/ui/badge'

import { fileTypes } from '@/lib/file-types'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#1E3A8A] bg-[radial-gradient(rgb(147_197_253/0.3)_1.3px,transparent_1.3px)] bg-size-[28px_28px] text-white">
      <section className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-12 sm:px-4">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight">Convert images in seconds</h1>
          <p className="text-sm text-white/85">
            Drop your files, pick a format, and download. Convert one image or a whole batch at
            once.
          </p>
          <div className="flex gap-1.5">
            {fileTypes.map((type) => (
              <Badge
                variant="outline"
                className="border-blue-700 bg-blue-600/20 text-white"
                key={type}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
        <img
          className="relative z-1 block h-48"
          src="/assets/svg/illustration.svg"
          alt="Illustration"
        />
      </section>
      <img
        className="absolute bottom-0 left-0 h-64 -translate-x-1/2 translate-y-1/2"
        src="/assets/svg/left-circle.svg"
        alt="Left Circle"
      />
      <img
        className="absolute top-1/2 right-16 h-128 translate-x-1/2 -translate-y-1/2"
        src="/assets/svg/right-circle.svg"
        alt="Right Circle"
      />
    </div>
  )
}
