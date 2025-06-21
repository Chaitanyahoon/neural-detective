"use client"

import { useEffect, useRef } from "react"
import type { GamePhase } from "@/app/page"

interface GameAudioProps {
  phase: GamePhase
}

export function GameAudio({ phase }: GameAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // In a real implementation, you would load different audio files
    // For now, we'll just create a simple audio context for ambient sounds

    const createAmbientSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

        const createTone = (frequency: number, duration: number, volume = 0.1) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1)
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + duration)
        }

        // Different ambient sounds for different phases
        switch (phase) {
          case "investigation":
            // Subtle investigation ambience
            setInterval(() => {
              if (Math.random() > 0.7) {
                createTone(200 + Math.random() * 100, 0.5, 0.05)
              }
            }, 3000)
            break

          case "interrogation":
            // Tense interrogation ambience
            setInterval(() => {
              if (Math.random() > 0.8) {
                createTone(150 + Math.random() * 50, 0.3, 0.03)
              }
            }, 2000)
            break

          case "deduction":
            // Thoughtful deduction ambience
            setInterval(() => {
              if (Math.random() > 0.6) {
                createTone(300 + Math.random() * 200, 0.8, 0.04)
              }
            }, 4000)
            break
        }
      } catch (error) {
        // Audio context not supported or blocked
        console.log("Audio context not available")
      }
    }

    if (phase !== "menu" && phase !== "briefing") {
      createAmbientSound()
    }
  }, [phase])

  return null // This component doesn't render anything visible
}
