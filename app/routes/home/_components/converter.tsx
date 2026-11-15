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
import { RepeatIcon, UploadIcon, XIcon } from '@phosphor-icons/react/ssr'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/mini'

import { fileTypes } from '@/lib/config/file-types'

const convertSchema = z.object({
  files: z.array(
    z.file().check(z.mime(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic']))
  ),
  imageType: z.enum(fileTypes),
  quality: z.int().check(z.minimum(40), z.maximum(100)),
  scale: z.number().check(z.minimum(0.25), z.maximum(1)),
})

export function Converter() {
  const {
    control,
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
  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-6 gap-5 px-6 py-12 sm:px-4">
      <Controller
        name="files"
        control={control}
        render={({ field }) => (
          <FileUpload
            accept="image/jpeg, image/png, image/webp, image/avif, image/heic"
            value={field.value}
            onValueChange={field.onChange}
            className="col-span-4 space-y-4"
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
                      <FileUploadClear>Clear</FileUploadClear>
                    </CardAction>
                  </CardHeader>
                  <Separator />
                </>
              )}
              <CardContent>
                <FileUploadList>
                  {field.value.map((file) => (
                    <FileUploadItem key={file.name} value={file}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete
                        render={(props) => (
                          <Button variant="ghost" size="icon" className="size-7" {...props}>
                            <XIcon />
                          </Button>
                        )}
                      />
                    </FileUploadItem>
                  ))}
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
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Output Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Controller
                  name="imageType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Convert To</FieldLabel>
                      <div className="grid grid-cols-3 gap-1.5">
                        {fileTypes.map((fileType) => (
                          <Button
                            key={fileType}
                            type="button"
                            variant={field.value === fileType ? 'default' : 'outline'}
                            disabled={field.disabled}
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
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
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
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <Separator />
          <CardFooter>
            <Controller
              name="files"
              control={control}
              render={({ field }) => (
                <Button disabled={isSubmitting || field.value.length === 0} className="w-full">
                  <RepeatIcon size={16} weight="bold" />
                  Convert Images
                </Button>
              )}
            />
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
