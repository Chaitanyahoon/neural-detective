"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, MessageCircle, Brain, Zap, Shield, Skull } from "lucide-react"
import { InterrogationRoom } from "@/components/interrogation-room"
import type { Suspect, Evidence, GameState } from "@/app/page"

interface InterrogationSystemProps {
  suspects: Suspect[]
  evidence: Evidence[]
  gameState: GameState
  onUpdateSuspect: (suspectId: string, updates: Partial<Suspect>) => void
  onBackToInvestigation: () => void
}

export function InterrogationSystem({
  suspects,
  evidence,
  gameState,
  onUpdateSuspect,
  onBackToInvestigation,
}: InterrogationSystemProps) {
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null)

  if (selectedSuspect) {
    const suspect = suspects.find((s) => s.id === selectedSuspect)
    if (!suspect) return null

    return (
      <InterrogationRoom
        suspect={suspect}
        evidence={evidence}
        onUpdateSuspect={onUpdateSuspect}
        onBack={() => setSelectedSuspect(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-black/95 to-red-950/90 border-red-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-full border border-red-500/50">
                <Users className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-red-200">Interrogation Chamber</h1>
                <p className="text-red-300 text-lg">Extract the truth from the shadows</p>
              </div>
            </div>
            <Button
              onClick={onBackToInvestigation}
              variant="outline"
              className="border-red-600/50 text-red-300 hover:bg-red-950/30"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Investigation
            </Button>
          </div>
        </Card>

        {/* AI Assistant Info */}
        <Card className="p-6 bg-gradient-to-r from-black/95 to-purple-950/30 border-purple-500/30 shadow-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-full border border-purple-500/50">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-purple-400">AI Psychological Profiler</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-950/50 to-black/70 p-6 rounded-lg border border-green-500/30">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="font-bold text-green-400">Calm Approach</h3>
              </div>
              <p className="text-green-200 text-sm">Build trust through empathy. Effective on cooperative suspects.</p>
            </div>

            <div className="bg-gradient-to-br from-red-950/50 to-black/70 p-6 rounded-lg border border-red-500/30">
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="w-6 h-6 text-red-400" />
                <h3 className="font-bold text-red-400">Aggressive Approach</h3>
              </div>
              <p className="text-red-200 text-sm">Apply pressure to break defenses. Risky but can reveal secrets.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-950/50 to-black/70 p-6 rounded-lg border border-blue-500/30">
              <div className="flex items-center space-x-3 mb-3">
                <Brain className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-blue-400">Logical Approach</h3>
              </div>
              <p className="text-blue-200 text-sm">Present evidence methodically. Most effective with proof.</p>
            </div>
          </div>
        </Card>

        {/* Suspects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suspects.map((suspect, index) => (
            <Card
              key={suspect.id}
              className="p-6 bg-gradient-to-br from-black/95 to-red-950/30 border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105 shadow-2xl cursor-pointer"
              onClick={() => setSelectedSuspect(suspect.id)}
            >
              <div className="space-y-4">
                {/* Suspect Header */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center text-3xl border-4 border-red-500/50">
                      {suspect.avatar}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <Skull className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-red-200">{suspect.name}</h3>
                    <p className="text-red-300 text-sm">{suspect.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/50 p-3 rounded border border-red-600/30">
                    <div className="text-xs text-red-400 mb-1">Trust Level</div>
                    <div className="text-lg font-bold text-blue-400">{suspect.trustLevel}%</div>
                    <div className="w-full bg-red-900/50 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${suspect.trustLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-black/50 p-3 rounded border border-red-600/30">
                    <div className="text-xs text-red-400 mb-1">Mood</div>
                    <Badge
                      variant="outline"
                      className={`${
                        suspect.mood === "cooperative"
                          ? "border-green-500/50 text-green-400"
                          : suspect.mood === "defensive"
                            ? "border-yellow-500/50 text-yellow-400"
                            : suspect.mood === "hostile"
                              ? "border-red-500/50 text-red-400"
                              : "border-purple-500/50 text-purple-400"
                      } text-xs`}
                    >
                      {suspect.mood.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-red-400 font-medium">Motive:</span>
                    <span className="text-red-200 ml-2">{suspect.motive}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-red-400 font-medium">Questions Asked:</span>
                    <span className="text-red-200 ml-2">{suspect.questionsAsked.length}</span>
                  </div>
                </div>

                {/* Interrogate Button */}
                <Button
                  onClick={() => setSelectedSuspect(suspect.id)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-bold py-3"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Begin Interrogation
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
