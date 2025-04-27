import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Pause, Music, Volume2, Search } from "lucide-react" // Added Search icon

type Song = {
  id: string
  title: string
  artist: string
  url: string
  // duration?: string // Optional: Add duration if available
}

type SongListModalProps = {
  showSongList: boolean
  setShowSongList: (show: boolean) => void
  hindiSongs: Song[]
  audioRef: React.RefObject<HTMLAudioElement>
  // Optional: Pass down state/functions from a dedicated audio hook if available
  // currentPlayingId?: string | null;
  // isAudioPlaying?: boolean;
  // playSongById?: (id: string) => void;
  // pauseAudio?: () => void;
}

const SongListModal = ({
  showSongList,
  setShowSongList,
  hindiSongs,
  audioRef,
  // currentPlayingId, // Use these if passed from a hook
  // isAudioPlaying,
  // playSongById,
  // pauseAudio
}: SongListModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  // Internal state if not using a dedicated hook
  const [currentSongId, setCurrentSongId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  // ---
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null)

  // Use external state if provided, otherwise use internal state
  // const actualCurrentSongId = currentPlayingId !== undefined ? currentPlayingId : currentSongId;
  // const actualIsPlaying = isAudioPlaying !== undefined ? isAudioPlaying : isPlaying;
  // --- For now, using internal state ---
  const actualCurrentSongId = currentSongId;
  const actualIsPlaying = isPlaying;
  // ---

  // Filter songs based on search
  const filteredSongs = hindiSongs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle song play/pause (using internal state management)
  const handlePlayPauseSong = (song: Song) => {
    // If using external controls:
    // if (playSongById && pauseAudio) {
    //   if (actualCurrentSongId === song.id && actualIsPlaying) {
    //     pauseAudio();
    //   } else {
    //     playSongById(song.id); // Assuming playSongById handles loading the URL etc.
    //   }
    //   return;
    // }

    // --- Internal state management ---
    const audio = audioRef.current; // Get the audio element
    if (audio) {
      console.log("Audio element found:", audio); // Debug log
      // If clicking the currently playing song, pause it
      if (actualCurrentSongId === song.id && actualIsPlaying) {
        console.log("Pausing song:", song.title); // Debug log
        audio.pause()
        // Note: The 'pause' event listener below will set isPlaying to false
      }
      // If clicking a different song or the paused current song
      else {
        // If it's a different song, set the source
        if (actualCurrentSongId !== song.id) {
          console.log("Setting new source:", song.url); // Debug log
          audio.src = song.url
          // Important: Load the new source before playing
          audio.load();
        }
        // Play the audio
        console.log("Attempting to play song:", song.title); // Debug log
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Playback started successfully"); // Debug log
              // Note: The 'play' event listener below will set state
              setCurrentSongId(song.id) // Set current song ID immediately for UI feedback
              setIsPlaying(true)      // Set playing state immediately for UI feedback
            })
            .catch(error => {
              console.error("Error playing audio:", error); // Log specific error
              // Optionally reset state on error
              setCurrentSongId(null)
              setIsPlaying(false)
            })
        } else {
             console.warn("audio.play() did not return a promise. Playback might not have started.");
             // Fallback for older browsers or unexpected behavior
             setCurrentSongId(song.id);
             setIsPlaying(true); // Assume playback started, rely on events later
        }
      }
    } else {
        console.error("Audio element ref is null!"); // Critical error log
    }
  }

  // Close modal when clicking outside - Ensure this doesn't interfere with song clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the modal content area
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        // Check if the click target is NOT part of the song list items or the close button itself
        const clickedElement = event.target as Element;
        if (!clickedElement.closest('.song-item') && !clickedElement.closest('.close-button')) { // Added check for close button class
             setShowSongList(false)
        }
      }
    }

    if (showSongList) {
      // Use setTimeout to allow the current event loop to finish before adding the listener
      // This can prevent the listener from catching the click that opened the modal
      const timerId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timerId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSongList, setShowSongList])

  // Update internal playing state based *only* on audio element events
   useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
        console.log("Audio 'play' event triggered"); // Debug log
        setIsPlaying(true);
        // Infer current song ID from the audio source
        const playingSong = hindiSongs.find(s => s.url === audio.src);
        if (playingSong) {
            setCurrentSongId(playingSong.id);
        } else {
            // If the src doesn't match any known song, maybe clear the ID?
            // setCurrentSongId(null); // Or handle as needed
            console.warn("Playing audio source doesn't match any song in the list:", audio.src);
        }
    };
    const handlePause = () => {
        console.log("Audio 'pause' event triggered"); // Debug log
        setIsPlaying(false);
        // Don't clear currentSongId on pause, just on ended or new song
    };
    const handleEnded = () => {
        console.log("Audio 'ended' event triggered"); // Debug log
        setIsPlaying(false);
        setCurrentSongId(null); // Clear current song when it ends
    };
    const handleLoadStart = () => {
        console.log("Audio 'loadstart' event triggered"); // Debug log
        // Optional: Show loading indicator?
    }
    const handleCanPlay = () => {
        console.log("Audio 'canplay' event triggered"); // Debug log
        // Optional: Hide loading indicator?
    }
    const handleError = (e: Event) => {
        console.error("Audio Element Error:", e); // Log errors from the audio element itself
        setIsPlaying(false);
        setCurrentSongId(null);
    }


    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded); // Handle song ending
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Initial check: If audio is already playing when modal opens, sync state
    if (!audio.paused && audio.src) {
        console.log("Audio already playing on modal open"); // Debug log
        handlePlay();
    } else {
        // If audio exists but is paused, ensure isPlaying state is false
        setIsPlaying(false);
        // If audio has a src but is paused, try to find the matching song ID
        if (audio.src) {
             const pausedSong = hindiSongs.find(s => s.url === audio.src);
             if (pausedSong) {
                 setCurrentSongId(pausedSong.id);
             }
        }
    }


    return () => {
      console.log("Cleaning up audio event listeners"); // Debug log
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
    // Re-run if the audioRef itself changes (though unlikely) or if the song list changes (for the find operation)
  }, [audioRef, hindiSongs]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 }, // Start from bottom
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 150 }
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.04, // Slightly faster stagger
        duration: 0.3
      }
    })
  }

  return (
    <AnimatePresence>
      {showSongList && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4 bg-black/70 backdrop-blur-md" // Darker backdrop, blurrier
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          // Don't close on backdrop click here, handled by useEffect
        >
          <motion.div
            ref={modalRef}
            className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-200 max-w-2xl w-full h-[90vh] md:h-auto md:max-h-[80vh] flex flex-col rounded-t-2xl md:rounded-2xl shadow-xl border-t-2 md:border-2 border-purple-600/50 relative overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from triggering outside click handler
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center">
                 <motion.div
                  className="text-3xl mr-3 text-purple-400"
                  animate={{ rotate: actualIsPlaying ? [0, 5, -5, 0] : 0 }}
                  transition={{ duration: actualIsPlaying ? 0.5 : 0, repeat: actualIsPlaying ? Infinity : 0 }}
                >
                  <Music size={28} />
                </motion.div>
                <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Party Playlist
                </h2>
              </div>
              {/* Explicit Close Button - Ensure it's easily clickable */}
              <motion.button
                onClick={() => setShowSongList(false)}
                className="close-button p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors z-20" // Added close-button class
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Search input */}
            <div className="p-4 md:p-6 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for songs or artists..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-gray-400 text-white"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Song list */}
            <div className="flex-grow overflow-y-auto px-2 md:px-4 custom-scrollbar-dark">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song, index) => {
                  const isCurrent = actualCurrentSongId === song.id;
                  const isHovering = hoveredSongId === song.id;

                  return (
                    <motion.div
                      key={song.id}
                      className={`song-item p-2.5 md:p-3 mb-1.5 rounded-lg flex items-center transition-all duration-200 cursor-pointer relative ${
                        isCurrent
                          ? 'bg-gray-700/70'
                          : 'hover:bg-gray-700/50'
                      }`}
                      onClick={() => handlePlayPauseSong(song)}
                      onMouseEnter={() => setHoveredSongId(song.id)}
                      onMouseLeave={() => setHoveredSongId(null)}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileTap={{ scale: 0.99, backgroundColor: 'rgba(55, 65, 81, 0.8)' }} // gray-700 with opacity
                    >
                      {/* Play/Pause Icon Area */}
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center mr-3">
                        {isCurrent && actualIsPlaying ? (
                          // Show Pause button if it's the current playing song
                          <Pause size={20} className="text-purple-400" />
                        ) : isCurrent && !actualIsPlaying ? (
                           // Show Play button if it's the current paused song
                           <Play size={20} className="text-purple-400 ml-1" />
                        ) : isHovering ? (
                          // Show Play button on hover if not the current song
                          <Play size={20} className="text-gray-300 ml-1" />
                        ) : (
                          // Show song number or a music icon as default
                          <span className="text-xs text-gray-400 w-full text-center">{index + 1}</span>
                          // <Music size={16} className="text-gray-500" />
                        )}
                      </div>

                      {/* Song Title & Artist */}
                      <div className="flex-grow min-w-0">
                        <div className={`font-medium truncate ${isCurrent ? 'text-purple-400' : 'text-gray-100'}`}>{song.title}</div>
                        <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                      </div>

                      {/* Visualizer (only for current playing song) */}
                      {isCurrent && actualIsPlaying && (
                        <motion.div
                          className="w-12 h-5 flex items-end gap-px ml-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-purple-400 rounded-full"
                              style={{ height: '4px' }} // Initial height
                              animate={{
                                height: ['6px', '16px', '8px', '12px', '6px']
                              }}
                              transition={{
                                duration: 0.8 + Math.random() * 0.4,
                                repeat: Infinity,
                                delay: i * 0.15,
                                repeatType: "mirror",
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                      {/* Optional: Display duration */}
                      {/* {song.duration && <div className="text-sm text-gray-400 ml-4">{song.duration}</div>} */}
                    </motion.div>
                  )
                })
              ) : (
                <div className="text-center p-10 text-gray-500">
                  No songs found. Try a different search?
                </div>
              )}
            </div>

            {/* Now playing footer (Simplified) */}
            {actualCurrentSongId && (
              <motion.div
                className="flex-shrink-0 p-3 md:p-4 bg-gray-800/50 border-t border-gray-700 flex items-center mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Volume2 size={18} className="text-purple-400 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-400">Now Playing:</div>
                  <div className="font-semibold text-purple-300 truncate">
                    {hindiSongs.find(song => song.id === actualCurrentSongId)?.title ?? '...'}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Add this CSS to your global stylesheet (e.g., index.css or App.css)
/*

*/

export default SongListModal