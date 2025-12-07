
/// <reference lib="webworker" />

export type ResizeRequest = {
  type: 'resize'
  messageId: string
  jobId: string
  width: number
  height: number
  src: string
  fileName: string
}

export type ResizeResponse = {
  messageId: string
  success: boolean
  buffer?: ArrayBuffer
  error?: string
}

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope

ctx.onmessage = async (event: MessageEvent) => {
  const data = event.data as ResizeRequest
  if (!data || data.type !== 'resize') return

  const { messageId, width, height, src } = data

  try {
    const response = await fetch(src)
    const blob = await response.blob()
    const bitmap = await createImageBitmap(blob)

    const offscreen = new OffscreenCanvas(width, height)
    const c2d = offscreen.getContext('2d')
    if (!c2d) {
      throw new Error('No 2D context')
    }

    c2d.clearRect(0, 0, width, height)

    const srcW = bitmap.width
    const srcH = bitmap.height
    const scale = Math.max(width / srcW, height / srcH)
    const drawW = srcW * scale
    const drawH = srcH * scale
    const offsetX = (width - drawW) / 2
    const offsetY = (height - drawH) / 2

    c2d.imageSmoothingEnabled = true
    c2d.imageSmoothingQuality = 'high'
    c2d.drawImage(bitmap, offsetX, offsetY, drawW, drawH)

    const outBlob = await offscreen.convertToBlob({ type: 'image/png' })

    const buffer = await outBlob.arrayBuffer()

    const responseMsg: ResizeResponse = {
      messageId,
      success: true,
      buffer
    }

    // Transfer the ArrayBuffer back to main thread
    ctx.postMessage(responseMsg, [buffer])
  } catch (err: any) {
    const responseMsg: ResizeResponse = {
      messageId,
      success: false,
      error: err?.message || 'Unknown worker error'
    }
    ctx.postMessage(responseMsg)
  }
}
