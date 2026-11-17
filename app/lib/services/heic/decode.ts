type HEICDecodeInput = Blob | ArrayBuffer | ArrayBufferView
type Libheif = typeof import('libheif-js/wasm-bundle').default

let libheifPromise: Promise<Libheif> | undefined

interface HEICDecodeOptions {
  signal?: AbortSignal
}

class HEICDecodeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message)
    this.name = 'DecodeError'
    if (options?.cause !== undefined) (this as { cause?: unknown }).cause = options.cause
  }
}

function loadLibheif(): Promise<Libheif> {
  libheifPromise ??= import('libheif-js/wasm-bundle')
    .then((mod) => mod.default ?? (mod as unknown as Libheif))
    .catch((cause) => {
      libheifPromise = undefined
      throw new HEICDecodeError('Failed to load libheif-js', { cause })
    })
  return libheifPromise
}

const HEIF_BRANDS = new Set([
  'heic',
  'heix',
  'hevc',
  'hevx',
  'heim',
  'heis',
  'hevm',
  'hevs',
  'mif1',
  'msf1',
  'avif',
])

async function toBytes(input: HEICDecodeInput): Promise<Uint8Array> {
  if (input instanceof Blob) return new Uint8Array(await input.arrayBuffer())
  if (input instanceof ArrayBuffer) return new Uint8Array(input)

  return new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw signal.reason instanceof Error
      ? signal.reason
      : new DOMException('Decoding aborted', 'AbortError')
  }
}

function renderImage(handle: LibheifImage): Promise<ImageData> {
  const width = handle.get_width()
  const height = handle.get_height()
  const target = { data: new Uint8ClampedArray(width * height * 4), width, height }

  return new Promise<ImageData>((resolve, reject) => {
    handle.display(target, (result) => {
      if (!result) {
        reject(new HEICDecodeError('libheif failed to render the image (HEIF_ERR_*)'))
        return
      }
      resolve(new ImageData(target.data, width, height))
    })
  })
}

async function isHeif(input: HEICDecodeInput): Promise<boolean> {
  const bytes = await toBytes(input instanceof Blob ? input.slice(0, 32) : input)
  if (bytes.length < 12) return false

  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to))
  return ascii(4, 8) === 'ftyp' && HEIF_BRANDS.has(ascii(8, 12))
}

async function decode(input: HEICDecodeInput, options: HEICDecodeOptions = {}) {
  const { signal } = options
  throwIfAborted(signal)

  const [bytes, libheif] = await Promise.all([toBytes(input), loadLibheif()])
  throwIfAborted(signal)
  const decoder = new libheif.HeifDecoder()

  let handles: LibheifImage[]
  try {
    handles = decoder.decode(bytes)
  } catch (cause) {
    throw new HEICDecodeError('Failed to parse HEIF container', { cause })
  }
  if (!handles || handles.length === 0) {
    throw new HEICDecodeError('No images found in HEIF file')
  }

  try {
    throwIfAborted(signal)
    return await renderImage(handles[0])
  } finally {
    for (const handle of handles) handle.free?.()
  }
}

export { isHeif, decode, HEICDecodeError }
