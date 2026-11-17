export type FileType = 'JPEG' | 'PNG' | 'HEIC' | 'WebP' | 'AVIF'

export type OutputFileType = Exclude<FileType, 'HEIC'>

export interface FileItem {
  file: File
  format: FileType
  status: 'ready' | 'converting' | 'completed'
}
