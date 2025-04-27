import { useState, useEffect, useCallback } from "react"
import { motion, useAnimate, useMotionValue } from "framer-motion"
import { Stage } from "@/app/page" 
import confetti from "canvas-confetti"

type GreetingProps = {
  setStage: (stage: Stage) => void
  videoRef: React.RefObject<HTMLVideoElement>
}

const Greeting = ({ setStage, videoRef }: GreetingProps) => {
  const [typedText, setTypedText] = useState("")
  const [showEmoji, setShowEmoji] = useState(false)
  const [burstBalloons, setBurstBalloons] = useState<number[]>([])
  const [scope, animate] = useAnimate()
  const rotate = useMotionValue(0)
  const greetingText = "Happy Birthday Sagnik!"
  
  // Typing animation effect
  useEffect(() => {
    if (typedText.length < greetingText.length) {
      const timeout = setTimeout(() => {
        setTypedText(greetingText.slice(0, typedText.length + 1))
        
        // Play a subtle typing sound
        if (typedText.length % 2 === 0) {
          const typingSound = new Audio("/sounds/typing.mp3")
          typingSound.volume = 0.2
          typingSound.play().catch(err => console.error(err))
        }
      }, 100)
      
      return () => clearTimeout(timeout)
    } else if (!showEmoji) {
      // Show emoji with a pop effect after text is done
      setTimeout(() => {
        setShowEmoji(true)
        // Launch confetti when text completes
        launchConfetti()
      }, 300)
    }
  }, [typedText, greetingText, showEmoji])
  
  // Launch confetti effect
  const launchConfetti = useCallback(() => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ff718d', '#fdadc7', '#ea4c89', '#9370DB', '#b76cfd'];
    
    const randomInRange = (min: number, max: number) => 
      Math.random() * (max - min) + min;
    
    const confettiLaunch = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.7 },
        colors: [colors[Math.floor(Math.random() * colors.length)]],
        zIndex: 100
      });
      
      requestAnimationFrame(confettiLaunch);
    };
    
    confettiLaunch();
  }, []);

  // Handle cake wiggle animation
  useEffect(() => {
    if (showEmoji) {
      animate(scope.current, { rotate: [0, -10, 15, -5, 0] }, { duration: 0.7, ease: "easeInOut" })
      
      // Schedule periodic cake wiggle
      const interval = setInterval(() => {
        animate(scope.current, { rotate: [0, -10, 15, -5, 0] }, { duration: 0.7, ease: "easeInOut" })
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [showEmoji, animate, scope])

  // Animation variants for birthday elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10
      }
    }
  }
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      boxShadow: "0px 10px 20px rgba(254, 97, 174, 0.3)",
      background: "linear-gradient(to right, #ff5bac, #b745ff)",
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeOut" 
      }
    },
    tap: { scale: 0.95 }
  }
  
  const cakeEmoji = {
    hidden: { scale: 0, rotate: -30 },
    visible: { 
      scale: 1.2, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260,
        damping: 10
      }
    },
    hover: {
      scale: 1.5,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5 }
    }
  }

  const handleBurstBalloon = (index: number) => {
    // Play pop sound
    const popSound = new Audio("/sounds/pop.mp3")
    popSound.volume = 0.3
    popSound.play().catch(err => console.error(err))
    
    // Create small confetti burst at balloon position
    const balloonElement = document.getElementById(`balloon-${index}`)
    if (balloonElement) {
      const rect = balloonElement.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      
      confetti({
        particleCount: 30,
        startVelocity: 30,
        spread: 360,
        origin: { x, y },
        colors: ['#FF61AE', '#FFD166', '#06D6A0', '#118AB2', '#7209B7'],
        zIndex: 300,
      })
    }
    
    // Add this balloon to the burst list
    setBurstBalloons(prev => [...prev, index])
  }

  const handleContinue = () => {
    // Extra confetti burst when continuing
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    })
    
    // Play a 'whoosh' sound
    const whooshSound = new Audio("/sounds/whoosh.mp3")
    whooshSound.volume = 0.3
    whooshSound.play().catch(err => console.error(err))
    
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error)
      })
    }
    
    setStage("video")
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Birthday background decor */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Confetti pieces */}
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              background: [
                '#FF61AE', '#FFD166', '#06D6A0', '#118AB2', '#7209B7', 
                '#FF87AB', '#FF5678', '#FF99C8', '#FCF6BD', '#A9DEF9'
              ][Math.floor(Math.random() * 10)],
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: window.innerHeight + 20,
              rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
              x: (i % 2 === 0) 
                ? `calc(${Math.random() * 40 - 20}vw + ${Math.random() * 200 - 100}px)` 
                : `calc(${Math.random() * 30 - 15}vw - ${Math.random() * 200 - 100}px)`
            }}
            transition={{
              duration: 5 + Math.random() * 15,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      
        {/* Floating balloons */}
        {Array.from({ length: 12 }).map((_, i) => {
          // Skip rendering if this balloon has been burst
          if (burstBalloons.includes(i)) return null
          
          return (
            <motion.div
              id={`balloon-${i}`}
              key={`balloon-${i}`}
              className="absolute cursor-pointer"
              initial={{ 
                x: `${(i * 8) + Math.random() * 10}vw`, 
                y: "110vh",
                rotate: Math.random() * 10 - 5,
                opacity: 0.8 + Math.random() * 0.2
              }}
              animate={{ 
                y: "-20vh", 
                x: `calc(${(i * 8) + Math.random() * 3}vw + ${Math.sin(i) * 2}vw)`,
                rotate: Math.random() * 6 - 3
              }}
              transition={{ 
                duration: 10 + Math.random() * 10, 
                repeat: Infinity, 
                repeatType: "loop",
                delay: Math.random() * 5,
                ease: "linear"
              }}
              onClick={() => handleBurstBalloon(i)}
              whileHover={{ scale: 1.1 }}
              drag
              dragConstraints={{
                top: -50,
                left: -50,
                right: 50,
                bottom: 50
              }}
              whileDrag={{ scale: 1.1 }}
              style={{ zIndex: 5 }}
            >
              {/* Burst effect that shows when balloon is clicked */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileTap={{ 
                  opacity: 1, 
                  scale: [0.5, 1.5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                <span className="text-3xl">💥</span>
              </motion.div>

              <img 
                src={`/images/balloons/balloon-${(i % 4) + 1}.png`} 
                alt="Balloon" 
                className="w-16 h-auto md:w-24 select-none"
                draggable="false"
              />
              {/* Add string to balloon */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 md:h-16 bg-gray-300/70 rounded"></div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Main content */}
      <motion.div
        className="text-center max-w-xl mx-auto bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-4 border-pink-300 z-10 relative"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: 0,
          transition: { 
            type: "spring", 
            damping: 8,
            mass: 1
          }
        }}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(253,229,255,0.9) 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-8 text-6xl rotate-12">🎉</div>
        <div className="absolute -bottom-10 -left-8 text-6xl -rotate-12">🎁</div>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 filter blur-xl z-[-1]"></div>
        
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5, delay: 0.2 }
          }}
        >
          <svg width="120" height="23" viewBox="0 0 120 23" className="mx-auto mb-4">
            <motion.path
              d="M0,5 Q30,0 60,5 T120,5"
              fill="none"
              stroke="#FF61AE"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </motion.div>
        
        <motion.div className="relative inline-block text-center mb-6">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { delay: 0.3, type: "spring", damping: 8 }
            }}
          >
            {typedText}
            <motion.span
              className="inline-block w-0.5 h-8 bg-purple-600 ml-1"
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              style={{ display: typedText.length < greetingText.length ? "inline-block" : "none" }}
            />
          </motion.h1>
          
          {/* Pop-in cake emoji */}
          {showEmoji && (
            <motion.div 
              ref={scope}
              className="inline-block text-5xl ml-2"
              variants={cakeEmoji}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ transformOrigin: "center" }}
            >
              🎂
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-700 mb-6 leading-relaxed"
          >
            <span className="font-bold text-pink-600">Woohoo!</span> Your special day is here! 
            <br />
            We've prepared something <span className="italic font-semibold text-purple-600">magical</span> just for you.
          </motion.p>
          
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={handleContinue}
            className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold rounded-full shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Continue to Surprise</span>
            <motion.span 
              className="absolute inset-0 bg-white opacity-20"
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{ x: "100%", opacity: 0.3 }}
              transition={{ duration: 0.8 }}
            />
            <motion.span 
              className="absolute -right-2 -top-2 text-xl"
              animate={{ 
                rotate: [0, 20, 0, 20, 0],
                scale: [1, 1.2, 1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </motion.button>
        </motion.div>
        
        {/* Bottom decorative elements */}
        <svg width="120" height="23" viewBox="0 0 120 23" className="mx-auto mt-4">
          <motion.path
            d="M0,5 Q30,10 60,5 T120,5"
            fill="none"
            stroke="#B149E8"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default Greeting