import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Stage } from "@/app/page"
import confetti from "canvas-confetti"
import { Download, Share2 } from "lucide-react"

type PhotoBoothResultProps = {
  capturedPhoto: string
  handleBackToCategories: () => void
  setStage: (stage: Stage) => void
  friendName: string
}

const PhotoBoothResult = ({ 
  capturedPhoto, 
  handleBackToCategories,
  setStage,
  friendName
}: PhotoBoothResultProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Download photo function
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = capturedPhoto
    link.download = `${friendName}_birthday_photo_${new Date().getTime()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Improve share photo function with better browser support
  const handleShare = () => {
    try {
      if (navigator.share) {
        fetch(capturedPhoto)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `${friendName}_birthday_photo.png`, { type: "image/png" })
            
            // Prepare share data
            const shareData: { title: string; text: string; files?: File[] } = {
              title: `${friendName}'s Birthday Photo`,
              text: "Check out this awesome birthday photo!"
            }
            
            // Check if files sharing is supported
            if ('canShare' in navigator && navigator.canShare && navigator.canShare({ files: [file] })) {
              shareData.files = [file]
            }
            
            navigator.share(shareData)
              .catch(err => {
                console.error("Error sharing:", err)
                alert("Could not share the photo. Try downloading instead.")
              })
          })
          .catch(err => {
            console.error("Error preparing file:", err)
            alert("Could not prepare photo for sharing. Try downloading instead.")
          })
      } else {
        alert("Your browser doesn't support sharing. Try downloading the photo instead.")
      }
    } catch (error) {
      console.error("Share error:", error)
      alert("Could not share the photo. Try downloading instead.")
    }
  }
  
  // Launch celebration confetti on load
  useEffect(() => {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }, 500)
  }, [])

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
      
      <motion.div
        className="max-w-2xl w-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-pink-300"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 8 }}
      >
        <motion.div 
          className="text-center text-5xl mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          📸
        </motion.div>
        
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your Birthday Snapshot!
        </motion.h2>
        
        {/* Photo display */}
        <motion.div 
          className="rounded-xl overflow-hidden shadow-lg mb-6 border-4 border-white relative group"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src={capturedPhoto} 
            alt="Birthday snapshot" 
            className="w-full h-auto"
          />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 text-4xl transform -translate-y-1/4 translate-x-1/4 rotate-15 z-10">
            🎂
          </div>
          <div className="absolute bottom-0 left-0 text-4xl transform translate-y-1/4 -translate-x-1/4 rotate-[-15deg] z-10">
            🎁
          </div>
          
          {/* Photo frame decorative effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
        
        {/* Action buttons */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleDownload}
            className="flex items-center justify-center px-5 py-3 bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={18} className="mr-2" />
            Download
          </motion.button>
          
          <motion.button
            onClick={handleShare}
            className="flex items-center justify-center px-5 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Share2 size={18} className="mr-2" />
            Share
          </motion.button>
        </motion.div>
        
        {/* Navigation buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => setStage("partyRoom")}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Party Room
          </motion.button>
          
          <motion.button
            onClick={handleBackToCategories}
            className="px-5 py-2 bg-white text-purple-600 border-2 border-purple-300 font-medium rounded-full shadow-md hover:bg-purple-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Categories
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default PhotoBoothResult