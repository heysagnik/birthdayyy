import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Stage } from "@/app/page"

type CountdownProps = {
  setStage: (stage: Stage) => void
  videoRef: React.RefObject<HTMLVideoElement>
}

const Countdown = ({ setStage, videoRef }: CountdownProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Launch confetti when countdown ends
  const launchConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  // Auto-transition after countdown
  useEffect(() => {
    const timer = setTimeout(() => {
      launchConfetti()
      setTimeout(() => setStage("greeting"), 3000)
    }, 5000)

    return () => clearTimeout(timer)
  }, [setStage])

  // Birthday elements animation variant
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
      
      <motion.div
        className="text-center max-w-lg mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-pink-300"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: { type: "spring", damping: 8, delay: 0.5 }
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="text-6xl mb-8 text-center"
            variants={itemVariants}
          >
            🎂
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 text-purple-700 tracking-tight"
            variants={itemVariants}
          >
            Birthday Surprise Loading...
          </motion.h1>
          
          <motion.div 
            className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "easeInOut" }}
            />
          </motion.div>
          
          <motion.p 
            className="text-gray-600 mb-6 text-lg"
            variants={itemVariants}
          >
            Get ready for something special!
          </motion.p>
          
          <motion.div 
            className="flex justify-center space-x-2"
            variants={itemVariants}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-pink-400"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Countdown