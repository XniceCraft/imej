import { CodecOperationError, createCodecLoader } from './codec'

import type { OutputFileType } from '@/types/file'

type EncodeFn = (imageData: ImageData, quality: number) => Promise<Blob>

const loaders = {
  JPEG: createCodecLoader<EncodeFn>('JPEG encoder', async () => {
    const { encode } = await import('@jsquash/jpeg')
    return async (imageData, quality) =>
      new Blob([await encode(imageData, { quality })], { type: 'image/jpeg' })
  }),
  PNG: createCodecLoader<EncodeFn>('PNG encoder', async () => {
    const { encode } = await import('@jsquash/png')
    return async (imageData) => new Blob([await encode(imageData)], { type: 'image/png' })
  }),
  WEBP: createCodecLoader<EncodeFn>('WebP encoder', async () => {
    const { encode } = await import('@jsquash/webp')
    return async (imageData, quality) =>
      new Blob([await encode(imageData, { quality })], { type: 'image/webp' })
  }),
}

function getLoader(fileType: OutputFileType) {
  switch (fileType) {
    case 'JPEG':
      return loaders.JPEG
    case 'PNG':
      return loaders.PNG
    default:
      return loaders.WEBP
  }
}

export interface EncodeImageOptions {
  imageData: ImageData
  fileType: OutputFileType
  quality: number
}

export async function encode({ imageData, fileType, quality }: EncodeImageOptions): Promise<Blob> {
  const encode = await getLoader(fileType)()

  try {
    return await encode(imageData, quality)
  } catch (cause) {
    if (cause instanceof CodecOperationError) throw cause
    throw new CodecOperationError('encode', fileType, cause)
  }
}
