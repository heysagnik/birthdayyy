import { useState, useRef, useEffect, useCallback } from "react"

type BirthdayAudioOptions = {
  initialVolume?: number
  initialMuted?: boolean
  defaultSongUrl?: string
  autoPlay?: boolean
  onPlay?: () => void
  onPause?: () => void
  onVolumeChange?: (volume: number) => void
  onMuteToggle?: (isMuted: boolean) => void
  onSongChange?: (songUrl: string) => void
}

export const useBirthdayAudio = (options: BirthdayAudioOptions = {}) => {
  const {
    initialVolume = 0.7,
    initialMuted = false,
    defaultSongUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    autoPlay = true,
    onPlay,
    onPause,
    onVolumeChange,
    onMuteToggle,
    onSongChange
  } = options
  
  // Create an audio ref that can be attached to an <audio> element
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Internal state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(initialMuted)
  const [volume, setVolume] = useState(initialVolume)
  const [currentSong, setCurrentSong] = useState(defaultSongUrl)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Initialize audio
  useEffect(() => {
    // Create an audio element if one isn't provided
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = "auto"
    }
    
    const audio = audioRef.current
    
    // Configure audio
    audio.src = currentSong
    audio.volume = volume
    audio.muted = isMuted
    audio.loop = true // Birthday songs often loop
    
    // Start playing if autoPlay is true
    if (autoPlay && !isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing audio automatically:", error)
      })
    }
    
    // Setup event listeners
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => setVolume(audio.volume)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("volumechange", handleVolumeChange)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    
    // Cleanup on unmount
    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("volumechange", handleVolumeChange)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [currentSong, autoPlay, isPlaying])
  
  // Play audio
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          if (onPlay) onPlay()
        })
        .catch(error => {
          console.error("Error playing audio:", error)
        })
    }
  }, [onPlay])
  
  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (onPause) onPause()
    }
  }, [onPause])
  
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])
  
  // Set volume
  const setAudioVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      // Ensure volume is between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, newVolume))
      audioRef.current.volume = clampedVolume
      setVolume(clampedVolume)
      if (onVolumeChange) onVolumeChange(clampedVolume)
    }
  }, [onVolumeChange])
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMutedState = !audioRef.current.muted
      audioRef.current.muted = newMutedState
      setIsMuted(newMutedState)
      if (onMuteToggle) onMuteToggle(newMutedState)
    }
  }, [onMuteToggle])
  
  // Change song
  const changeSong = useCallback((songUrl: string) => {
    if (audioRef.current) {
      // Save current playing state
      const wasPlaying = !audioRef.current.paused
      
      // Change song
      setCurrentSong(songUrl)
      audioRef.current.src = songUrl
      
      // If it was playing, continue playing the new song
      if (wasPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing new song:", error)
        })
      }
      
      if (onSongChange) onSongChange(songUrl)
    }
  }, [onSongChange])
  
  // Seek to position
  const seekTo = useCallback((timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(timeInSeconds, duration))
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [duration])
  
  // Format time (seconds to MM:SS)
  const formatTime = useCallback((timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }, [])
  
  return {
    audioRef,
    isPlaying,
    isMuted,
    volume,
    currentSong,
    duration,
    currentTime,
    isLoading,
    formatTime,
    play,
    pause,
    togglePlay,
    setVolume: setAudioVolume,
    toggleMute,
    changeSong,
    seekTo
  }
}