import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import confetti from "canvas-confetti"

type MessageModalProps = {
  showMessage: boolean
  setShowMessage: (show: boolean) => void
  selectedDish: string | null
  selectedPlace: string | null
  friendName: string
}

const MessageModal = ({
  showMessage,
  setShowMessage,
  selectedDish,
  selectedPlace,
  friendName
}: MessageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowMessage(false)
      }
    }
    
    if (showMessage) {
      document.addEventListener("mousedown", handleClickOutside)
      
      // Trigger confetti when modal opens
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMessage, setShowMessage])

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
  
  const modalVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", damping: 15 }
    },
    exit: { 
      y: -50, 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  }

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            ref={modalRef}
            className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border-2 border-pink-300 relative overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-pink-100 rounded-br-full opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-100 rounded-tl-full opacity-40"></div>
            
            {/* Close button */}
            <button
              onClick={() => setShowMessage(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors z-10"
            >
              <X size={20} className="text-pink-500" />
            </button>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-6">
                <motion.div 
                  className="text-5xl mb-4 inline-block"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, -10, 0, 10, 0] }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  🎂
                </motion.div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Birthday Message for {friendName}
                </h2>
              </div>
              
              <div className="p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl mb-6">
                {selectedDish && selectedPlace ? (
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Hey {friendName}! Hope you're having a fantastic birthday! 
                    How about we celebrate with some delicious <span className="font-bold text-pink-600">{selectedDish}</span> at <span className="font-bold text-purple-600">{selectedPlace}</span>? 
                    It'll be my treat for your special day! Let me know when you're free, and we'll make it happen!
                  </p>
                ) : (
                  <p className="text-lg text-gray-700">
                    Hey {friendName}! Wishing you the happiest of birthdays! May your day be filled with joy, laughter, and wonderful memories.
                  </p>
                )}
              </div>
              
              <div className="text-center">
                <motion.button
                  onClick={() => setShowMessage(false)}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close Message
                </motion.button>
              </div>
            </div>
            
            {/* Floating balloons animation */}
            <div className="absolute -top-4 left-10 text-xl">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎈
              </motion.div>
            </div>
            <div className="absolute -top-4 right-10 text-xl">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -5, 0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                🎈
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MessageModal