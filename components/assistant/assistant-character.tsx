'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from "@/lib/utils"

interface AssistantCharacterProps {
  isWaving?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AssistantCharacter({ isWaving, size = 'md', className }: AssistantCharacterProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={cn(`relative`, sizeClasses[size], className)}>
      <motion.div
        className="relative z-10"
        animate={isWaving ? {
          rotate: [0, 14, -8, 14, -4, 10, 0],
          transition: { duration: 2.5, ease: "easeInOut" }
        } : {}}
      >
        {/* Star shape base with gradient */}
        <div className="relative w-full h-full">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <defs>
              <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE5D9" />
                <stop offset="100%" stopColor="#FFD1C1" />
              </linearGradient>
              <mask id="starMask">
                <path
                  d="M12 2L14.4 8.8L21.6 9.2L16.8 14L18.4 21.2L12 17.8L5.6 21.2L7.2 14L2.4 9.2L9.6 8.8L12 2Z"
                  fill="white"
                />
              </mask>
            </defs>
            <path
              d="M12 2L14.4 8.8L21.6 9.2L16.8 14L18.4 21.2L12 17.8L5.6 21.2L7.2 14L2.4 9.2L9.6 8.8L12 2Z"
              className="fill-[url(#starGradient)] stroke-[#F8B195] stroke-2"
            />
            <rect
              x="0"
              y="0"
              width="24"
              height="24"
              mask="url(#starMask)"
              className="animate-[twinkle_2s_ease-in-out_infinite] fill-[url(#starGradient)]"
            />
          </svg>
        </div>

        {/* Sparkle */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: Infinity
          }}
        >
          <Star className="w-3 h-3 text-[#F8B195] fill-[#FFE5D9]" />
        </motion.div>

        {/* Anime-style Eyes */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
          <motion.div
            className="relative w-2 h-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Left Eye */}
            <div className="absolute inset-0 bg-[#6C5B7B] rounded-full" />
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full" />
          </motion.div>
          <motion.div
            className="relative w-2 h-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            {/* Right Eye */}
            <div className="absolute inset-0 bg-[#6C5B7B] rounded-full" />
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full" />
          </motion.div>
        </div>

        {/* Smile */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-3 h-2">
          <motion.div 
            className="w-full h-full border-b-2 border-[#6C5B7B] rounded-full"
            animate={{ 
              scaleX: [1, 1.2, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Floating sparkles */}
      <AnimatePresence>
        {isWaving && (
          <>
            <motion.div
              className="absolute -top-1 -left-1 w-2 h-2 text-[#F67280]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -10 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-2 h-2 text-[#F67280]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: 10 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ✨
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

