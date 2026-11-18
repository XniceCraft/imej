import { useCallback, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLineDownIcon,
  CheckCircleIcon,
  RepeatIcon,
  UploadIcon,
  WarningCircleIcon,
  XIcon,
} from '@phosphor-icons/react/ssr'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/mini'

import { detectFileType, outputFileTypes } from '@/lib/file-types'
import { convert } from '@/lib/services/converter'
import { createZipBlob } from '@/lib/services/zip'

import type { OutputFileType } from '@/types/file'

const OUTPUT_EXT: Record<OutputFileType, string> = {
  JPEG: 'jpg',
  PNG: 'png',
  WebP: 'webp',
  AVIF: 'avif',
}

type FileConvertState =
  | { status: 'idle' }
  | { status: 'converting'; progress: number }
  | { status: 'done'; blob: Blob; outputName: string }
  | { status: 'error'; message: string }

const convertSchema = z.object({
  files: z.array(
    z.file().check(z.mime(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic']))
  ),
  imageType: z.enum(['JPEG', 'PNG', 'WebP', 'AVIF'] as const),
  quality: z.int().check(z.minimum(40), z.maximum(100)),
  scale: z.number().check(z.minimum(0.25), z.maximum(1)),
})

export function Converter() {
  const [fileStates, setFileStates] = useState<Map<File, FileConvertState>>(new Map())

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof convertSchema>>({
    resolver: zodResolver(convertSchema),
    defaultValues: {
      files: [],
      imageType: 'JPEG',
      quality: 100,
      scale: 1,
    },
  })

  const setFileState = useCallback((file: File, state: FileConvertState) => {
    setFileStates((prev) => new Map(prev).set(file, state))
  }, [])

  const onSubmit = useCallback(
    async (data: z.infer<typeof convertSchema>) => {
      const outputType = data.imageType as OutputFileType
      const ext = OUTPUT_EXT[outputType]

      setFileStates(() => {
        const next = new Map<File, FileConvertState>()
        for (const file of data.files) {
          next.set(file, { status: 'converting', progress: 0 })
        }
        return next
      })

      const results: Array<{ name: string; blob: Blob }> = []

      await Promise.all(
        data.files.map(async (file) => {
          const fileType = detectFileType(file)
          if (!fileType) {
            setFileState(file, { status: 'error', message: 'Unsupported file type' })
            return
          }

          try {
            const blob = await convert({
              file,
              fileType,
              outputType,
              quality: data.quality,
              onProgress: (pct) => {
                setFileState(file, { status: 'converting', progress: pct })
              },
            })

            const baseName = file.name.replace(/\.[^.]+$/, '')
            const outputName = `${baseName}.${ext}`
            setFileState(file, { status: 'done', blob, outputName })
            results.push({ name: outputName, blob })
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Conversion failed'
            setFileState(file, { status: 'error', message })
          }
        })
      )

      // Auto-download: single file → direct, multiple → zip
      const succeeded = results
      if (succeeded.length === 0) return

      if (succeeded.length === 1) {
        triggerDownload(succeeded[0]!.blob, succeeded[0]!.name)
      } else {
        const zip = await createZipBlob(succeeded)
        triggerDownload(zip, 'converted-images.zip')
      }
    },
    [setFileState]
  )

  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-6 gap-5 px-6 py-12 sm:px-4">
      <Controller
        name="files"
        control={control}
        render={({ field }) => (
          <FileUpload
            accept="image/jpeg, image/png, image/webp, image/avif, image/heic"
            value={field.value}
            onValueChange={(files) => {
              field.onChange(files)
              // Remove states for files that were removed
              setFileStates((prev) => {
                const fileSet = new Set(files)
                const next = new Map<File, FileConvertState>()
                for (const [f, s] of prev) {
                  if (fileSet.has(f)) next.set(f, s)
                }
                return next
              })
            }}
            className="col-span-6 space-y-4 md:col-span-4"
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <UploadIcon className="text-muted-foreground size-6" />
                </div>
                <p className="text-sm font-medium">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">Or click to browse</p>
                <p className="text-muted-foreground text-xs">JPEG, PNG, WebP, AVIF, and HEIC</p>
              </div>
              <FileUploadTrigger
                render={(props) => (
                  <Button variant="outline" size="sm" className="mt-2 w-fit" {...props}>
                    Browse files
                  </Button>
                )}
              />
            </FileUploadDropzone>

            <Card>
              {field.value.length !== 0 && (
                <>
                  <CardHeader>
                    <CardTitle>Queue</CardTitle>
                    <CardAction>
                      <FileUploadClear disabled={isSubmitting}>Clear</FileUploadClear>
                    </CardAction>
                  </CardHeader>
                  <Separator />
                </>
              )}
              <CardContent>
                <FileUploadList>
                  {field.value.map((file) => {
                    const state = fileStates.get(file) ?? { status: 'idle' }
                    return (
                      <FileUploadItem key={file.name} value={file}>
                        <FileUploadItemPreview />
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <FileUploadItemMetadata />
                          {state.status === 'converting' && (
                            <div
                              role="progressbar"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={state.progress}
                              className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full"
                            >
                              <div
                                className="bg-primary h-full transition-transform duration-300 ease-linear"
                                style={{
                                  transform: `translateX(-${100 - state.progress}%)`,
                                }}
                              />
                            </div>
                          )}
                          {state.status === 'error' && (
                            <span className="text-destructive flex items-center gap-1 text-xs">
                              <WarningCircleIcon size={12} />
                              {state.message}
                            </span>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {state.status === 'done' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-green-600"
                              title="Download"
                              onClick={() => triggerDownload(state.blob, state.outputName)}
                            >
                              <ArrowLineDownIcon size={14} />
                            </Button>
                          )}
                          {state.status === 'converting' && (
                            <span className="text-muted-foreground flex size-7 items-center justify-center text-xs">
                              {state.progress}%
                            </span>
                          )}
                          {state.status === 'error' && (
                            <WarningCircleIcon
                              size={16}
                              className="text-destructive mx-1"
                              weight="fill"
                            />
                          )}
                          {state.status === 'done' && (
                            <CheckCircleIcon
                              size={16}
                              className="mx-1 text-green-600"
                              weight="fill"
                            />
                          )}
                          <FileUploadItemDelete
                            disabled={isSubmitting}
                            render={(props) => (
                              <Button variant="ghost" size="icon" className="size-7" {...props}>
                                <XIcon />
                              </Button>
                            )}
                          />
                        </div>
                      </FileUploadItem>
                    )
                  })}
                </FileUploadList>
                {field.value.length === 0 && (
                  <>
                    <div className="border-muted text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-full border">
                      <XIcon size={16} />
                    </div>
                    <p className="text-muted-foreground text-center text-sm">
                      No files in queue. Drop files above to begin.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </FileUpload>
        )}
      />
      <div className="col-span-6 md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Output Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="convert-form" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="imageType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Convert To</FieldLabel>
                      <div className="grid grid-cols-3 gap-1.5">
                        {outputFileTypes.map((fileType) => (
                          <Button
                            key={fileType}
                            type="button"
                            variant={field.value === fileType ? 'default' : 'outline'}
                            disabled={field.disabled || isSubmitting}
                            onClick={() => field.onChange(fileType)}
                          >
                            {fileType}
                          </Button>
                        ))}
                      </div>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="quality"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel>Quality</FieldLabel>
                        <Badge variant="outline">{field.value}%</Badge>
                      </div>
                      <Slider
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        min={40}
                        max={100}
                        step={1}
                        disabled={isSubmitting}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {/* <Controller
                  name="scale"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel>Scale</FieldLabel>
                        <Badge variant="outline">{field.value}x</Badge>
                      </div>
                      <Slider
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        min={0.25}
                        max={1}
                        step={0.25}
                        disabled={isSubmitting}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                /> */}
              </FieldGroup>
            </form>
          </CardContent>
          <Separator />
          <CardFooter>
            <Controller
              name="files"
              control={control}
              render={({ field }) => (
                <Button
                  type="submit"
                  form="convert-form"
                  disabled={isSubmitting || field.value.length === 0}
                  className="w-full"
                >
                  <RepeatIcon size={16} weight="bold" />
                  {isSubmitting ? 'Converting…' : 'Convert Images'}
                </Button>
              )}
            />
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
