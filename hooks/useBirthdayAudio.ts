import { useState, useRef, useEffect, useCallback } from "react"

type BirthdayAudioOptions = {
  initialVolume?: number
  initialMuted?: boolean
  defaultSongUrl?: string
  autoPlay?: boolean // Note: Autoplay might be blocked by browsers
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onVolumeChange?: (volume: number) => void
  onMuteToggle?: (isMuted: boolean) => void
  onSongChange?: (songUrl: string) => void
  onError?: (error: Event | string) => void
}

/**
 * Custom hook for managing birthday audio playback.
 * Handles playback state, volume, muting, song changes, and seeking.
 * Provides formatted time and loading status.
 */
export const useBirthdayAudio = (options: BirthdayAudioOptions = {}) => {
  const {
    initialVolume = 0.7,
    initialMuted = false,
    defaultSongUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    autoPlay = true,
    loop = true,
    onPlay,
    onPause,
    onEnded,
    onVolumeChange,
    onMuteToggle,
    onSongChange,
    onError
  } = options

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isMountedRef = useRef(true) // Track component mount status for async operations

  // Internal state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(initialMuted)
  const [volume, setVolume] = useState(initialVolume)
  const [currentSong, setCurrentSong] = useState(defaultSongUrl)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [canAutoplay, setCanAutoplay] = useState(true) // Track if autoplay was successful initially

  // --- Internal Helper Functions ---

  const safeSetState = <T>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      setter(value)
    }
  }

  const handleError = useCallback((error: Event | string, context: string) => {
    const errorMessage = typeof error === 'string' ? error : (error.target as HTMLAudioElement)?.error?.message || 'Unknown audio error'
    console.error(`Audio Error (${context}):`, errorMessage, error)
    safeSetState<string | null>(setErrorState, errorMessage)
    if (onError) {
      onError(error)
    }
    safeSetState<boolean>(setIsLoading, false) // Ensure loading stops on error
  }, [onError])

  // --- Effects ---

  // Initialize and manage audio element
  useEffect(() => {
    isMountedRef.current = true
    
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = "auto" // Preload audio data
    }
    const audio = audioRef.current

    // Set initial properties
    audio.src = currentSong
    audio.volume = Math.max(0, Math.min(1, volume)) // Ensure volume is clamped
    audio.muted = isMuted
    audio.loop = loop

    // --- Event Listeners ---
    const handlePlay = () => {
      safeSetState<boolean>(setIsPlaying, true)
      safeSetState<string | null>(setErrorState, null) // Clear error on successful play
      if (onPlay) onPlay()
    }
    const handlePause = () => {
      safeSetState<boolean>(setIsPlaying, false)
      if (onPause) onPause()
    }
    const handleEnded = () => {
      safeSetState<boolean>(setIsPlaying, false)
      setCurrentTime(0) // Reset time if not looping
      if (onEnded) onEnded()
    }
    const handleVolumeChange = () => {
      if (audio) {
        safeSetState(setVolume, audio.volume)
        safeSetState<boolean>(setIsMuted, audio.muted)
        if (onVolumeChange) onVolumeChange(audio.volume)
        if (onMuteToggle) onMuteToggle(audio.muted)
      }
    }
    const handleDurationChange = () => {
      if (audio && Number.isFinite(audio.duration)) {
        safeSetState(setDuration, audio.duration)
      }
    }
    const handleTimeUpdate = () => {
      if (audio) {
        safeSetState(setCurrentTime, audio.currentTime)
      }
    }
    const handleLoadStart = () => {
      safeSetState<boolean>(setIsLoading, true)
      safeSetState<string | null>(setErrorState, null)
    }
    const handleCanPlay = () => {
      safeSetState<boolean>(setIsLoading, false)
      if (audio && Number.isFinite(audio.duration)) { // Update duration if available now
        safeSetState(setDuration, audio.duration)
      }
    }
    const handleCanPlayThrough = () => {
       safeSetState<boolean>(setIsLoading, false) // Ensure loading is false when ready to play through
    }
    const handleErrorEvent = (e: Event) => handleError(e, 'event listener')

    // Add listeners
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("volumechange", handleVolumeChange)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("error", handleErrorEvent)
    const handleStalled = () => safeSetState<boolean>(setIsLoading, true); // Handle potential stalls
    const handleWaiting = () => safeSetState<boolean>(setIsLoading, true); // Handle waiting for data
    audio.addEventListener("stalled", handleStalled)
    audio.addEventListener("waiting", handleWaiting)

    // Attempt autoplay if enabled and not already playing
    if (autoPlay && !isPlaying && canAutoplay) {
      audio.play().catch(error => {
        // Autoplay was likely prevented by the browser
        handleError(error, 'autoplay')
        safeSetState<boolean>(setCanAutoplay, false) // Don't attempt autoplay again automatically
        safeSetState<boolean>(setIsPlaying, false) // Ensure state reflects reality
      })
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false // Mark as unmounted
      // Pause and remove listeners to prevent memory leaks
      if (audio) {
        audio.pause()
        audio.removeEventListener("play", handlePlay)
        audio.removeEventListener("pause", handlePause)
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("volumechange", handleVolumeChange)
        audio.removeEventListener("durationchange", handleDurationChange)
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadstart", handleLoadStart)
        audio.removeEventListener("canplay", handleCanPlay)
        audio.removeEventListener("canplaythrough", handleCanPlayThrough)
        audio.removeEventListener("error", handleErrorEvent)
        audio.removeEventListener("stalled", handleStalled)
        audio.removeEventListener("waiting", handleWaiting)
        // Optional: Completely remove the audio source if desired
        // audio.src = ""
        // audio.removeAttribute("src")
        // audio.load()
      }
    }
    // Dependencies: Re-run effect if song, loop, or autoplay intent changes.
    // Avoid adding `volume`, `isMuted`, `isPlaying` as they are managed internally or via controls.
  }, [currentSong, loop, autoPlay, canAutoplay, handleError, onPlay, onPause, onEnded, onVolumeChange, onMuteToggle])

  // --- Control Functions ---

  const play = useCallback(() => {
    if (audioRef.current) {
      // Reset canAutoplay flag if user manually initiates play
      setCanAutoplay(true)
      audioRef.current.play()
        .then(() => {
          // State update handled by 'play' event listener
        })
        .catch(error => {
          handleError(error, 'play command')
        })
    }
  }, [handleError])

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      // State update handled by 'pause' event listener
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        play()
      } else {
        pause()
      }
    }
  }, [play, pause])

  const setAudioVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume))
      audioRef.current.volume = clampedVolume
      // State update handled by 'volumechange' event listener
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      // State update handled by 'volumechange' event listener
    }
  }, []) // <-- Added closing brace and comma

  const changeSong = useCallback((songUrl: string) => {
    if (audioRef.current && songUrl !== currentSong) {
      const wasPlaying = !audioRef.current.paused
      safeSetState<boolean>(setIsLoading, true) // Set loading state immediately
      safeSetState(setCurrentSong, songUrl)
      // The main useEffect will handle src change and potential autoplay
      if (onSongChange) {
        onSongChange(songUrl)
      }
    }
  }, [currentSong, onSongChange, safeSetState]) // Added dependencies

  const seekTo = useCallback((timeInSeconds: number) => {
    if (audioRef.current && Number.isFinite(duration)) {
      const clampedTime = Math.max(0, Math.min(timeInSeconds, duration))
      audioRef.current.currentTime = clampedTime
      safeSetState(setCurrentTime, clampedTime) // Update state immediately for responsiveness
    }
  }, [duration])

  // --- Utility Functions ---

  const formatTime = useCallback((timeInSeconds: number): string => {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
      return "0:00"
    }
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }, [])

  // --- Return Value ---

  return {
    /** Reference to the underlying HTMLAudioElement. Use with caution. */
    audioRef,
    /** Indicates if audio is currently playing. */
    isPlaying,
    /** Indicates if audio is muted. */
    isMuted,
    /** Current volume level (0 to 1). */
    volume,
    /** URL of the currently loaded song. */
    currentSong,
    /** Total duration of the current song in seconds. */
    duration,
    /** Current playback time in seconds. */
    currentTime,
    /** Indicates if the audio is currently loading or stalled. */
    isLoading,
    /** A string containing the last error message, or null if no error. */
    error: errorState,
    /** Indicates if the browser likely blocked the initial autoplay attempt. */
    autoplayBlocked: !canAutoplay,
    /** Formats time in seconds to a MM:SS string. */
    formatTime,
    /** Starts or resumes playback. */
    play,
    /** Pauses playback. */
    pause,
    /** Toggles between play and pause states. */
    togglePlay,
    /** Sets the volume (0 to 1). */
    setVolume: setAudioVolume,
    /** Toggles the muted state. */
    toggleMute,
    /** Loads and potentially plays a new song URL. */
    changeSong,
    /** Seeks playback to a specific time in seconds. */
    seekTo,
  }
}