import { useState, useEffect, useCallback, useRef, useMemo } from "react"

/**
 * Represents the remaining time in a countdown.
 */
export type CountdownTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Options for the useCountdown hook.
 */
type CountdownOptions = {
  /** The target date and time for the countdown. */
  targetDate?: Date | number | string
  /** Interval in milliseconds for updating the countdown. Defaults to 1000ms. */
  interval?: number
  /** Callback function triggered when the countdown ends. */
  onEnded?: () => void
}

/**
 * Hook to manage a countdown timer to a specific target date.
 *
 * @param options - Configuration options for the countdown.
 * @returns An object containing the countdown state and control functions.
 */
export const useCountdown = (options: CountdownOptions = {}) => {
  const {
    targetDate,
    interval = 1000,
    onEnded
  } = options

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onEndedRef = useRef(onEnded) // Store callback in ref to avoid effect dependency

  // Memoize the target date calculation/parsing
  const finalTargetDate = useMemo(() => {
    if (targetDate) {
      const date = new Date(targetDate)
      // Check if the provided date is valid
      return isNaN(date.getTime()) ? getDefaultTargetDate() : date
    }
    return getDefaultTargetDate()
  }, [targetDate])

  // Calculate initial state
  const initialTimeLeft = useMemo(() => calculateTimeLeft(finalTargetDate), [finalTargetDate])
  const initialEnded = useMemo(() => isTimeZero(initialTimeLeft), [initialTimeLeft])

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(initialTimeLeft)
  const [countdownEnded, setCountdownEnded] = useState<boolean>(initialEnded)

  // Update the ref if the onEnded callback changes
  useEffect(() => {
    onEndedRef.current = onEnded
  }, [onEnded])

  useEffect(() => {
    // Function to perform the countdown update
    const updateCountdown = () => {
      const now = new Date().getTime()
      const targetTime = finalTargetDate.getTime()
      const difference = targetTime - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }) // Set to zero explicitly
        if (!countdownEnded) { // Check previous state before setting ended and calling callback
          setCountdownEnded(true)
          if (onEndedRef.current) {
            onEndedRef.current()
          }
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null // Clear ref after clearing interval
        }
      } else {
        setTimeLeft(calculateTimeLeft(finalTargetDate)) // Recalculate parts
        setCountdownEnded(false) // Ensure ended state is false if timer restarts/target changes
      }
    }

    // Initial calculation check (needed if targetDate changes)
    updateCountdown()

    // Set up the interval only if the countdown hasn't ended
    if (!countdownEnded) {
      intervalRef.current = setInterval(updateCountdown, interval)
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    // Rerun effect if the target date or interval changes
  }, [finalTargetDate, interval, countdownEnded]) // Keep countdownEnded dependency

  /**
   * Formats the remaining time into a string (e.g., "1d 2h 3m 4s").
   * Omits larger units if they are zero.
   */
  const formatCountdown = useCallback((): string => {
    const { days, hours, minutes, seconds } = timeLeft
    const parts: string[] = []

    if (days > 0) parts.push(`${days}d`)
    if (hours > 0 || parts.length > 0) parts.push(`${hours}h`) // Show hours if days are shown or hours > 0
    if (minutes > 0 || parts.length > 0) parts.push(`${minutes}m`) // Show minutes if larger units shown or minutes > 0
    parts.push(`${seconds}s`) // Always show seconds

    return parts.join(" ") || "0s" // Return "0s" if somehow empty
  }, [timeLeft])

  return {
    /** The remaining time breakdown { days, hours, minutes, seconds }. */
    countdownTime: timeLeft,
    /** Boolean indicating if the countdown has reached zero. */
    countdownEnded,
    /** Function to get a formatted string representation of the remaining time. */
    formatCountdown,
    /** The actual target date object being used for the countdown. */
    targetDate: finalTargetDate
  }
}

// --- Helper Functions ---

/**
 * Calculates the default target date (next April 15th).
 */
const getDefaultTargetDate = (): Date => {
  const today = new Date()
  // Use current year, month 3 (April, 0-indexed), day 15
  const nextBirthday = new Date(today.getFullYear(), 3, 15, 0, 0, 0, 0) // Set time to midnight

  // If today's date/time is past this year's birthday, set target for next year
  if (today.getTime() > nextBirthday.getTime()) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }

  return nextBirthday
}

/**
 * Checks if all components of CountdownTime are zero.
 * @param time - The CountdownTime object.
 * @returns True if all values are zero, false otherwise.
 */
const isTimeZero = (time: CountdownTime): boolean => {
    return time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
}

/**
 * Calculates the time difference between now and the target date.
 * @param targetDate - The future date to count down to.
 * @returns A CountdownTime object.
 */
const calculateTimeLeft = (targetDate: Date): CountdownTime => {
  const now = new Date().getTime()
  const targetTime = targetDate.getTime()
  const difference = targetTime - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24) // Use modulo 24
  const minutes = Math.floor((difference / 1000 / 60) % 60)    // Use modulo 60
  const seconds = Math.floor((difference / 1000) % 60)       // Use modulo 60

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}