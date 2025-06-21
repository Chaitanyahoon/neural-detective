"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Brain, Users, Target, Volume2, VolumeX, Settings, Info, Skull, Eye } from "lucide-react"

interface MakePageProps {
  onStartGame: () => void
  onLoadGame: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

export function MakePage({ onStartGame, onLoadGame, soundEnabled, onToggleSound }: MakePageProps) {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [showCredits, setShowCredits] = useState(false)
  const [glitchEffect, setGlitchEffect] = useState(false)

  const detectiveQuotes = [
    "In the darkness of deception, only truth survives...",
    "Every shadow hides a secret. Every secret demands justice.",
    "The dead speak through evidence. The guilty betray themselves.",
    "AI sees what human eyes cannot... the patterns of guilt.",
    "Trust no one. Question everything. The truth is never what it seems.",
    "Behind every smile lies a potential killer.",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % detectiveQuotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 8000)
    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/30 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating eyes */}
        <div className="absolute top-20 left-10 w-4 h-4 text-red-400 animate-pulse opacity-60">👁️</div>
        <div className="absolute top-60 right-20 w-4 h-4 text-amber-400 animate-ping opacity-40">👁️</div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 text-purple-400 animate-bounce opacity-30">👁️</div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 text-red-500 animate-pulse opacity-50">👁️</div>

        {/* Floating geometric shapes with horror theme */}
        <div className="absolute top-1/4 left-1/6 w-8 h-8 border border-red-400/20 rotate-45 animate-spin opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/6 w-6 h-6 border border-purple-400/20 animate-pulse opacity-20"></div>

        {/* Creepy shadows */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Main Title Section */}
          <Card
            className={`p-8 bg-gradient-to-r from-black/95 to-red-950/90 border-red-500/30 backdrop-blur-sm shadow-2xl ${glitchEffect ? "animate-pulse" : ""}`}
          >
            <div className="text-center space-y-6">
              {/* Detective Iconic Avatar */}
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="w-full h-full bg-gradient-to-br from-red-600 via-black to-purple-700 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-red-500/50">
                  🕵️
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-red-400/50 animate-pulse"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-bounce">
                  <Skull className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Eye className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1
                  className={`text-5xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-red-600 bg-clip-text text-transparent ${glitchEffect ? "animate-bounce" : ""}`}
                >
                  Detective Iconic
                </h1>
                <h2 className="text-2xl font-semibold text-red-300 tracking-wider">Neural Crime Investigator</h2>
                <div className="h-16 flex items-center justify-center">
                  <p className="text-lg text-red-200 italic animate-fadeIn font-medium tracking-wide">
                    "{detectiveQuotes[currentQuote]}"
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-gradient-to-br from-red-950/70 to-black/70 p-4 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-300">
                  <Brain className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <h3 className="font-bold text-red-400">AI Investigation</h3>
                  <p className="text-xs text-red-200">Neural pattern analysis</p>
                </div>
                <div className="bg-gradient-to-br from-purple-950/70 to-black/70 p-4 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-bold text-purple-400">Dark Suspects</h3>
                  <p className="text-xs text-purple-200">Psychological profiling</p>
                </div>
                <div className="bg-gradient-to-br from-amber-950/70 to-black/70 p-4 rounded-lg border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300">
                  <Target className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h3 className="font-bold text-amber-400">Evidence Analysis</h3>
                  <p className="text-xs text-amber-200">Forensic reconstruction</p>
                </div>
                <div className="bg-gradient-to-br from-red-950/70 to-black/70 p-4 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-300">
                  <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <h3 className="font-bold text-red-400">Sinister Mystery</h3>
                  <p className="text-xs text-red-200">Uncover the darkness</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Game Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-red-950/40 to-black/90 border-red-500/30 backdrop-blur-sm hover:border-red-400/50 transition-all duration-300 hover:shadow-red-500/20 hover:shadow-2xl">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">New Investigation</h3>
                  <p className="text-red-200 text-sm mb-4 leading-relaxed">
                    Enter the shadows with Detective Iconic. Unravel the sinister mystery of the Vanishing Heir using
                    cutting-edge AI analysis and psychological profiling.
                  </p>
                </div>
                <Button
                  onClick={onStartGame}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 shadow-lg hover:shadow-red-500/30 transition-all duration-300 border border-red-500/50"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin the Hunt
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-950/40 to-black/90 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-2xl">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-400 mb-2">Continue Investigation</h3>
                  <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                    Return to your ongoing case. The darkness awaits your return, and the guilty fear your persistence.
                  </p>
                </div>
                <Button
                  onClick={onLoadGame}
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 font-bold py-3 transition-all duration-300"
                  size="lg"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Resume Case
                </Button>
              </div>
            </Card>
          </div>

          {/* Settings and Info */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={onToggleSound}
              className="text-red-400 hover:text-red-200 hover:bg-red-950/30 border border-red-500/30"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 mr-2" /> : <VolumeX className="w-5 h-5 mr-2" />}
              {soundEnabled ? "Audio On" : "Audio Off"}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowCredits(!showCredits)}
              className="text-purple-400 hover:text-purple-200 hover:bg-purple-950/30 border border-purple-500/30"
            >
              <Info className="w-5 h-5 mr-2" />
              About
            </Button>
          </div>

          {/* Credits Modal */}
          {showCredits && (
            <Card className="p-6 bg-black/95 border-red-600/50 backdrop-blur-sm shadow-2xl">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-400 text-center">About Detective Iconic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-red-200">
                  <div>
                    <h4 className="font-semibold text-red-300 mb-2">Dark Features:</h4>
                    <ul className="space-y-1">
                      <li>• AI-powered psychological profiling</li>
                      <li>• Dynamic suspect behavior analysis</li>
                      <li>• Forensic evidence reconstruction</li>
                      <li>• Multiple investigation paths</li>
                      <li>• Atmospheric horror soundscape</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-300 mb-2">Neural Technology:</h4>
                    <ul className="space-y-1">
                      <li>• Advanced dialogue generation</li>
                      <li>• Behavioral trust modeling</li>
                      <li>• Evidence correlation AI</li>
                      <li>• Adaptive horror storytelling</li>
                      <li>• Real-time case analysis</li>
                    </ul>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-red-600/30">
                  <p className="text-red-500 text-xs">
                    Detective Iconic - Where AI meets darkness in the pursuit of justice.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Case Preview */}
          <Card className="p-6 bg-gradient-to-r from-black/90 to-red-950/30 border-red-500/30 backdrop-blur-sm shadow-2xl">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 px-4 py-2 animate-pulse">
                CASE FILE: EXTREMELY DANGEROUS
              </Badge>
              <h3 className="text-2xl font-bold text-red-300">The Vanishing Heir</h3>
              <p className="text-red-200 max-w-2xl mx-auto leading-relaxed">
                Alexander Blackwood has vanished into the night, leaving behind a trail of blood, lies, and dark family
                secrets. Four suspects. Countless motives. One truth hidden in the shadows. Can Detective Iconic's AI
                uncover what human investigators missed, or will the guilty escape into the darkness forever?
              </p>
              <div className="flex justify-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-400">4</div>
                  <div className="text-red-500">Suspects</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-400">12</div>
                  <div className="text-amber-500">Evidence</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">4</div>
                  <div className="text-purple-500">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-400">∞</div>
                  <div className="text-red-500">Secrets</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
