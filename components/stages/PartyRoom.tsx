import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

type PartyRoomProps = {
  handleBackToCategories: () => void
  openPhotoBooth: () => void
  setShowSongList: (show: boolean) => void
  friendName: string
}

const PartyRoom = ({ 
  handleBackToCategories, 
  openPhotoBooth, 
  setShowSongList,
  friendName 
}: PartyRoomProps) => {
  const [danceMode, setDanceMode] = useState(false)
  const [dancingEmojis, setDancingEmojis] = useState<string[]>([])
  
  // Emoji options for dance floor
  const partyEmojis = ["🕺", "💃", "🎉", "🥳", "✨", "🎵", "🎊", "🎂", "🎁", "🍾"]
  
  // Toggle dance party mode
  const toggleDanceMode = () => {
    if (!danceMode) {
      // Launch confetti when dance mode is turned on
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      // Generate random dancing emojis
      const newDancingEmojis = Array.from({ length: 20 }, () => 
        partyEmojis[Math.floor(Math.random() * partyEmojis.length)]
      )
      setDancingEmojis(newDancingEmojis)
    }
    setDanceMode(!danceMode)
  }
  
  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Party room decorations - visible at all times */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Static decorations */}
        <div className="absolute top-5 left-[10%] text-4xl rotate-[-15deg]">🎈</div>
        <div className="absolute top-8 left-[30%] text-3xl">✨</div>
        <div className="absolute top-10 right-[25%] text-4xl rotate-[10deg]">🎈</div>
        <div className="absolute top-12 right-[15%] text-3xl">🎊</div>
        <div className="absolute bottom-10 left-[20%] text-4xl rotate-[15deg]">🎁</div>
        <div className="absolute bottom-12 left-[40%] text-3xl">🎉</div>
        <div className="absolute bottom-8 right-[35%] text-4xl rotate-[-10deg]">🎈</div>
        <div className="absolute bottom-15 right-[10%] text-3xl">🎊</div>
        
        {/* Dance floor emojis - only visible in dance mode */}
        <AnimatePresence>
          {danceMode && dancingEmojis.map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                y: Math.random() * -50, // Target y offset
                x: Math.random() * 50 - 25, // Target x offset
                opacity: 1,
                rotate: [0, Math.random() * 40 - 20, 0],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror", // Oscillate back and forth
                  duration: 1.5 + Math.random(),
                  delay: Math.random() * 0.5
                }
              }}
              exit={{ opacity: 0 }}
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <motion.div
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-pink-300 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative background */}
        <div className={`absolute inset-0 bg-gradient-to-r from-pink-100/50 to-purple-100/50 transition-opacity duration-1000 ${danceMode ? 'opacity-100' : 'opacity-20'}`}></div>
        
        {/* Content */}
        <div className="relative z-10">
          <motion.div className="text-center text-5xl mb-6" variants={itemVariants}>
            🎉
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
            variants={itemVariants}
          >
            {friendName}'s Virtual Party Room
          </motion.h2>
          
          <motion.div 
            className={`p-6 rounded-xl mb-8 text-center transition-all duration-500 ${danceMode ? 'bg-gradient-to-r from-pink-200 to-purple-200 shadow-inner' : 'bg-gray-50'}`}
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-700">
              {danceMode ? "Dance Party Mode: ON! 🕺💃" : "Welcome to your party space!"}
            </h3>
            
            <p className="text-gray-700 mb-4">
              {danceMode 
                ? "The dance floor is yours! Click the buttons below to add more to your party."
                : "This is your special birthday space to celebrate. Turn on dance mode to start the party!"}
            </p>
            
            <motion.button
              onClick={toggleDanceMode}
              className={`px-6 py-3 font-bold rounded-full shadow-md transition-all duration-300 ${
                danceMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {danceMode ? "Turn Off Dance Mode" : "Start Dance Party!"}
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setShowSongList(true)}
              className="p-4 bg-pink-100 hover:bg-pink-200 rounded-xl flex items-center justify-center shadow transition-colors"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-3xl mr-3">🎵</div>
              <div className="text-left">
                <p className="font-bold text-pink-700">Birthday Playlist</p>
                <p className="text-sm text-pink-600">Choose your favorite songs</p>
              </div>
            </motion.button>
            
            <motion.button
              onClick={openPhotoBooth}
              className="p-4 bg-purple-100 hover:bg-purple-200 rounded-xl flex items-center justify-center shadow transition-colors"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-3xl mr-3">📸</div>
              <div className="text-left">
                <p className="font-bold text-purple-700">Photo Booth</p>
                <p className="text-sm text-purple-600">Capture birthday memories</p>
              </div>
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
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
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PartyRoom