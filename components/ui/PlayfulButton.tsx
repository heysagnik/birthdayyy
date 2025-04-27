import { ReactNode } from "react"
import { motion } from "framer-motion"

type ColorVariant = 
  | "pink" 
  | "purple" 
  | "blue" 
  | "pink-to-purple" 
  | "purple-to-indigo" 
  | "indigo-to-blue" 
  | "blue-to-teal" 
  | "teal-to-green"
  | "yellow"
  | "orange"
  | "red"
  | "green"
  | "cyan"
  | "rainbow"
  | "orange-to-red"
  | "yellow-to-orange"
  | "green-to-cyan"
  | "red-to-pink"

type PlayfulButtonProps = {
  children: ReactNode
  onClick: () => void
  color?: ColorVariant
  icon?: string
  disabled?: boolean
  fullWidth?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export const PlayfulButton = ({
  children,
  onClick,
  color = "pink",
  icon,
  disabled = false,
  fullWidth = false,
  size = "md",
  className = ""
}: PlayfulButtonProps) => {
  // Color variants mapping
  const colorStyles = {
    pink: "bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200",
    purple: "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-200",
    blue: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200",
    "pink-to-purple": "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-pink-200",
    "purple-to-indigo": "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-purple-200",
    "indigo-to-blue": "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-indigo-200",
    "blue-to-teal": "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-blue-200",
    "teal-to-green": "bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white shadow-teal-200",
    
    // New solid colors
    "yellow": "bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-yellow-200",
    "orange": "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200",
    "red": "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
    "green": "bg-green-500 hover:bg-green-600 text-white shadow-green-200",
    "cyan": "bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-200",
    
    // New gradients
    "orange-to-red": "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-orange-200",
    "yellow-to-orange": "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-yellow-200",
    "green-to-cyan": "bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-green-200",
    "red-to-pink": "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-200",
    
    // Special rainbow gradient
    "rainbow": "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 hover:from-red-600 hover:via-yellow-600 hover:via-green-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-purple-200",
  }
  
  // Size variants mapping
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3",
    lg: "px-6 py-4 text-lg"
  }
  
  // Base styles
  const baseStyles = `
    rounded-xl 
    font-medium 
    transition-all 
    duration-300 
    shadow-md 
    hover:shadow-lg 
    active:shadow-inner 
    ${fullWidth ? "w-full" : ""} 
    ${sizeStyles[size]} 
    ${colorStyles[color]} 
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
    ${className}
  `

  return (
    <motion.button
      className={baseStyles}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex items-center justify-center">
        {icon && (
          <span className="mr-2 text-xl flex items-center">{icon}</span>
        )}
        <div className="flex flex-col items-center">
          {children}
        </div>
      </div>
      
      {/* Enhanced sparkle animation on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        {Array.from({ length: color === "rainbow" ? 8 : 5 }).map((_, index) => (
          <motion.div
            key={index}
            className={`absolute ${color === "rainbow" ? "w-2 h-2" : "w-1 h-1"} bg-white rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
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