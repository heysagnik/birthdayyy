import { ReactNode, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

type ConfettiButtonProps = {
  children: ReactNode
  onClick?: () => void
  confettiConfig?: {
    particleCount?: number
    spread?: number
    startVelocity?: number
    colors?: string[]
    origin?: { x: number; y: number }
    gravity?: number
  }
  className?: string
  color?: "pink" | "purple" | "blue" | "gradient"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  icon?: string
  iconPosition?: "left" | "right"
}

export const ConfettiButton = ({
  children,
  onClick,
  confettiConfig = {},
  className = "",
  color = "gradient",
  size = "md",
  disabled = false,
  icon,
  iconPosition = "left"
}: ConfettiButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Default confetti settings
  const defaultConfettiConfig = {
    particleCount: 50,
    spread: 70,
    startVelocity: 30,
    colors: [
      "#FF1493", // Deep Pink
      "#FF69B4", // Hot Pink
      "#FFB6C1", // Light Pink
      "#FFC0CB", // Pink
      "#9370DB", // Medium Purple
      "#BA55D3", // Medium Orchid
      "#FFD700", // Gold
      "#00BFFF"  // Deep Sky Blue
    ],
    origin: { x: 0.5, y: 0.7 },
    gravity: 1.2
  }
  
  // Merged confetti config
  const mergedConfig = { ...defaultConfettiConfig, ...confettiConfig }
  
  // Color styles
  const colorStyles = {
    pink: "bg-pink-500 hover:bg-pink-600 text-white border-pink-400",
    purple: "bg-purple-500 hover:bg-purple-600 text-white border-purple-400",
    blue: "bg-blue-500 hover:bg-blue-600 text-white border-blue-400",
    gradient: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-pink-400"
  }
  
  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  }
  
  // Compose button styles
  const buttonStyles = `
    relative
    overflow-hidden
    rounded-full
    font-bold
    shadow-md
    hover:shadow-lg
    border-2
    transition-all
    duration-300
    ${colorStyles[color]}
    ${sizeStyles[size]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `
  
  // Handle button click with confetti
  const handleClick = () => {
    if (disabled) return
    
    // Launch confetti
    confetti({
      ...mergedConfig
    })
    
    // Trigger scale animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
    
    // Call custom onClick handler if provided
    if (onClick) onClick()
  }

  return (
    <motion.button
      className={buttonStyles}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={{ 
        scale: isAnimating ? [1, 1.2, 1] : 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 15 
      }}
    >
      <span className="relative z-10 flex items-center justify-center">
        {icon && iconPosition === "left" && (
          <span className="mr-2 text-xl">{icon}</span>
        )}
        
        {children}
        
        {icon && iconPosition === "right" && (
          <span className="ml-2 text-xl">{icon}</span>
        )}
      </span>
      
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isAnimating ? [0, 0.2, 0] : 0
        }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Particle effects on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              repeatDelay: Math.random() * 3
            }}
          />
        ))}
      </motion.div>
    </motion.button>
  )
}