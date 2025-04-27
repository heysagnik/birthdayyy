import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, RefreshCw, Download, Send } from "lucide-react"
import confetti from "canvas-confetti"
import { Stage } from "@/app/page"
import { usePhotoBooth } from "@/hooks/usePhotoBooth"

type PhotoBoothModalProps = {
  showPhotoBoothModal: boolean
  setShowPhotoBoothModal: (show: boolean) => void
  setCapturedPhoto: (photoData: string | null) => void
  setStage: (stage: Stage) => void
}

const PhotoBoothModal = ({
  showPhotoBoothModal,
  setShowPhotoBoothModal,
  setCapturedPhoto,
  setStage
}: PhotoBoothModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [filterType, setFilterType] = useState<string>("none")
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showControls, setShowControls] = useState(true) // State to manage control visibility
  
  // Photo booth hook
  const {
    videoRef,
    canvasRef,
    photoData,
    isInitialized,
    isStreaming,
    // facingMode, // TODO: Add facingMode state from the hook if available and update hook's return type
    initializeCamera,
    takePhoto,
    resetPhoto: hookResetPhoto, // Rename hook's reset to avoid conflict
    switchCamera,
    stopCamera
  } = usePhotoBooth({
    onPhotoCapture: (photo) => {
      // Play camera shutter sound
      new Audio("/sounds/camera-shutter.mp3").play().catch(err => console.error(err))
      setShowControls(false) // Hide controls after photo is taken
    }
  })
  
  // Initialize camera when modal opens
  useEffect(() => {
    if (showPhotoBoothModal && !isInitialized) {
      initializeCamera()
    }
    
    // Stop camera and reset state when modal closes
    return () => {
      if (!showPhotoBoothModal) {
        stopCamera()
        hookResetPhoto() // Reset photo data in hook
        setShowControls(true) // Ensure controls are shown next time
        setCountdown(null) // Reset countdown
      }
    }
  }, [showPhotoBoothModal, isInitialized, initializeCamera, stopCamera, hookResetPhoto])
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }
    
    if (showPhotoBoothModal) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPhotoBoothModal]) // Removed handleClose from dependency array as it's stable
  
  // Handle countdown for photo
  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timerId = window.setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null)) // Safer countdown update
      }, 1000)
      return () => clearTimeout(timerId)
    }

    // countdown reached zero → snap photo
    if (countdown === 0) {
      takePhoto(filterType)
      setCountdown(null) // Reset countdown state

      // mini‐confetti
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } })
    }

  }, [countdown, filterType, takePhoto])

  // Start photo countdown
  const startPhotoCountdown = () => {
    // ensure camera is streaming before countdown
    if (!isStreaming || countdown !== null) return // Prevent starting if already counting or not streaming
    setCountdown(3)
  }
  
  // Confirm photo selection
  const confirmPhoto = () => {
    if (photoData) {
      setCapturedPhoto(photoData)
      setShowPhotoBoothModal(false) // Close modal
      setStage("photoBoothResult") // Navigate to result stage
    }
  }

  // Reset photo state within the modal
  const resetPhoto = () => {
    hookResetPhoto() // Reset photo data in the hook
    setShowControls(true) // Show the initial controls again
  }
  
  // Close the modal
  const handleClose = () => {
    setShowPhotoBoothModal(false)
    // Cleanup is handled by the useEffect return function
  }
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", damping: 15 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  return (
    <AnimatePresence>
      {showPhotoBoothModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            ref={modalRef}
            className="bg-white max-w-3xl w-full p-3 sm:p-6 rounded-2xl shadow-xl border-2 border-pink-300 relative overflow-y-auto max-h-[90vh] sm:max-h-[85vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors z-20" // Increased z-index
            >
              <X size={20} className="text-pink-500" />
            </button>
            
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Birthday Photo Booth
              </h2>
              <p className="text-gray-600">Capture your special moment!</p>
            </div>
            
            {/* Main content */}
            <div className="relative">
              {/* Photo display area */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black mb-4">
                {/* Birthday frame decorations */}
                <div className="absolute inset-0 pointer-events-none z-10 border-[10px] sm:border-[20px] border-transparent"> {/* Adjusted border for mobile */}
                  {/* Corner decorations - Adjusted size/position for mobile */}
                  <div className="absolute top-0 left-0 w-10 h-10 sm:w-16 sm:h-16">
                    <div className="absolute w-full h-5 sm:h-8 bg-pink-400 opacity-60 rounded-br-full"></div>
                    <div className="absolute w-5 sm:w-8 h-full bg-pink-400 opacity-60 rounded-br-full"></div>
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 text-xl sm:text-3xl">🎂</div>
                  </div>
                  <div className="absolute top-0 right-0 w-10 h-10 sm:w-16 sm:h-16">
                    <div className="absolute right-0 w-full h-5 sm:h-8 bg-purple-400 opacity-60 rounded-bl-full"></div>
                    <div className="absolute right-0 w-5 sm:w-8 h-full bg-purple-400 opacity-60 rounded-bl-full"></div>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-xl sm:text-3xl">🎈</div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-16 sm:h-16">
                    <div className="absolute bottom-0 w-full h-5 sm:h-8 bg-pink-400 opacity-60 rounded-tr-full"></div>
                    <div className="absolute bottom-0 w-5 sm:w-8 h-full bg-pink-400 opacity-60 rounded-tr-full"></div>
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-xl sm:text-3xl">🎉</div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-16 sm:h-16">
                    <div className="absolute right-0 bottom-0 w-full h-5 sm:h-8 bg-purple-400 opacity-60 rounded-tl-full"></div>
                    <div className="absolute right-0 bottom-0 w-5 sm:w-8 h-full bg-purple-400 opacity-60 rounded-tl-full"></div>
                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-xl sm:text-3xl">🎁</div>
                  </div>
                </div>
                
                {/* Video stream when not captured */}
                {!photoData && (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    muted
                    // TODO: Add scaleX(-1) transform based on facingMode if the hook provides it. Example: ${facingMode === 'user' ? 'scaleX(-1)' : ''}
                    className={`w-full h-full object-cover transform ${ 
                      filterType === 'sepia' ? 'sepia' : 
                      filterType === 'grayscale' ? 'grayscale' :
                      filterType === 'saturate' ? 'saturate-150' : ''
                    }`}
                  />
                )}
                
                {/* Canvas for capture (remains hidden) */}
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Display captured photo */}
                {photoData && (
                  <img 
                    src={photoData} 
                    alt="Captured" 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Countdown overlay */}
                <AnimatePresence>
                  {countdown !== null && countdown > 0 && ( // Only show countdown number when > 0
                    <motion.div 
                      className="absolute inset-0 bg-black/40 flex items-center justify-center z-20" // Ensure countdown is on top
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="text-6xl sm:text-8xl font-bold text-white drop-shadow-lg" // Added drop shadow
                        initial={{ scale: 2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        key={countdown} // Key ensures animation runs for each number change
                      >
                        {countdown}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Bottom caption */}
                <div className="absolute bottom-0 left-0 right-0 text-center p-2 bg-gradient-to-t from-black/70 to-transparent z-10">
                  <div className="text-white text-sm sm:text-lg font-bold">Happy Birthday! 🎉</div>
                </div>
              </div>
              
              {/* Controls section - Different states based on photo capture */}
              <AnimatePresence mode="wait">
                {showControls ? (
                  <motion.div 
                    className="flex flex-col items-center gap-4" // Changed to column layout for controls
                    key="controls"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Filters selection */}
                    <div className="w-full flex flex-wrap justify-center mb-2 gap-1 sm:gap-2">
                      {[
                        { name: "none", label: "Normal" },
                        { name: "sepia", label: "Vintage" },
                        { name: "grayscale", label: "B&W" },
                        { name: "saturate", label: "Vibrant" }
                      ].map((filter) => (
                        <button
                          key={filter.name}
                          onClick={() => setFilterType(filter.name)}
                          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all ${
                            filterType === filter.name
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' // Added shadow to active
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Main controls */}
                    <div className="flex justify-center gap-4"> {/* Kept main buttons in a row */}
                      <motion.button
                        onClick={startPhotoCountdown}
                        className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={!isStreaming || countdown !== null}
                      >
                        <Camera size={24} />
                      </motion.button>
                      
                      <motion.button
                        onClick={switchCamera}
                        className="p-3 bg-white text-purple-600 border-2 border-purple-300 rounded-full shadow-md hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        disabled={!isStreaming || countdown !== null}
                      >
                        <RefreshCw size={24} />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex flex-wrap justify-center gap-3 mt-2"
                    key="photo-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.button
                      onClick={resetPhoto} // Use the modal's resetPhoto function
                      className="px-3 sm:px-5 py-1 sm:py-2 text-xs sm:text-sm bg-white text-gray-700 border-2 border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Retake Photo
                    </motion.button>
                    
                    <motion.button
                      onClick={confirmPhoto}
                      className="px-3 sm:px-5 py-1 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send size={14} className="mr-1 sm:mr-2" />
                      Use Photo
                    </motion.button>
                    
                    {photoData && (
                      <motion.a
                        href={photoData}
                        download="birthday_photo.png"
                        className="px-3 sm:px-5 py-1 sm:py-2 text-xs sm:text-sm bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download size={14} className="mr-1 sm:mr-2" />
                        Download
                      </motion.a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Camera not initialized state */}
            {!isInitialized && showPhotoBoothModal && ( // Only show if modal is intended to be visible
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl z-30"> {/* Increased z-index */}
                <div className="text-5xl mb-4 animate-pulse">📸</div> {/* Added pulse animation */}
                <h3 className="text-xl font-bold text-purple-700 mb-4">Camera Access Needed</h3>
                <p className="text-gray-600 mb-6 text-center max-w-md px-4"> {/* Added padding */}
                  Please allow camera access to use the photo booth!
                </p>
                <motion.button
                  onClick={initializeCamera}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enable Camera
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PhotoBoothModal