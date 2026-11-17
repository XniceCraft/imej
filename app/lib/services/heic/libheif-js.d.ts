interface LibheifImageData {
  data: Uint8ClampedArray
  width: number
  height: number
}

interface LibheifImage {
  get_width(): number
  get_height(): number
  display(target: LibheifImageData, callback: (result: LibheifImageData | null) => void): void
  free?(): void
}

declare module 'libheif-js/wasm-bundle' {
  const libheif: {
    HeifDecoder: new () => {
      decode(data: Uint8Array): LibheifImage[]
    }
  }
  export default libheif
}
