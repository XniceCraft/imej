export class CodecLoadError extends Error {
  override name = 'CodecLoadError'

  constructor(
    readonly codec: string,
    cause: unknown
  ) {
    super(`Failed to load ${codec}`, { cause })
  }
}

export class CodecOperationError extends Error {
  override name = 'CodecOperationError'

  constructor(
    readonly operation: 'decode' | 'encode',
    readonly format: string,
    cause?: unknown,
    message?: string
  ) {
    super(message ?? `Failed to ${operation} ${format}`, { cause })
  }
}

export function createCodecLoader<T>(codec: string, importer: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined

  return () => {
    pending ??= importer().catch((cause) => {
      pending = undefined
      throw new CodecLoadError(codec, cause)
    })
    return pending
  }
}
