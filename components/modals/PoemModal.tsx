import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

type PoemModalProps = {
  showPoem: boolean
  setShowPoem: (show: boolean) => void
  friendName: string
}

const PoemModal = ({
  showPoem,
  setShowPoem,
  friendName
}: PoemModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [typedPoem, setTypedPoem] = useState("")
  const [typingComplete, setTypingComplete] = useState(false)
  
  // The birthday poem lines - personalized with friend's name
  const poemLines = [
    `Happy Birthday, dear ${friendName}!`,
    "On this special day of yours,",
    "May sunshine fill your heart with warmth,",
    "And joy that forever endures.",
    "",
    "Another year of laughter shared,",
    "Of memories that we hold dear,",
    "Of friendship that grows ever strong,",
    "With each passing year.",
    "",
    "Here's to celebrating you today,",
    "And all the wonderful things you do,",
    "May this birthday bring you happiness,",
    "And all your dreams come true!"
  ]
  
  const fullPoem = poemLines.join("\n")
  
  // Typing effect for the poem
  useEffect(() => {
    if (showPoem && typedPoem.length < fullPoem.length) {
      const typingTimer = setTimeout(() => {
        setTypedPoem(fullPoem.slice(0, typedPoem.length + 1))
      }, 30) // Speed of typing
      
      return () => clearTimeout(typingTimer)
    } else if (typedPoem.length === fullPoem.length) {
      setTypingComplete(true)
    }
  }, [showPoem, typedPoem, fullPoem])
  
  // Reset typed poem when modal is closed
  useEffect(() => {
    if (!showPoem) {
      setTypedPoem("")
      setTypingComplete(false)
    }
  }, [showPoem])
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowPoem(false)
      }
    }
    
    if (showPoem) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPoem, setShowPoem])
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      transition: { 
        type: "spring", 
        damping: 15,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      rotateY: 20,
      transition: { duration: 0.3 }
    }
  }

  return (
    <AnimatePresence>
      {showPoem && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            ref={modalRef}
            className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border-2 border-pink-300 relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ perspective: "1000px" }}
          >
            {/* Decorative Paper Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-purple-50 rounded-2xl"></div>
            <div className="absolute inset-4 border-2 border-dashed border-pink-200 rounded-xl opacity-30"></div>
            
            {/* Close button */}
            <button
              onClick={() => setShowPoem(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors z-10"
            >
              <X size={20} className="text-pink-500" />
            </button>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div 
                className="text-4xl mb-4 inline-block"
                initial={{ rotate: 0, y: 0 }}
                animate={{ rotate: [0, 5, 0, -5, 0], y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              >
                📝
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                A Birthday Poem For You
              </h2>
              
              <div className="bg-white/80 p-5 rounded-xl text-left mb-6 min-h-[250px] font-handwriting relative overflow-hidden">
                {typedPoem.split("\n").map((line, index) => (
                  <div key={index} className={line === "" ? "h-4" : ""}>
                    {line}
                  </div>
                ))}
                
                {!typingComplete && (
                  <motion.div
                    className="inline-block w-0.5 h-5 bg-gray-600 ml-1"
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  />
                )}
                
                {typingComplete && (
                  <motion.div
                    className="absolute bottom-3 right-3 text-2xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: [0, 15, 0] }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    ✨
                  </motion.div>
                )}
              </div>
              
              <div className="flex justify-center">
                <motion.button
                  onClick={() => setShowPoem(false)}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!typingComplete}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: typingComplete ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Close Poem
                </motion.button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-3 left-3 text-3xl opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ✿
            </motion.div>
            <motion.div 
              className="absolute bottom-3 right-3 text-3xl opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ✿
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PoemModal