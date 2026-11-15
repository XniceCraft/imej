const MAX_SIDE = 256
const SKIP_BELOW_BYTES = 200_000

const PASSTHROUGH_TYPES = new Set(['image/svg+xml', 'image/gif'])

type Job = {
  file: File
  signal: AbortSignal
  resolve: (blob: Blob | null) => void
}

const queue: Job[] = []
let active = 0

function maxConcurrent() {
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 2
  return Math.max(1, Math.min(cores || 2, 4))
}

async function compress(file: File): Promise<Blob | null> {
  if (PASSTHROUGH_TYPES.has(file.type)) return null

  const probe = await createImageBitmap(file)
  const { width, height } = probe
  probe.close()

  const scale = Math.min(1, MAX_SIDE / Math.max(width, height))
  if (scale === 1 && file.size < SKIP_BELOW_BYTES) return null

  const bitmap = await createImageBitmap(file, {
    resizeWidth: Math.max(1, Math.round(width * scale)),
    resizeHeight: Math.max(1, Math.round(height * scale)),
    resizeQuality: 'medium',
  })

  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0)
    return await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 })
  } finally {
    bitmap.close()
  }
}

function pump() {
  while (active < maxConcurrent() && queue.length > 0) {
    const job = queue.shift()!

    if (job.signal.aborted) {
      job.resolve(null)
      continue
    }

    active++
    compress(job.file)
      .catch(() => null)
      .then(job.resolve)
      .finally(() => {
        active--
        pump()
      })
  }
}

export function requestPreview(file: File, signal: AbortSignal) {
  return new Promise<Blob | null>((resolve) => {
    queue.push({ file, signal, resolve })
    pump()
  })
}
