import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Memory = {
  id?: number | string
  image: string
  caption: string
}

type MemoryLaneProps = {
  handleBackToCategories: () => void
  memoryLanes: Memory[]
}

const MemoryLane = ({ handleBackToCategories, memoryLanes }: MemoryLaneProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  
  // Get current memory
  const currentMemory = memoryLanes[currentIndex]
  
  // Handle navigation
  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => 
      prevIndex === memoryLanes.length - 1 ? 0 : prevIndex + 1
    )
  }
  
  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? memoryLanes.length - 1 : prevIndex - 1
    )
  }
  
  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  }
  
  // Pagination dots
  const renderPaginationDots = () => {
    return (
      <div className="flex justify-center space-x-2 mt-4">
        {memoryLanes.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-pink-500' : 'bg-gray-300'
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <motion.div
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border-2 border-pink-300"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
      >
        <motion.div 
          className="text-center text-5xl mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          📸
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Memory Lane
        </motion.h2>
        
        {/* Slideshow with navigation */}
        <div className="relative overflow-hidden rounded-xl mb-6">
          {/* Memory slide */}
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full"
            >
              <div className="bg-gradient-to-b from-pink-50 to-purple-50 rounded-xl overflow-hidden shadow-lg">
                {/* Image */}
                <div className="relative w-full h-64 md:h-80 overflow-hidden">
                  <img 
                    src={currentMemory.image} 
                    alt="Memory" 
                    className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 text-lg">
                    {currentMemory.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <motion.button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} className="text-purple-700" />
          </motion.button>
          
          <motion.button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} className="text-purple-700" />
          </motion.button>
        </div>
        
        {/* Pagination dots */}
        {renderPaginationDots()}
        
        {/* Memory counter */}
        <div className="text-center text-gray-500 text-sm mb-6">
          Memory {currentIndex + 1} of {memoryLanes.length}
        </div>

        {/* Pagination text for context */}
        <div className="flex justify-center mb-6">
          <div className="bg-pink-100 text-pink-800 text-sm px-4 py-2 rounded-full">
            Swipe through your memories together
          </div>
        </div>
        
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={handleBackToCategories}
            className="px-6 py-2 bg-white text-purple-600 border-2 border-purple-300 font-medium rounded-full shadow-md hover:bg-purple-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Categories
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default MemoryLane