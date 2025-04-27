import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Music, Camera, ArrowLeft, Disc3, Zap, Volume2, VolumeX } from "lucide-react"
import { useBirthdayAudio } from "@/hooks/useBirthdayAudio" // Assuming hooks are in @/hooks

type PartyRoomProps = {
  handleBackToCategories: () => void
  openPhotoBooth: () => void
  setShowSongList: (show: boolean) => void
  friendName: string
}

// URLs for audio assets (replace with your actual URLs or imports if local)
const AMBIENT_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/531/531-preview.mp3";
const PARTY_MUSIC_URL = "https://assets.mixkit.co/sfx/preview/mixkit-house-party-vibes-183.mp3";

const PartyRoom = ({
  handleBackToCategories,
  openPhotoBooth,
  setShowSongList,
  friendName
}: PartyRoomProps) => {
  const [danceMode, setDanceMode] = useState(false)
  const [dancingEmojis, setDancingEmojis] = useState<string[]>([])
  const [showBalloons, setShowBalloons] = useState(true); // Control balloon visibility

  // --- Audio Management ---
  const ambientAudio = useBirthdayAudio({
    defaultSongUrl: AMBIENT_SOUND_URL,
    loop: true,
    initialVolume: 0.4, // Lower default volume for ambient sound
    autoPlay: false, // Don't autoplay ambient sound initially
  })

  const partyAudio = useBirthdayAudio({
    defaultSongUrl: PARTY_MUSIC_URL,
    loop: true,
    initialVolume: 0.8,
    autoPlay: false, // Don't autoplay party music
  })


  // --- Effects ---

  // Stop sounds when component unmounts (handled by useBirthdayAudio cleanup)

  // Toggle dance party mode
  const toggleDanceMode = useCallback(() => {
    const nextDanceMode = !danceMode;
    setDanceMode(nextDanceMode);

    if (nextDanceMode) {
      // Start party music
      partyAudio.play();
      // Optionally fade out ambient sound or keep it low
      // ambientAudio.setVolume(0.1);

      // Launch confetti
      confetti({
        particleCount: 250,
        spread: 160,
        origin: { y: 0.4 },
        gravity: 0.5,
        drift: Math.random() * 0.4 - 0.2, // Add some random drift
        angle: Math.random() * 60 + 60, // Vary angle
        colors: ['#FF4F8B', '#A259FF', '#FFC84F', '#4FFFCA', '#FFFFFF', '#FF1493'], // More neon
        scalar: 1.1, // Slightly larger particles
        zIndex: 1000 // Ensure confetti is above most elements
      });

 
      setShowBalloons(false); // Hide balloons in dance mode for less clutter

    } else {
      // Stop party music
      partyAudio.pause();
      // Optionally restore ambient sound volume
      // ambientAudio.setVolume(0.4);
      setDancingEmojis([]); // Clear dancing emojis
      setShowBalloons(true); // Show balloons again
    }
  }, [danceMode, partyAudio, ambientAudio]); // Added ambientAudio if volume changes

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }
  }

  const discoBallVariants = {
    animate: {
      rotate: 360,
      transition: { loop: Infinity, ease: "linear", duration: 7 } // Slightly faster
    }
  }

  // --- Dynamic Styles ---
  const neonGlow = danceMode ? 'shadow-[0_0_15px_5px_rgba(255,255,255,0.3),_0_0_30px_10px_rgba(162,89,255,0.2)]' : ''
  const textNeonGlow = (color = '#A259FF') => danceMode ? `text-shadow-[0_0_4px_#fff,_0_0_8px_#fff,_0_0_12px_${color},_0_0_16px_${color}]` : '';

  const exitButtonStyles = `fixed bottom-4 left-4 z-50 px-6 py-2 font-semibold rounded-lg shadow-md flex items-center transition-all duration-300 ${
    danceMode
      ? "bg-black/70 text-red-400 border-2 border-red-500/80 hover:bg-red-900/60 hover:border-red-400 hover:text-red-300 backdrop-blur-sm"
      : "bg-gray-700 text-white border-transparent hover:bg-gray-800"
  }`;

  const buttonBaseStyles = "p-4 md:p-5 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 aspect-square w-28 md:w-32 backdrop-blur-sm"
  const buttonStyles = (color: string, isActive: boolean = false, isAudioLoading: boolean = false) => {
    const activeColor = color; // e.g., 'pink', 'cyan', 'green'
    const inactiveColor = 'gray';

    let baseStyle = `${buttonBaseStyles} `;

    if (danceMode) {
      const neonColorHex = color === 'pink' ? '#FF4F8B' : color === 'cyan' ? '#4FFFCA' : color === 'green' ? '#34D399' : '#A259FF'; // Map color names to hex for glow
      baseStyle += `bg-black/60 border-2 border-${activeColor}-500/70 hover:bg-${activeColor}-900/50 hover:border-${activeColor}-400 `;
      if (isActive) {
         baseStyle += `shadow-[0_0_10px_3px_${neonColorHex}50,_0_0_20px_6px_${neonColorHex}30] border-${activeColor}-400`; // Active glow
      }
    } else {
      const currentBgColor = isActive ? activeColor : inactiveColor;
      baseStyle += `bg-gradient-to-br from-${currentBgColor}-200/80 to-${currentBgColor}-300/90 hover:from-${currentBgColor}-300/90 hover:to-${currentBgColor}-400/90 border border-white/20 `;
      if (isActive) {
         baseStyle += `ring-2 ring-offset-2 ring-offset-${currentBgColor}-100 ring-${currentBgColor}-400`; // Subtle ring for active state
      }
    }

    if (isAudioLoading) {
        baseStyle += ' opacity-70 cursor-wait'; // Indicate loading state
    }

    return baseStyle;
  }

  return (
    <motion.div
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden select-none ${ // Added select-none
        danceMode
          ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' // Darker, richer gradient
          : 'bg-gradient-to-b from-purple-300 via-pink-300 to-indigo-300'
      }`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Vignette Effect */}
      {danceMode && <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-black/30 to-black/80 z-10"></div>}

      {/* --- Decorations Layer (z-0) --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Checkered Dance Floor (Dance Mode) */}
        {danceMode && (
          <div className="absolute bottom-0 left-0 right-0 h-[35vh] perspective-[300px]">
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-5 gap-px transform rotate-x-[60deg] scale-[1.5] opacity-40">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={`tile-${i}`}
                  className="bg-gray-900 border border-purple-800/50"
                  animate={{
                    backgroundColor: [
                      'rgba(10, 5, 20, 0.6)',
                      'rgba(162, 89, 255, 0.4)', // Purple
                      'rgba(255, 79, 139, 0.3)', // Pink
                      'rgba(10, 5, 20, 0.6)',
                    ],
                    opacity: [0.6, 1, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 1 + Math.random() * 1.5,
                    repeat: Infinity,
                    repeatType: "mirror", // Use mirror for smoother pulse
                    delay: Math.random() * 1.5
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Static Decorations (Subtler in Dance Mode) */}
        <AnimatePresence>
          {!danceMode && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} className={`absolute top-[8%] left-[15%] text-5xl rotate-[-25deg]`}>🎉</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className={`absolute top-[20%] right-[20%] text-5xl rotate-[15deg]`}>🎊</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className={`absolute bottom-[25%] left-[20%] text-5xl rotate-[20deg]`}>🎁</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} className={`absolute bottom-[10%] right-[25%] text-6xl rotate-[-10deg]`}>🎂</motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hanging Streamers */}
        <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none">
          {[...Array(danceMode ? 9 : 7)].map((_, i) => ( // More streamers in dance mode
            <motion.div
              key={`streamer-${i}`}
              className="w-1 origin-top"
              style={{
                height: `${Math.random() * (danceMode ? 20 : 15) + 10}vh`,
                backgroundColor: ['#FF4F8B', '#A259FF', '#FFC84F', '#4FFFCA', '#FF1493'][i % 5],
                transformOrigin: 'top',
                opacity: danceMode ? 0.6 : 0.8,
                filter: danceMode ? 'blur(1px)' : 'none',
              }}
              animate={{
                rotateZ: [ -5 + (i % 3) * 4, 5 + (i % 2) * 3, -5 + (i % 3) * 4 ],
                scaleY: [1, 1.02, 1] // Subtle bounce
              }}
              transition={{
                rotateZ: { duration: 3 + i % 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                scaleY: { duration: 1.5 + Math.random(), repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              }}
            />
          ))}
        </div>

   

        {/* Dance floor emojis (Dance Mode) */}
        <AnimatePresence>
          {danceMode && dancingEmojis.map((emoji, index) => (
            <motion.div
              key={`dance-${index}`}
              className="absolute text-4xl md:text-5xl"
              initial={{ x: `${Math.random() * 100}%`, y: `${70 + Math.random() * 30}%`, opacity: 0, scale: 0.5 }}
              animate={{
                y: `${60 + Math.random() * 40}%`, // Bounce lower
                x: `${Math.random() * 100}%`,
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.5],
                rotate: Math.random() * 720 - 360,
                transition: {
                  repeat: Infinity,
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }
              }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Speakers (Enhanced) */}
        {[ { side: 'left', delay: 0 }, { side: 'right', delay: 0.15 } ].map(speaker => (
          <div key={speaker.side} className={`absolute bottom-[10%] ${speaker.side}-[5%] transition-opacity duration-500 ${danceMode ? 'opacity-70' : 'opacity-40'}`}>
            <div className="relative h-36 w-24 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg border-2 border-gray-700 shadow-lg">
              {/* Speaker Cone */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-gray-900 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                <motion.div
                  className="h-16 w-16 rounded-full bg-gradient-radial from-gray-700 via-gray-800 to-gray-700"
                  animate={{ scale: danceMode && partyAudio.isPlaying ? [1, 1.08, 1] : 1 }} // Pulse only if music is playing
                  transition={{
                    repeat: Infinity,
                    duration: (60 / 120) / 2, // Assuming ~120 BPM, pulse on beat
                    ease: "easeInOut",
                    delay: speaker.delay
                  }}
                />
                {/* Subtle cone texture */}
                <div className="absolute inset-0 bg-repeat opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23555555\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
              </div>
              {/* Speaker Feet */}
              <div className="absolute -bottom-1 left-0 w-full flex justify-between px-3">
                <div className="h-2 w-4 bg-gray-600 rounded-b-sm shadow-inner"></div>
                <div className="h-2 w-4 bg-gray-600 rounded-b-sm shadow-inner"></div>
              </div>
            </div>
          </div>
        ))}


        {/* Disco Ball and Banner Setup */}
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center z-10"> {/* Ensure banner is above some effects */}
          {/* Disco Ball */}
          <motion.div
            className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-radial from-gray-300 via-gray-500 to-gray-400 overflow-hidden border-2 border-gray-600 mt-[-40px] shadow-xl"
            variants={discoBallVariants}
            animate={danceMode ? "animate" : ""}
            style={{ filter: 'brightness(1.1)' }}
          >
            {/* Reflective squares */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-px opacity-90">
              {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`bg-white/50`}
                  initial={{ opacity: Math.random() * 0.5 + 0.3 }}
                  animate={danceMode ? { opacity: [0.3, 0.8, 0.5, 0.9, 0.3], backgroundColor: ["#ffffff80", "#aaaaff80", "#ffaaff80", "#aaffff80", "#ffffff80"] } : {}}
                  transition={danceMode ? { duration: 0.5 + Math.random() * 1, repeat: Infinity, delay: Math.random() * 0.5 } : {}}
                />
              ))}
            </div>
             {/* Inner shine */}
            <div className="absolute inset-2 rounded-full bg-gradient-radial from-white/30 via-transparent to-transparent"></div>
          </motion.div>

          {/* Birthday Banner */}
          <div className="relative w-full max-w-2xl mt-5">
            {/* Strings */}
            <div className="absolute top-0 left-[15%] h-10 w-px bg-gray-400/70 transform -rotate-[15deg]"></div>
            <div className="absolute top-0 right-[15%] h-10 w-px bg-gray-400/70 transform rotate-[15deg]"></div>

            {/* Banner */}
            <motion.div
              className={`mx-auto px-6 py-3 md:px-8 md:py-4 shadow-lg text-center font-bold text-xl md:text-2xl transition-all duration-500 max-w-lg ${
                danceMode
                  ? `bg-black/80 border-2 border-pink-500 text-pink-300 ${textNeonGlow('#FF4F8B')}`
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
              }`}
              animate={danceMode ? { y: [0, -4, 0], scale: [1, 1.02, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] } : {}}
              transition={danceMode ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : {}}
              style={{
                borderRadius: '8px 8px 60% 60% / 8px 8px 40% 40%', // More pronounced curve
                borderBottom: '8px solid',
                borderBottomColor: danceMode ? '#FF4F8B' : '#9333EA',
                textShadow: danceMode ? `0 0 4px #fff, 0 0 8px #fff, 0 0 12px #FF4F8B, 0 0 16px #FF4F8B` : '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              🎉 Happy Birthday, {friendName}! 🎉
            </motion.div>
          </div>
        </div>

        {/* Dance Mode Light Effects */}
        <AnimatePresence>
          {danceMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Sweeping Color Lights */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`color-light-${i}`}
                  className="absolute top-[-50px] left-1/2 w-4 md:w-6 h-[150vh] opacity-30" // Thicker, start higher
                  style={{
                    originX: '50%', originY: '0px',
                    backgroundColor: ['#FF4F8B', '#A259FF', '#FFC84F', '#4FFFCA', '#FF1493', '#00FFFF'][i], // More colors
                    mixBlendMode: 'color-dodge', // Try different blend modes
                    filter: 'blur(10px)', // Softer edges
                  }}
                  initial={{ rotate: (i * 60) + 10, opacity: 0, scaleY: 0 }}
                  animate={{
                    opacity: [0, 0.4, 0.4, 0],
                    rotate: [(i * 60) + 10, (i * 60) + 40],
                    scaleY: [0, 1, 1, 0], // Animate scale for appearance
                  }}
                  transition={{
                    opacity: { duration: 3, repeat: Infinity, delay: i * 0.4 },
                    rotate: { duration: 8, repeat: Infinity, ease: "linear", delay: i * 0.4 },
                    scaleY: { duration: 3, repeat: Infinity, delay: i * 0.4 }
                  }}
                />
              ))}

              {/* Dynamic White Beams */}
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={`beam-${i}`}
                  className="absolute top-[-50px] left-1/2 w-1 md:w-2 h-[180vh] bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-50"
                  style={{ originX: '50%', originY: '0px', mixBlendMode: 'overlay' }}
                  initial={{ rotate: Math.random() * 360 - 180, opacity: 0, y: -50 }}
                  animate={{
                    rotate: Math.random() * 180 - 90 + (i * 51), // More controlled spread
                    opacity: [0, 0.6, 0.6, 0],
                    y: [-50, 0, 0, -50],
                    transition: {
                      repeat: Infinity,
                      duration: 4 + Math.random() * 4,
                      ease: "linear",
                      delay: Math.random() * 3
                    }
                  }}
                />
              ))}

              {/* Subtle background pulse */}
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0], transition: { repeat: Infinity, duration: (60/120)*2, ease: "easeInOut" } }} // Sync with BPM
              />

              {/* Strobe Effect */}
               <motion.div
                className="absolute inset-0 bg-white z-20" // High z-index
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }} // Quick flash
                transition={{
                  repeat: Infinity,
                  duration: 1.5, // Control frequency
                  ease: "linear",
                  repeatDelay: 2 // Gap between strobes
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Interactive Scene Elements (z-20 / z-30) --- */}

      {/* Button Group Container */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex justify-center items-center gap-4 md:gap-6">

        {/* DJ Booth / Music Button */}
        <motion.button
          onClick={() => setShowSongList(true)}
          // className={`fixed bottom-[20%] left-[8%] md:left-[12%] z-20 ${buttonStyles('pink', false, partyAudio.isLoading)}`} // Removed positioning
          className={`${buttonStyles('pink', false, partyAudio.isLoading)}`} // Keep base styles
          whileHover={{ scale: 1.08, y: -6, filter: danceMode ? 'brightness(1.3)' : 'brightness(1.1)' }}
          whileTap={{ scale: 0.92 }}
          aria-label="Open DJ Booth / Song List"
        >
          <Music size={danceMode ? 44 : 38} className={`mb-1 md:mb-2 transition-colors duration-500 ${danceMode ? 'text-pink-400' : 'text-red-600'}`} />
          <p className={`font-bold text-sm md:text-base transition-colors duration-500 ${danceMode ? `text-pink-300 ${textNeonGlow('#FF4F8B')}` : 'text-red-800'}`}>DJ Booth</p>
        </motion.button>

        {/* Ambient Sound Control Button */}
        <motion.button
          onClick={ambientAudio.togglePlay}
          // className={`fixed bottom-[8%] left-1/2 transform -translate-x-1/2 z-20 ${buttonStyles('green', ambientAudio.isPlaying, ambientAudio.isLoading)}`} // Removed positioning
          className={`${buttonStyles('green', ambientAudio.isPlaying, ambientAudio.isLoading)}`} // Keep base styles
          whileHover={{ scale: 1.08, y: -6, filter: danceMode ? 'brightness(1.3)' : 'brightness(1.1)' }}
          whileTap={{ scale: 0.92 }}
          aria-label={ambientAudio.isPlaying ? "Turn Crowd Sound Off" : "Turn Crowd Sound On"}
        >
          {ambientAudio.isPlaying ? (
            <Volume2 size={danceMode ? 44 : 38} className={`mb-1 md:mb-2 transition-colors duration-500 ${danceMode ? 'text-green-400' : 'text-green-600'}`} />
          ) : (
            <VolumeX size={danceMode ? 44 : 38} className={`mb-1 md:mb-2 transition-colors duration-500 ${danceMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
          <p className={`font-bold text-sm md:text-base transition-colors duration-500 ${
            ambientAudio.isPlaying
              ? danceMode ? `text-green-300 ${textNeonGlow('#34D399')}` : 'text-green-800'
              : danceMode ? `text-gray-400` : 'text-gray-800'
          }`}>
            {ambientAudio.isPlaying ? "Crowd On" : "Crowd Off"}
          </p>
           {/* Display loading/error for ambient sound */}
           {ambientAudio.isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl"><div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div></div>}
           {ambientAudio.error && !ambientAudio.isLoading && <div className="absolute -bottom-5 text-xs text-red-400">Error</div>}
           {ambientAudio.autoplayBlocked && !ambientAudio.isPlaying && !ambientAudio.isLoading && <div className="absolute -bottom-5 text-xs text-yellow-400">Click to enable</div>}
        </motion.button>

        {/* Photo Booth Button */}
        <motion.button
          onClick={openPhotoBooth}
          // className={`fixed bottom-[20%] right-[8%] md:right-[12%] z-20 ${buttonStyles('cyan')}`} // Removed positioning
          className={`${buttonStyles('cyan')}`} // Keep base styles
          whileHover={{ scale: 1.08, y: -6, filter: danceMode ? 'brightness(1.3)' : 'brightness(1.1)' }}
          whileTap={{ scale: 0.92 }}
          aria-label="Open Photo Booth"
        >
          <Camera size={danceMode ? 44 : 38} className={`mb-1 md:mb-2 transition-colors duration-500 ${danceMode ? 'text-cyan-400' : 'text-blue-600'}`} />
          <p className={`font-bold text-sm md:text-base transition-colors duration-500 ${danceMode ? `text-cyan-300 ${textNeonGlow('#4FFFCA')}` : 'text-blue-800'}`}>Photo Booth</p>
        </motion.button>

      </div> {/* End Button Group Container */}


      {/* Dance Mode Toggle */}
      <motion.div
        className="fixed top-[calc(50%-20px)] left-2/5 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center" 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.button
          onClick={toggleDanceMode}
          className={`relative w-44 h-20 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center text-white font-bold border-2 ${
            danceMode
              ? 'bg-gradient-to-br from-purple-600 via-fuchsia-700 to-indigo-800 border-purple-400/50'
              : 'bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 border-pink-300/50'
          } ${neonGlow}`}
          whileHover={{ scale: 1.05, filter: 'brightness(1.15)' }}
          whileTap={{ scale: 0.95 }}
          aria-label={danceMode ? "Turn Party Mode Off" : "Turn Party Mode On"}
        >
          <motion.div
            className="absolute top-1.5 left-1.5 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden" // Slightly larger handle
            animate={{ x: danceMode ? 90 : 0 }} // Adjusted travel distance
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {danceMode ? <Zap size={32} className="text-yellow-400 animate-pulse" /> : <Disc3 size={30} className="text-pink-500"/>}
          </motion.div>
          <span className={`absolute transition-opacity duration-200 font-semibold ${danceMode ? 'opacity-0 left-4' : 'opacity-100 right-6'}`}>PARTY</span>
          <span className={`absolute transition-opacity duration-200 font-semibold ${danceMode ? 'opacity-100 left-8 font-mono tracking-wider' : 'opacity-0 right-4'}`}>CLUB</span>
        </motion.button>
        <p className={`mt-4 text-sm font-semibold transition-colors duration-500 ${danceMode ? `text-purple-300 ${textNeonGlow()}` : 'text-gray-800/90'}`}>
          {danceMode ? "FEEL THE BEAT!" : "Ready to Party?"}
        </p>
         {/* Display loading/error for party audio */}
         {partyAudio.isLoading && !partyAudio.isPlaying && <div className="mt-1 text-xs text-yellow-300">Loading Music...</div>}
         {partyAudio.error && !partyAudio.isLoading && <div className="mt-1 text-xs text-red-400">Music Error!</div>}
         {partyAudio.autoplayBlocked && !partyAudio.isPlaying && !partyAudio.isLoading && <div className="mt-1 text-xs text-yellow-400">Click Party On!</div>}
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={handleBackToCategories}
        className={exitButtonStyles}
        whileHover={{ scale: 1.05, filter: danceMode ? 'brightness(1.4)' : 'brightness(1.1)' }}
        whileTap={{ scale: 0.95 }}
        aria-label={danceMode ? 'Exit Club' : 'Exit Party Room'}
      >
        <ArrowLeft size={18} className="mr-2" />
        {danceMode ? 'EXIT CLUB' : 'Exit Room'}
      </motion.button>
    </motion.div>
  )
}

export default PartyRoom