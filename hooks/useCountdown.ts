import { useState, useEffect } from "react"

type CountdownTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const useCountdown = (targetDate?: Date) => {
  // Set default target date to next birthday if not provided
  const defaultTargetDate = () => {
    const today = new Date()
    const nextBirthday = new Date(today.getFullYear(), 3, 15) // April 15th
    
    // If today is after the birthday this year, set for next year
    if (today > nextBirthday) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    }
    
    return nextBirthday
  }
  
  const finalTargetDate = targetDate || defaultTargetDate()
  const [countdownEnded, setCountdownEnded] = useState(false)
  const [countdownTime, setCountdownTime] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const targetTime = finalTargetDate.getTime()
      const difference = targetTime - now
      
      // If countdown completed
      if (difference <= 0) {
        setCountdownEnded(true)
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      
      return {
        days,
        hours,
        minutes,
        seconds
      }
    }
    
    // Initial calculation
    setCountdownTime(calculateTimeLeft())
    
    // Update countdown every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft()
      setCountdownTime(timeLeft)
      
      // Check if countdown has ended
      if (timeLeft.days === 0 && 
          timeLeft.hours === 0 && 
          timeLeft.minutes === 0 && 
          timeLeft.seconds === 0) {
        setCountdownEnded(true)
        clearInterval(timer)
      }
    }, 1000)
    
    // Cleanup on unmount
    return () => clearInterval(timer)
  }, [finalTargetDate])
  
  const formatCountdown = (): string => {
    const { days, hours, minutes, seconds } = countdownTime
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }
  
  // Reset countdown functionality
  const resetCountdown = (newTargetDate?: Date) => {
    const resetDate = newTargetDate || defaultTargetDate()
    setCountdownEnded(false)
    setCountdownTime({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
    return resetDate
  }
  
  return { 
    countdownTime, 
    countdownEnded, 
    formatCountdown, 
    resetCountdown,
    targetDate: finalTargetDate
  }
}