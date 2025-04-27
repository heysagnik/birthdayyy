import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Pause, Music, Volume2 } from "lucide-react"

type Song = {
  id: string
  title: string
  artist: string
  url: string
}

type SongListModalProps = {
  showSongList: boolean
  setShowSongList: (show: boolean) => void
  hindiSongs: Song[]
  audioRef: React.RefObject<HTMLAudioElement>
}

const SongListModal = ({
  showSongList,
  setShowSongList,
  hindiSongs,
  audioRef
}: SongListModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [currentSong, setCurrentSong] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Filter songs based on search
  const filteredSongs = hindiSongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Handle song play
  const handlePlaySong = (song: Song) => {
    if (audioRef.current) {
      // If we're already playing this song, pause it
      if (currentSong === song.id && isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        return
      }
      
      // Otherwise, play the selected song
      audioRef.current.src = song.url
      audioRef.current.play()
        .then(() => {
          setCurrentSong(song.id)
          setIsPlaying(true)
        })
        .catch(error => {
          console.error("Error playing audio:", error)
        })
    }
  }
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowSongList(false)
      }
    }
    
    if (showSongList) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSongList, setShowSongList])
  
  // Update playing state if audio is externally paused or played
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    
    if (audioRef.current) {
      audioRef.current.addEventListener('play', handlePlay)
      audioRef.current.addEventListener('pause', handlePause)
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay)
        audioRef.current.removeEventListener('pause', handlePause)
      }
    }
  }, [audioRef])
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
  
  const modalVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", damping: 15 }
    },
    exit: { 
      y: 100, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }
  
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    })
  }

  return (
    <AnimatePresence>
      {showSongList && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            ref={modalRef}
            className="bg-white max-w-2xl w-full p-6 rounded-2xl shadow-xl border-2 border-pink-300 relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Music note decorations */}
            <div className="absolute -top-6 -left-6 text-4xl opacity-30 text-pink-500">♪</div>
            <div className="absolute -bottom-6 -right-6 text-4xl opacity-30 text-purple-500">♫</div>
            
            {/* Close button */}
            <button
              onClick={() => setShowSongList(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors z-10"
            >
              <X size={20} className="text-pink-500" />
            </button>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <motion.div 
                  className="text-3xl mr-3"
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  🎵
                </motion.div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Birthday Playlist
                </h2>
              </div>
              
              {/* Search input */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search songs or artists..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-full focus:outline-none focus:border-pink-400 transition-colors"
                />
                <Music size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              </div>
              
              {/* Song list */}
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar mb-4">
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      className={`p-3 mb-2 rounded-xl flex items-center transition-all cursor-pointer ${
                        currentSong === song.id
                          ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-l-4 border-pink-500'
                          : 'bg-gray-50 hover:bg-pink-50'
                      }`}
                      onClick={() => handlePlaySong(song)}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white mr-3">
                        {currentSong === song.id && isPlaying ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} className="ml-1" />
                        )}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-gray-800 truncate">{song.title}</div>
                        <div className="text-sm text-gray-500 truncate">{song.artist}</div>
                      </div>
                      
                      {currentSong === song.id && isPlaying && (
                        <motion.div 
                          className="w-16 h-6 flex items-end gap-[2px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 bg-pink-500 rounded-full"
                              animate={{ 
                                height: [4, 12, 4, 16, 8, 14, 6, 10, 4]
                              }}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                delay: i * 0.2,
                                repeatType: "reverse" 
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No songs found matching your search.
                  </div>
                )}
              </div>
              
              {/* Now playing footer */}
              {currentSong && (
                <motion.div 
                  className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Volume2 size={18} className="text-purple-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Now Playing:</div>
                    <div className="font-bold text-purple-700">
                      {hindiSongs.find(song => song.id === currentSong)?.title}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SongListModal