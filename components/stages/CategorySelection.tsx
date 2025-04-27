import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { PlayfulButton } from "../ui/PlayfulButton"

type CategorySelectionProps = {
  handleCategorySelect: (category: string) => void
  generatePoem: () => void
  openGift: () => void
  openPhotoBooth: () => void
  setStage: (stage: any) => void
  countdownTime: { days: number; hours: number; minutes: number; seconds: number }
  countdownEnded: boolean
}

const CategorySelection = ({
  handleCategorySelect,
  generatePoem,
  openGift,
  openPhotoBooth,
  setStage,
  countdownTime,
  countdownEnded,
}: CategorySelectionProps) => {
  const [activeTab, setActiveTab] = useState("treats")
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Handle countdown celebration
  const handleCountdownCelebration = () => {
    setShowConfetti(true)
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
    confetti({
      ...defaults,
      particleCount: 200,
      origin: { x: 0.5, y: 0.5 },
    })
    
    // Stop confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000)
  }

  // Launch small confetti bursts on tab change
  useEffect(() => {
    if (activeTab) {
      const colors = activeTab === "treats" 
        ? ['#ff88bb', '#ff5588'] 
        : ['#8888ff', '#aa66ff']
      
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.4, x: activeTab === "treats" ? 0.3 : 0.7 },
        colors
      })
    }
  }, [activeTab])

  // Categories with enhanced visuals
  const categories = [
    {
      id: "lightFood",
      title: "Light Food",
      description: "Perfect for a light celebration",
      emoji: "🥗",
      color: "#4ade80",
      hoverColor: "#86efac",
      bgPattern: "radial-gradient(circle, #dcfce7 20%, transparent 20%) 0 0/10px 10px"
    },
    {
      id: "heavyFood",
      title: "Heavy Food",
      description: "For a hearty birthday feast",
      emoji: "🍖",
      color: "#f97316",
      hoverColor: "#fb923c",
      bgPattern: "repeating-linear-gradient(45deg, #fff7ed 0px, #fff7ed 5px, #ffedd5 5px, #ffedd5 10px)"
    },
    {
      id: "dessert",
      title: "Dessert",
      description: "Sweet treats for a special day",
      emoji: "🍰",
      color: "#ec4899",
      hoverColor: "#f472b6",
      bgPattern: "radial-gradient(circle, #fce7f3 10%, transparent 10%) 0 0/15px 15px"
    },
    {
      id: "drinks",
      title: "Drinks",
      description: "Refreshing birthday beverages",
      emoji: "🍹",
      color: "#3b82f6",
      hoverColor: "#60a5fa",
      bgPattern: "repeating-linear-gradient(-45deg, #eff6ff 0px, #eff6ff 5px, #dbeafe 5px, #dbeafe 10px)"
    }
  ]

  // Activities with icons and colors
  const activities = [
    {
      id: "partyRoom",
      title: "Virtual Party Room",
      description: "Explore an interactive party space",
      icon: "🎉",
      color: "from-pink-500 to-purple-500",
      action: () => setStage("partyRoom")
    },
    {
      id: "guestbook",
      title: "Guestbook",
      description: "See birthday messages from friends",
      icon: "✍️",
      color: "from-purple-500 to-indigo-500",
      action: () => setStage("guestbook")
    },
    {
      id: "memoryLane",
      title: "Memory Lane",
      description: "Take a trip down memory lane",
      icon: "📸",
      color: "from-indigo-500 to-blue-500",
      action: () => setStage("slideshow")
    },
    {
      id: "poem",
      title: "Birthday Poem",
      description: "Generate a special birthday poem",
      icon: "📝",
      color: "from-blue-500 to-teal-500",
      action: generatePoem
    },
    {
      id: "gift",
      title: "Surprise Gift",
      description: "Open a virtual birthday gift",
      icon: "🎁",
      color: "from-teal-500 to-green-500",
      action: openGift
    }
  ]

  return (
    <motion.div
      className="min-h-screen w-full overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Floating balloon decorations - smaller on mobile */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`balloon-${i}`}
            className="absolute text-3xl sm:text-4xl md:text-5xl"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100 + 100}vh`, 
              rotate: Math.random() * 15 - 7.5 
            }}
            animate={{ 
              y: [`${Math.random() * 20 + 100}vh`, '-10vh'],
              rotate: Math.random() > 0.5 ? [0, 5, -5, 0] : [0, -5, 5, 0]
            }}
            transition={{ 
              y: { 
                duration: Math.random() * 20 + 30, 
                repeat: Infinity,
                ease: "linear" 
              },
              rotate: {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 5
              }
            }}
          >
            {["🎈", "🎊", "✨"][i % 3]}
          </motion.div>
        ))}
        
        {/* Confetti overlay when celebration triggered */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50" />
        )}
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 flex flex-col h-screen">
        {/* Countdown section - Circular design */}
        <motion.div
          className="mb-4 sm:mb-8 mx-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className={`p-3 sm:p-6 rounded-full ${countdownEnded ? 'bg-pink-500' : 'bg-white/90'} shadow-lg border-4 ${countdownEnded ? 'border-yellow-300 animate-pulse' : 'border-pink-200'} transition-all`}>
            <div className="text-center p-1 sm:p-2">
              <h3 className={`text-lg sm:text-xl font-bold ${countdownEnded ? 'text-white' : 'text-purple-700'} mb-1 sm:mb-2`}>
                {countdownEnded ? "It's Birthday Time!" : "Birthday Countdown"}
              </h3>

              {countdownEnded ? (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ rotate: { repeat: Infinity, duration: 0.5 } }}
                >
                  <PlayfulButton onClick={handleCountdownCelebration} color="yellow">
                    <span className="flex items-center">
                      <span className="text-base sm:text-xl mr-1 sm:mr-2">🎉</span> 
                      <span className="text-sm sm:text-base">Celebrate Now!</span>
                    </span>
                  </PlayfulButton>
                </motion.div>
              ) : (
                <div className="flex justify-center space-x-1 sm:space-x-3">
                  {Object.entries(countdownTime).map(([unit, value], i) => (
                    <motion.div 
                      key={unit}
                      className="relative"
                      initial={{ rotateY: 180, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="bg-gradient-to-b from-pink-200 to-purple-200 rounded-lg p-1 sm:p-3 shadow-inner flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 transform transition-all hover:scale-110">
                        <div className="text-lg sm:text-2xl font-bold text-pink-600">{value}</div>
                        <div className="text-[8px] sm:text-xs text-gray-700 capitalize">{unit}</div>
                      </div>
                      <motion.div 
                        className="absolute -z-10 inset-0 bg-pink-300 rounded-lg"
                        animate={{ 
                          rotate: [0, 1, -1, 0],
                          scale: [1, 1.02, 0.98, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab navigation - Playful design */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <motion.div 
            className="bg-white/80 backdrop-blur-sm p-1 sm:p-2 rounded-full shadow-lg flex space-x-1 sm:space-x-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.button
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full flex items-center ${activeTab === 'treats' ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white' : 'bg-white text-gray-700 hover:bg-pink-100'} transition-all`}
              onClick={() => setActiveTab('treats')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base sm:text-lg mr-1 sm:mr-2">🍽️</span>
              <span className="font-medium text-sm sm:text-base">Birthday Treats</span>
            </motion.button>
            
            <motion.button
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full flex items-center ${activeTab === 'activities' ? 'bg-gradient-to-r from-purple-500 to-indigo-400 text-white' : 'bg-white text-gray-700 hover:bg-purple-100'} transition-all`}
              onClick={() => setActiveTab('activities')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base sm:text-lg mr-1 sm:mr-2">🎮</span>
              <span className="font-medium text-sm sm:text-base">Fun Activities</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Content area with playful transitions */}
        <AnimatePresence mode="wait">
          {activeTab === 'treats' ? (
            <motion.div
              key="treats"
              className="flex-1 mx-auto w-full overflow-y-auto"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <motion.h2
                className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-4 sm:mb-8 text-purple-800"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Choose a Birthday Treat
              </motion.h2>

              {/* Interactive carousel-like selection */}
              <div className="relative flex items-center justify-center w-full">
                <div className="relative w-full max-w-4xl mx-auto perspective-1000">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                    {categories.map((category, index) => (
                      <motion.button
                        key={category.id}
                        className="relative h-40 sm:h-60 overflow-hidden rounded-2xl shadow-xl group cursor-pointer"
                        initial={{ opacity: 0, y: 50, rotateX: -15 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          rotateX: 0,
                          z: hoveredCategory === category.id ? 50 : 0
                        }}
                        transition={{ 
                          delay: 0.3 + index * 0.1,
                          type: "spring"
                        }}
                        onClick={() => handleCategorySelect(category.id)}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{
                          backgroundColor: hoveredCategory === category.id 
                            ? category.hoverColor 
                            : 'white',
                          transformStyle: "preserve-3d"
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          rotateY: 5,
                          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
                          transition: { type: "spring", stiffness: 300 }
                        }}
                        whileTap={{ scale: 0.98, rotateY: 0 }}
                      >
                        {/* Card background pattern */}
                        <div 
                          className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity"
                          style={{ backgroundImage: category.bgPattern }}
                        />

                        {/* Card content */}
                        <div className="absolute inset-0 p-3 sm:p-6 flex flex-col items-center justify-center">
                          <motion.div 
                            className="text-3xl sm:text-4xl md:text-6xl mb-1 sm:mb-4"
                            animate={{ 
                              y: hoveredCategory === category.id ? [-3, 3, -3] : 0,
                              rotate: hoveredCategory === category.id ? [-3, 3, -3] : 0
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2,
                              ease: "easeInOut" 
                            }}
                          >
                            {category.emoji}
                          </motion.div>
                          
                          <h3 
                            className="text-sm sm:text-base md:text-xl font-bold mb-1 sm:mb-2 transition-colors"
                            style={{ 
                              color: category.color
                            }}
                          >
                            {category.title}
                          </h3>
                          
                          <p className="text-xs sm:text-sm text-gray-600 text-center">
                            {category.description}
                          </p>
                          
                          <motion.div
                            className="mt-2 sm:mt-4 w-1/2 h-1 rounded-full"
                            style={{ backgroundColor: category.color }}
                            initial={{ width: "30%" }}
                            animate={{ 
                              width: hoveredCategory === category.id ? "70%" : "30%"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                        </div>
                        
                        {/* Select indicator */}
                        {hoveredCategory === category.id && (
                          <motion.div
                            className="absolute bottom-2 sm:bottom-4 text-white font-medium text-xs sm:text-sm px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full"
                            style={{ backgroundColor: category.color }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            Select this
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="activities"
              className="flex-1 mx-auto w-full overflow-y-auto"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <motion.h2
                className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-4 sm:mb-8 text-indigo-800"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Birthday Activities
              </motion.h2>

              {/* Fun activity wheel layout */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-6 max-w-4xl mx-auto px-2 sm:px-0">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      stiffness: 300
                    }}
                  >
                    <motion.button
                      onClick={activity.action}
                      className="w-full h-28 sm:h-40 relative bg-white rounded-xl shadow-lg overflow-hidden group"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Content that flips on hover/touch */}
                      <div className="relative z-10 h-full w-full">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4 text-center group-hover:opacity-0 transition-opacity">
                          <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                            {activity.icon}
                          </div>
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                            {activity.title}
                          </h3>
                        </div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-0.5 sm:mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-white/90 text-xs sm:text-sm">
                            {activity.description}
                          </p>
                          <motion.div 
                            className="mt-1 sm:mt-3 bg-white/30 text-white text-xs sm:text-sm px-2 sm:px-4 py-0.5 sm:py-1 rounded-full"
                            initial={{ scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            Let's do it!
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Decorative elements */}
                      <motion.div
                        className="absolute -right-3 -bottom-3 text-3xl sm:text-4xl md:text-6xl opacity-10 group-hover:opacity-20"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 0.9, 1]
                        }}
                        transition={{ 
                          duration: 5, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        {activity.icon}
                      </motion.div>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CategorySelection