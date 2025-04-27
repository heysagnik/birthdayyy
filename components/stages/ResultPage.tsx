import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { useEffect } from "react"

type ResultPageProps = {
  selectedDish: string
  selectedPlace: string
  handleTryAgain: () => void
  handleBackToCategories: () => void
  setShowMessage: (show: boolean) => void
  friendName: string
}

const ResultPage = ({
  selectedDish,
  selectedPlace,
  handleTryAgain,
  handleBackToCategories,
  setShowMessage,
  friendName
}: ResultPageProps) => {
  // Launch confetti on component mount
  useEffect(() => {
    const duration = 2 * 1000
    const end = Date.now() + duration
    
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
      })
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
      })
      
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    
    frame()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12
      }
    }
  }

  // New floating animation for decorative elements
  const floatingAnimation = {
    initial: { y: 0 },
    animate: { 
      y: [0, -10, 0], 
      transition: { 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  }

  const bounceAnimation = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1], 
      transition: { 
        duration: 1.5, 
        repeat: Infinity,
        repeatType: "reverse" as "reverse"
      }
    }
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-pink-50 to-purple-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Floating balloons - responsive positioning */}
      <motion.div 
        className="absolute top-5 sm:top-10 left-5 sm:left-10 text-3xl sm:text-4xl"
        {...floatingAnimation}
        transition={{ delay: 0.5 }}
      >
        🎈
      </motion.div>
      <motion.div 
        className="absolute top-10 sm:top-20 right-5 sm:right-20 text-4xl sm:text-5xl"
        {...floatingAnimation}
        transition={{ delay: 1 }}
      >
        🎈
      </motion.div>
      <motion.div 
        className="absolute bottom-10 sm:bottom-20 left-1/4 text-3xl sm:text-4xl hidden sm:block"
        {...floatingAnimation}
        transition={{ delay: 1.5 }}
      >
        🎈
      </motion.div>
      
      <motion.div
        className="max-w-xs sm:max-w-sm md:max-w-xl w-full bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border-2 border-pink-300 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative patterns - adjusted for mobile */}
        <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-pink-100 rounded-br-full opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-purple-100 rounded-tl-full opacity-60"></div>
        <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-yellow-100 rounded-bl-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-tr-full opacity-60"></div>
        
        {/* Birthday cake icon with bounce */}
        <motion.div 
          className="text-center text-5xl sm:text-6xl mb-4 sm:mb-6 flex justify-center"
          variants={itemVariants}
          {...bounceAnimation}
        >
          🎂
        </motion.div>
        
        <motion.h2 
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
          variants={itemVariants}
        >
          Birthday Treat Recommendation
        </motion.h2>
        
        <motion.div 
          className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 shadow-inner border-2 border-dashed border-pink-200"
          variants={itemVariants}
        >
          <div className="flex items-center mb-2">
            <span className="text-xl sm:text-2xl mr-2">🍽️</span>
            <p className="text-base sm:text-lg text-gray-700">
              <span className="font-semibold">Recommended Dish:</span>
            </p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-pink-600 mb-3 sm:mb-4 pl-8 sm:pl-10">
            {selectedDish}
          </p>
          
          <div className="flex items-center mb-2">
            <span className="text-xl sm:text-2xl mr-2">🏙️</span>
            <p className="text-base sm:text-lg text-gray-700">
              <span className="font-semibold">Perfect Place:</span>
            </p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-purple-600 pl-8 sm:pl-10">
            {selectedPlace}
          </p>
        </motion.div>
        
        <motion.p 
          className="text-center text-gray-600 mb-4 sm:mb-6 italic text-sm sm:text-base"
          variants={itemVariants}
        >
          <span className="text-lg sm:text-xl">✨</span> A special treat for <span className="font-bold text-pink-500">{friendName}'s</span> special day! <span className="text-lg sm:text-xl">✨</span>
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-3"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleTryAgain}
            className="px-4 sm:px-5 py-2 bg-white text-pink-600 border-2 border-pink-300 font-medium rounded-full shadow-md hover:bg-pink-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Try Another
          </motion.button>
          
          <motion.button
            onClick={() => setShowMessage(true)}
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base w-full sm:w-auto mt-2 sm:mt-0"
            whileHover={{ scale: 1.05, rotate: 3, boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            💌 Birthday Message
          </motion.button>
          
          <motion.button
            onClick={handleBackToCategories}
            className="px-4 sm:px-5 py-2 bg-white text-purple-600 border-2 border-purple-300 font-medium rounded-full shadow-md hover:bg-purple-50 transition-colors text-sm sm:text-base w-full sm:w-auto mt-2 sm:mt-0"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            🔙 Back to Categories
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ResultPage