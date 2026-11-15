interface ConvertedFile {
  blob: Blob
  name: string
}

export type FileType = 'JPEG' | 'PNG' | 'HEIC' | 'WebP' | 'AVIF'

export interface FileItem {
  id: string
  file: File
  name: string
  format: FileType
  status: 'ready' | 'converting' | 'completed'
  converted?: ConvertedFile
}
