"use client"

import { useEffect, useRef } from "react"
import type { GamePhase } from "@/app/page"

interface BackgroundMusicProps {
  phase: GamePhase
  enabled: boolean
  volume?: number
}

export function BackgroundMusic({ phase, enabled, volume = 0.3 }: BackgroundMusicProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const currentSoundRef = useRef<{
    oscillator?: OscillatorNode
    gainNode?: GainNode
    intervalId?: NodeJS.Timeout
  }>({})

  useEffect(() => {
    if (!enabled) {
      stopCurrentSound()
      return
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      if (audioContext.state === "suspended") {
        audioContext.resume()
      }

      stopCurrentSound()
      startPhaseMusic(phase, audioContext)
    } catch (error) {
      console.log("Audio context not available")
    }

    return () => stopCurrentSound()
  }, [phase, enabled, volume])

  const stopCurrentSound = () => {
    if (currentSoundRef.current.oscillator) {
      currentSoundRef.current.oscillator.stop()
    }
    if (currentSoundRef.current.intervalId) {
      clearInterval(currentSoundRef.current.intervalId)
    }
    currentSoundRef.current = {}
  }

  const createTone = (audioContext: AudioContext, frequency: number, duration: number, vol: number = volume) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(vol, audioContext.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)

    return { oscillator, gainNode }
  }

  const startPhaseMusic = (currentPhase: GamePhase, audioContext: AudioContext) => {
    switch (currentPhase) {
      case "menu":
        // Mysterious, welcoming theme
        const menuInterval = setInterval(() => {
          if (Math.random() > 0.3) {
            const notes = [261.63, 293.66, 329.63, 392.0, 440.0] // C, D, E, G, A
            const note = notes[Math.floor(Math.random() * notes.length)]
            createTone(audioContext, note, 1.5, volume * 0.4)
          }
        }, 2000)
        currentSoundRef.current.intervalId = menuInterval
        break

      case "briefing":
        // Dramatic, building tension
        const briefingInterval = setInterval(() => {
          if (Math.random() > 0.4) {
            const lowNotes = [130.81, 146.83, 164.81] // C3, D3, E3
            const note = lowNotes[Math.floor(Math.random() * lowNotes.length)]
            createTone(audioContext, note, 2.0, volume * 0.3)
          }
        }, 3000)
        currentSoundRef.current.intervalId = briefingInterval
        break

      case "investigation":
        // Subtle, investigative ambience
        const investigationInterval = setInterval(() => {
          if (Math.random() > 0.6) {
            const frequency = 200 + Math.random() * 100
            createTone(audioContext, frequency, 0.8, volume * 0.2)
          }
        }, 4000)
        currentSoundRef.current.intervalId = investigationInterval
        break

      case "interrogation":
        // Tense, dramatic
        const interrogationInterval = setInterval(() => {
          if (Math.random() > 0.5) {
            const tensionNotes = [110.0, 123.47, 138.59] // A2, B2, C#3
            const note = tensionNotes[Math.floor(Math.random() * tensionNotes.length)]
            createTone(audioContext, note, 1.2, volume * 0.25)
          }
        }, 2500)
        currentSoundRef.current.intervalId = interrogationInterval
        break

      case "deduction":
        // Thoughtful, analytical
        const deductionInterval = setInterval(() => {
          if (Math.random() > 0.4) {
            const thinkingNotes = [349.23, 392.0, 440.0, 493.88] // F4, G4, A4, B4
            const note = thinkingNotes[Math.floor(Math.random() * thinkingNotes.length)]
            createTone(audioContext, note, 1.8, volume * 0.3)
          }
        }, 3500)
        currentSoundRef.current.intervalId = deductionInterval
        break

      case "accusation":
        // Climactic, decisive
        const accusationInterval = setInterval(() => {
          if (Math.random() > 0.3) {
            const climaxNotes = [523.25, 587.33, 659.25] // C5, D5, E5
            const note = climaxNotes[Math.floor(Math.random() * climaxNotes.length)]
            createTone(audioContext, note, 1.0, volume * 0.4)
          }
        }, 1800)
        currentSoundRef.current.intervalId = accusationInterval
        break

      case "ending":
        // Resolution theme
        const endingInterval = setInterval(() => {
          if (Math.random() > 0.5) {
            const resolutionNotes = [261.63, 329.63, 392.0, 523.25] // C4, E4, G4, C5
            const note = resolutionNotes[Math.floor(Math.random() * resolutionNotes.length)]
            createTone(audioContext, note, 2.5, volume * 0.35)
          }
        }, 4000)
        currentSoundRef.current.intervalId = endingInterval
        break
    }
  }

  return null
}
