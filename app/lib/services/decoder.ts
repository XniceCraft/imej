import { CodecOperationError, createCodecLoader } from './codec'

import type { FileType } from '@/types/file'

type DecodeFn = (buffer: ArrayBuffer) => Promise<ImageData | null | undefined>

const loaders = {
  HEIC: createCodecLoader<DecodeFn>('HEIC decoder', async () => {
    const { decode } = await import('./heic/decode')
    return (buffer) => decode(buffer)
  }),
  AVIF: createCodecLoader<DecodeFn>('AVIF decoder', async () => {
    const { decode } = await import('@jsquash/avif')
    return (buffer) => decode(buffer)
  }),
  JPEG: createCodecLoader<DecodeFn>('JPEG decoder', async () => {
    const { decode } = await import('@jsquash/jpeg')
    return (buffer) => decode(buffer)
  }),
  PNG: createCodecLoader<DecodeFn>('PNG decoder', async () => {
    const { decode } = await import('@jsquash/png')
    return (buffer) => decode(buffer)
  }),
  WEBP: createCodecLoader<DecodeFn>('WebP decoder', async () => {
    const { decode } = await import('@jsquash/webp')
    return (buffer) => decode(buffer)
  }),
}

function getLoader(fileType: FileType) {
  switch (fileType) {
    case 'HEIC':
      return loaders.HEIC
    case 'AVIF':
      return loaders.AVIF
    case 'JPEG':
      return loaders.JPEG
    case 'PNG':
      return loaders.PNG
    default:
      return loaders.WEBP
  }
}

export async function decode({
  file,
  fileType,
}: {
  file: Blob
  fileType: FileType
}): Promise<ImageData> {
  const decode = await getLoader(fileType)()

  try {
    const buffer = await file.arrayBuffer()
    const imageData = await decode(buffer)
    if (!imageData) {
      throw new CodecOperationError(
        'decode',
        fileType,
        undefined,
        `Decoder returned no image for ${fileType}`
      )
    }
    return imageData
  } catch (cause) {
    if (cause instanceof CodecOperationError) throw cause
    throw new CodecOperationError('decode', fileType, cause)
  }
}
