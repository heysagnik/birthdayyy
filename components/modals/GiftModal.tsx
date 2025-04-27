import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import confetti from "canvas-confetti"

type GiftModalProps = {
  showGift: boolean
  setShowGift: (show: boolean) => void
  openGift: () => void
  friendName: string
}

const GiftModal = ({
  showGift,
  setShowGift,
  openGift,
  friendName
}: GiftModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isOpened, setIsOpened] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowGift(false)
      }
    }
    
    if (showGift) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showGift, setShowGift])
  
  // Reset state when modal closes
  useEffect(() => {
    if (!showGift) {
      setTimeout(() => {
        setIsOpened(false)
        setIsRevealed(false)
      }, 300)
    }
  }, [showGift])
  
  // Handle gift opening with confetti
  const handleOpenGift = () => {
    setIsOpened(true)
    
    // Launch confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }
    
    // Create multiple confetti bursts
    const confettiBurst = () => {
      const timeLeft = animationEnd - Date.now()
      
      if (timeLeft <= 0) return
      
      confetti({
        particleCount: 30,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.3, 0.7),
          y: randomInRange(0.5, 0.7)
        },
        colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#9370DB', '#BA55D3', '#FFD700'],
        ticks: 60,
        zIndex: 100
      })
      
      if (timeLeft > 0) {
        requestAnimationFrame(confettiBurst)
      }
    }
    
    confettiBurst()
    
    // Reveal gift content after animation
    setTimeout(() => {
      setIsRevealed(true)
    }, 1500)
  }
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
  
  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", damping: 15 }
    },
    exit: { 
      y: -50, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }
  
  const giftVariants = {
    closed: { scale: 1 },
    opening: { 
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, -5, 5, -3, 0],
      transition: { duration: 1 }
    }
  }
  
  const lidVariants = {
    closed: { rotateX: 0, y: 0 },
    opening: {
      rotateX: -30,
      y: -80,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }
  
  const surpriseVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.5 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  }

  return (
    <AnimatePresence>
      {showGift && (
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
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-100 rounded-br-full opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-100 rounded-tl-full opacity-40"></div>
            
            {/* Close button */}
            <button
              onClick={() => setShowGift(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors z-10"
            >
              <X size={20} className="text-pink-500" />
            </button>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                A Special Gift For {friendName}
              </h2>
              
              {!isOpened ? (
                <div className="mb-8">
                  <motion.div 
                    className="relative w-40 h-40 mx-auto mb-6 cursor-pointer"
                    variants={giftVariants}
                    initial="closed"
                    animate={isOpened ? "opening" : "closed"}
                    onClick={handleOpenGift}
                  >
                    {/* Gift box */}
                    <motion.div 
                      className="absolute bottom-0 w-40 h-32 bg-pink-500 rounded-md overflow-hidden"
                      style={{ 
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }}
                    >
                      {/* Gift box ribbon */}
                      <div className="absolute top-0 left-1/2 w-8 h-full bg-pink-600 -translate-x-1/2"></div>
                    </motion.div>
                    
                    {/* Gift lid */}
                    <motion.div 
                      className="absolute bottom-[128px] w-40 h-12 bg-pink-400 rounded-t-md"
                      style={{ 
                        transformOrigin: "bottom",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }}
                      variants={lidVariants}
                      initial="closed"
                      animate={isOpened ? "opening" : "closed"}
                    >
                      {/* Lid ribbon */}
                      <div className="absolute top-0 left-1/2 w-8 h-full bg-pink-600 -translate-x-1/2"></div>
                    </motion.div>
                    
                    {/* Gift bow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8">
                      <div className="absolute top-4 left-0 w-16 h-8 bg-purple-500 rounded-full"></div>
                      <div className="absolute top-4 left-0 w-16 h-8 bg-purple-500 rounded-full" style={{ transform: "rotate(90deg)" }}></div>
                      <div className="absolute top-4 left-1/2 w-6 h-6 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </motion.div>
                  
                  <p className="text-gray-600 italic">Click the gift to open it!</p>
                </div>
              ) : (
                <motion.div 
                  className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-8"
                  variants={surpriseVariants}
                  initial="hidden"
                  animate={isRevealed ? "visible" : "hidden"}
                >
                  <div className="text-5xl mb-4">🎵</div>
                  <h3 className="text-xl font-bold text-purple-700 mb-3">
                    A Spotify Premium Subscription!
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Enjoy your favorite music without interruptions for the next year! 
                    Check your email for the activation code.
                  </p>
                  
                  <div className="p-3 bg-white rounded-lg shadow-inner border border-purple-200">
                    <div className="font-mono text-lg font-bold text-pink-600 tracking-wide">
                      BDAYXYZ-2023-{friendName.toUpperCase().slice(0, 3)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      (This is a demo code - a real gift would have a working code)
                    </p>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                onClick={() => setShowGift(false)}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isRevealed ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                Thank You!
              </motion.button>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-20 left-5 text-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            >
              ✨
            </motion.div>
            <motion.div 
              className="absolute bottom-20 right-5 text-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GiftModal