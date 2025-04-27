import { useEffect } from "react"
import { motion } from "framer-motion"

type VideoSectionProps = {
  videoRef: React.RefObject<HTMLVideoElement>
  handleSkipVideo: () => void
  handleVideoEnd: () => void
}

const VideoSection = ({ videoRef, handleSkipVideo, handleVideoEnd }: VideoSectionProps) => {
  useEffect(() => {
    const videoElement = videoRef.current
    
    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd)
      return () => {
        videoElement.removeEventListener("ended", handleVideoEnd)
      }
    }
  }, [videoRef, handleVideoEnd])

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <motion.div 
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-pink-300 overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          transition: { type: "spring", damping: 12 }
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-purple-700">
          Happy Birthday Message! 🎉
        </h2>
        
        <div className="relative rounded-xl overflow-hidden aspect-video bg-black mb-4 shadow-lg">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            playsInline
            src="/birthday_video.mp4"
          />
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-pink-200 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-pink-200 to-transparent opacity-50"></div>
        </div>
        
        <div className="flex justify-center">
          <motion.button
            onClick={handleSkipVideo}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip Video →
          </motion.button>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4 italic">
          A special message just for you!
        </p>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-5xl animate-bounce">🎂</div>
      <div className="absolute bottom-10 right-10 text-5xl animate-pulse">🎁</div>
    </motion.div>
  )
}

export default VideoSection