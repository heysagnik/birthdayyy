import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Particles() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  // Don't render particles until window size is known (client-side)
  if (windowSize.width === 0 || windowSize.height === 0) {
    return null
  }

  return (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-pink-300/30"
          initial={{
            width: Math.random() * 30 + 10,
            height: Math.random() * 30 + 10,
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            y: [null, Math.random() * -100 - 50],
            x: [null, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute bg-yellow-200 rounded-full"
          initial={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            scale: 1,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [null, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </>
  )
}