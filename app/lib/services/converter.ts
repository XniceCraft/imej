import { decode } from './decoder'
import { encode } from './encoder'

import type { FileType, OutputFileType } from '@/types/file'

async function convert({
  file,
  fileType,
  outputType,
  quality,
  onProgress,
}: {
  file: File
  fileType: FileType
  outputType: OutputFileType
  quality: number
  onProgress?: (percentage: number) => void
}): Promise<Blob> {
  const imageData = await decode({ file, fileType })
  onProgress?.(33)

  const blob = await encode({ imageData, fileType: outputType, quality })
  onProgress?.(100)

  return blob
}

export { convert }
