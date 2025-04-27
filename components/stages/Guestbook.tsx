import { useState } from "react"
import { motion } from "framer-motion"

type GuestbookProps = {
  handleBackToCategories: () => void
  friendName: string
}

// Sample messages - in a real app, these would come from a database or API
const birthdayMessages = [
  {
    id: 1,
    name: "Alex",
    message: "Happy birthday! Wishing you all the happiness in the world today and always.",
    emoji: "🎂"
  },
  {
    id: 2,
    name: "Sarah",
    message: "Many happy returns of the day! Hope your special day is filled with all the joy you deserve.",
    emoji: "🎉"
  },
  {
    id: 3,
    name: "Michael",
    message: "Happy birthday to an amazing friend! May your day be as wonderful as you are.",
    emoji: "🥳"
  },
  {
    id: 4,
    name: "Jessica",
    message: "Wishing you a fantastic birthday and a year filled with success and happiness!",
    emoji: "✨"
  },
  {
    id: 5,
    name: "David",
    message: "Happy birthday! Here's to another year of laughter, joy, and unforgettable memories!",
    emoji: "🎁"
  },
  {
    id: 6,
    name: "Emma",
    message: "Sending you warm wishes on your special day. Have an amazing birthday celebration!",
    emoji: "🎊"
  },
  {
    id: 7,
    name: "Ryan",
    message: "Many happy returns! May this year bring you prosperity, good health, and countless reasons to smile.",
    emoji: "🍰"
  }
]

const Guestbook = ({ handleBackToCategories, friendName }: GuestbookProps) => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [showThankYou, setShowThankYou] = useState(false)
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12
      }
    }
  }
  
  // Handle message selection
  const handleMessageClick = (id: number) => {
    setSelectedMessage(selectedMessage === id ? null : id)
  }
  
  // Handle message submission
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameInput.trim() && messageInput.trim()) {
      // In a real app, this would send data to a server
      // For this demo, just show thank you message
      setShowThankYou(true)
      setNameInput("")
      setMessageInput("")
      
      // Hide thank you message after 3 seconds
      setTimeout(() => {
        setShowThankYou(false)
      }, 3000)
    }
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <motion.div
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-pink-300"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center text-5xl mb-4" variants={itemVariants}>
          ✉️
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
          variants={itemVariants}
        >
          {friendName}'s Birthday Guestbook
        </motion.h2>
        
        <motion.p 
          className="text-center text-gray-600 mb-8"
          variants={itemVariants}
        >
          Birthday wishes from friends and family
        </motion.p>
        
        {/* Message cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
          variants={containerVariants}
        >
          {birthdayMessages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`p-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer ${
                selectedMessage === msg.id 
                  ? 'bg-gradient-to-r from-pink-100 to-purple-100 scale-[1.02] shadow-lg' 
                  : 'bg-gray-50 hover:bg-pink-50'
              }`}
              onClick={() => handleMessageClick(msg.id)}
              variants={itemVariants}
              whileHover={{ scale: selectedMessage === msg.id ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{msg.emoji}</div>
                <div>
                  <h3 className="font-bold text-purple-700">{msg.name}</h3>
                  <p className={`text-gray-700 transition-all duration-300 ${
                    selectedMessage === msg.id ? 'line-clamp-none' : 'line-clamp-2'
                  }`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Add a message form */}
        <motion.div
          className="bg-gray-50 p-6 rounded-xl mb-6"
          variants={itemVariants}
        >
          <h3 className="font-bold text-xl mb-4 text-purple-700">Leave a Birthday Message</h3>
          
          {showThankYou ? (
            <motion.div 
              className="bg-green-100 text-green-700 p-4 rounded-lg text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Thank you for your message! {friendName} will appreciate it.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmitMessage}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday Message
                </label>
                <textarea
                  id="message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Write your birthday message here..."
                  required
                />
              </div>
              
              <motion.button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Birthday Wish
              </motion.button>
            </form>
          )}
        </motion.div>
        
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleBackToCategories}
            className="px-6 py-2 bg-white text-purple-600 border-2 border-purple-300 font-medium rounded-full shadow-md hover:bg-purple-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Categories
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Guestbook