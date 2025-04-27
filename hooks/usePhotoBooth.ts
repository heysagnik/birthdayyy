import { useRef, useState, useCallback, useEffect } from 'react'

type UsePhotoBoothProps = {
  onPhotoCapture?: (photoData: string) => void
}

export const usePhotoBooth = ({ onPhotoCapture }: UsePhotoBoothProps = {}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        })
        
        streamRef.current = stream
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsInitialized(true)
                  setIsStreaming(true)
                })
                .catch(err => {
                  console.error('Error playing video:', err)
                })
            }
          }
        }
      } else {
        console.error('getUserMedia is not supported in this browser')
      }
    } catch (err) {
      console.error('Error initializing camera:', err)
      setIsInitialized(false)
    }
  }, [facingMode])

  // Take a photo
  const takePhoto = useCallback((filterType = 'none') => {
    if (!canvasRef.current || !videoRef.current || !isStreaming) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Draw the video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Apply filter effect to canvas if needed
    try {
      if (filterType !== 'none') {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext('2d')
        
        if (tempCtx) {
          // Draw original image to temp canvas
          tempCtx.drawImage(canvas, 0, 0)
          
          // Apply filter based on selected type
          switch (filterType) {
            case 'sepia':
              applySepia(tempCtx, canvas.width, canvas.height)
              break
            case 'grayscale':
              applyGrayscale(tempCtx, canvas.width, canvas.height)
              break
            case 'saturate':
              applySaturate(tempCtx, canvas.width, canvas.height)
              break
          }
          
          // Draw filtered image back to main canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(tempCanvas, 0, 0)
        }
      }
    } catch (err) {
      console.error('Error applying filter:', err)
    }
    
    // Convert canvas to data URL
    const data = canvas.toDataURL('image/png')
    setPhotoData(data)
    
    // Call the callback if provided
    if (onPhotoCapture) {
      onPhotoCapture(data)
    }
    
    return data
  }, [isStreaming, onPhotoCapture])

  // Filter functions
  const applySepia = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
  
  const applyGrayscale = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg
      data[i + 1] = avg
      data[i + 2] = avg
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
  
  const applySaturate = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    const saturationFactor = 1.5
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Convert to HSL
      const [h, s, l] = rgbToHsl(r, g, b)
      
      // Increase saturation
      const newS = Math.min(1, s * saturationFactor)
      
      // Convert back to RGB
      const [newR, newG, newB] = hslToRgb(h, newS, l)
      
      data[i] = newR
      data[i + 1] = newG
      data[i + 2] = newB
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
  
  // Helper functions for color conversion
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      
      h /= 6
    }
    
    return [h, s, l]
  }
  
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  // Reset photo
  const resetPhoto = useCallback(() => {
    setPhotoData(null)
  }, [])

  // Switch camera
  const switchCamera = useCallback(() => {
    // First stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    // Toggle facing mode
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setIsStreaming(false)
    setIsInitialized(false)
  }, [])

  // Re-initialize camera when facing mode changes
  useEffect(() => {
    if (isInitialized) {
      initializeCamera()
    }
  }, [facingMode, initializeCamera, isInitialized])

  return {
    videoRef,
    canvasRef,
    photoData,
    isInitialized,
    isStreaming,
    initializeCamera,
    takePhoto,
    resetPhoto,
    switchCamera,
    stopCamera
  }
}