import type { FileType } from '@/types/file'

export const fileTypes = ['JPEG', 'PNG', 'WebP', 'AVIF']

export const outputFileTypes = ['JPEG', 'PNG', 'HEIC', 'WebP', 'AVIF']

export function detectFileType(file: File): FileType | null {
  const ext = file.name.split('.').pop()?.toUpperCase() ?? ''

  if (ext === 'JPG' || ext === 'JPEG') return 'JPEG'
  if (ext === 'PNG') return 'PNG'
  if (ext === 'WEBP') return 'WebP'
  if (ext === 'AVIF') return 'AVIF'
  if (ext === 'HEIC' || ext === 'HEIF') return 'HEIC'

  return null
}
