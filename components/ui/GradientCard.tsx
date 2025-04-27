import { ReactNode } from "react"
import { motion, MotionProps } from "framer-motion"

type GradientType = 
  | "pink-to-purple" 
  | "purple-to-blue" 
  | "blue-to-teal" 
  | "pink-to-orange" 
  | "purple-to-pink" 
  | "pastel"
  | "birthday"

type GradientCardProps = {
  children: ReactNode
  gradient?: GradientType
  hoverEffect?: boolean
  clickable?: boolean
  onClick?: () => void
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  rounded?: "none" | "sm" | "md" | "lg" | "full"
  animate?: boolean
  border?: boolean
  borderColor?: string
  motionProps?: MotionProps
}

export const GradientCard = ({
  children,
  gradient = "pink-to-purple",
  hoverEffect = true,
  clickable = false,
  onClick,
  className = "",
  padding = "md",
  rounded = "md",
  animate = true,
  border = true,
  borderColor,
  motionProps = {}
}: GradientCardProps) => {
  // Gradient mappings
  const gradientStyles = {
    "pink-to-purple": "bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200",
    "purple-to-blue": "bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200",
    "blue-to-teal": "bg-gradient-to-r from-blue-100 to-teal-100 hover:from-blue-200 hover:to-teal-200",
    "pink-to-orange": "bg-gradient-to-r from-pink-100 to-orange-100 hover:from-pink-200 hover:to-orange-200",
    "purple-to-pink": "bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200",
    "pastel": "bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 hover:from-pink-200 hover:via-purple-200 hover:to-blue-200",
    "birthday": "bg-gradient-to-r from-pink-100 via-yellow-100 to-purple-100 hover:from-pink-200 hover:via-yellow-200 hover:to-purple-200"
  }
  
  // Padding mappings
  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8"
  }
  
  // Border radius mappings
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-3xl",
    full: "rounded-full"
  }
  
  // Default border color based on gradient
  const defaultBorderColor = {
    "pink-to-purple": "border-pink-300",
    "purple-to-blue": "border-purple-300",
    "blue-to-teal": "border-blue-300",
    "pink-to-orange": "border-pink-300",
    "purple-to-pink": "border-purple-300",
    "pastel": "border-pink-300",
    "birthday": "border-yellow-300"
  }
  
  // Compose the styles
  const baseStyles = `
    ${gradientStyles[gradient]}
    ${paddingStyles[padding]}
    ${roundedStyles[rounded]}
    ${border ? `border-2 ${borderColor || defaultBorderColor[gradient]}` : ""}
    ${hoverEffect ? "transition-all duration-300" : ""}
    ${clickable ? "cursor-pointer" : ""}
    shadow-md
    ${className}
  `

  return (
    <motion.div
      className={baseStyles}
      onClick={clickable ? onClick : undefined}
      whileHover={
        hoverEffect && animate 
          ? { 
              y: -5, 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            } 
          : undefined
      }
      whileTap={
        clickable && animate ? { scale: 0.98 } : undefined
      }
      {...motionProps}
    >
      {/* Optional decorative elements based on gradient theme */}
      {gradient === "birthday" && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 text-2xl">
          🎂
        </div>
      )}
      
      {children}
      
      {/* Subtle animated gradient overlay for visual interest */}
      {animate && (
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
          <motion.div
            className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 3,
              ease: "linear"
            }}
          />
        </div>
      )}
    </motion.div>
  )
}