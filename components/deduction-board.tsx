"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Target, Link, CheckCircle } from "lucide-react"
import type { Suspect, Evidence, GameState } from "@/app/page"

interface DeductionBoardProps {
  suspects: Suspect[]
  evidence: Evidence[]
  gameState: GameState
  onMakeAccusation: (suspectId: string) => void
  onBackToInvestigation: () => void
}

interface Connection {
  evidenceId: string
  suspectId: string
  strength: "weak" | "moderate" | "strong"
}

export function DeductionBoard({
  suspects,
  evidence,
  gameState,
  onMakeAccusation,
  onBackToInvestigation,
}: DeductionBoardProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null)

  // Calculate evidence strength for each suspect
  const calculateSuspectScore = (suspectId: string) => {
    if (!evidence || !Array.isArray(evidence)) {
      return 0
    }

    const relevantEvidence = evidence.filter((e) => e.suspectConnections.includes(suspectId))
    const trustLevel = gameState.suspectTrustLevels?.[suspectId] || 50
    const mood = gameState.suspectMoods?.[suspectId] || "cooperative"

    let score = relevantEvidence.length * 10

    // Adjust based on trust level (lower trust = more suspicious)
    score += (100 - trustLevel) * 0.5

    // Adjust based on mood
    const moodMultiplier = {
      cooperative: 0.8,
      defensive: 1.2,
      hostile: 1.5,
      nervous: 1.3,
    }

    score *= moodMultiplier[mood] || 1

    return Math.round(score)
  }

  const getSuspectRanking = () => {
    if (!suspects || !Array.isArray(suspects)) {
      return []
    }

    return suspects
      .map((suspect) => ({
        ...suspect,
        score: calculateSuspectScore(suspect.id),
      }))
      .sort((a, b) => b.score - a.score)
  }

  const getConnectionStrength = (evidenceId: string, suspectId: string): "weak" | "moderate" | "strong" => {
    const evidenceItem = evidence?.find((e) => e.id === evidenceId)
    if (!evidenceItem || !evidenceItem.suspectConnections.includes(suspectId)) return "weak"

    const trustLevel = gameState.suspectTrustLevels?.[suspectId] || 50
    const relevantEvidenceCount = evidence?.filter((e) => e.suspectConnections.includes(suspectId)).length || 0

    if (trustLevel < 40 && relevantEvidenceCount >= 3) return "strong"
    if (trustLevel < 60 && relevantEvidenceCount >= 2) return "moderate"
    return "weak"
  }

  const rankedSuspects = getSuspectRanking()

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-slate-200">Deduction Board</h1>
                <p className="text-slate-400">Connect evidence to suspects and make your accusation</p>
              </div>
            </div>

            <Button onClick={onBackToInvestigation} variant="outline" className="border-slate-600 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Investigation
            </Button>
          </div>
        </Card>

        {/* AI Analysis */}
        <Card className="p-6 bg-slate-800 border-purple-500/30">
          <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Case Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-blue-400 mb-2">Evidence Strength</h3>
              <p className="text-sm text-slate-300">
                {evidence?.length >= 8
                  ? "Strong case with comprehensive evidence"
                  : evidence?.length >= 5
                    ? "Moderate evidence collected"
                    : "Limited evidence - investigate more locations"}
              </p>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-green-400 mb-2">Interrogation Results</h3>
              <p className="text-sm text-slate-300">
                {gameState.suspectInterrogated?.length >= 3
                  ? "Extensive information gathered"
                  : gameState.suspectInterrogated?.length >= 1
                    ? "Some key insights obtained"
                    : "More interrogation needed"}
              </p>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-amber-400 mb-2">Case Readiness</h3>
              <p className="text-sm text-slate-300">
                {evidence?.length >= 6 && gameState.suspectInterrogated?.length >= 2
                  ? "Ready to make accusation"
                  : "Gather more evidence before proceeding"}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evidence Web */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
              <Link className="w-5 h-5 mr-2 text-blue-400" />
              Evidence Connections
            </h3>

            <div className="space-y-4">
              {evidence && evidence.length > 0 ? (
                evidence.map((evidenceItem) => (
                  <div key={evidenceItem.id} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-200">{evidenceItem.name}</h4>
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                        {evidenceItem.type}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-400 mb-3">{evidenceItem.description}</p>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-300">Connected Suspects:</div>
                      <div className="flex flex-wrap gap-2">
                        {evidenceItem.suspectConnections.map((suspectId) => {
                          const suspect = suspects?.find((s) => s.id === suspectId)
                          const strength = getConnectionStrength(evidenceItem.id, suspectId)

                          return (
                            <Badge
                              key={suspectId}
                              variant="outline"
                              className={`text-xs ${
                                strength === "strong"
                                  ? "border-red-500/30 text-red-400"
                                  : strength === "moderate"
                                    ? "border-yellow-500/30 text-yellow-400"
                                    : "border-slate-500/30 text-slate-400"
                              }`}
                            >
                              {suspect?.name || suspectId} ({strength})
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Link className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No evidence collected yet</p>
                  <p className="text-sm text-slate-500">Return to investigation to gather evidence</p>
                </div>
              )}
            </div>
          </Card>

          {/* Suspect Rankings */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-400" />
              Suspect Analysis
            </h3>

            <div className="space-y-4">
              {rankedSuspects && rankedSuspects.length > 0 ? (
                rankedSuspects.map((suspect, index) => (
                  <div
                    key={suspect.id}
                    className={`bg-slate-700 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedSuspect === suspect.id
                        ? "border-red-500/50 bg-red-900/20"
                        : "border-transparent hover:border-slate-600"
                    }`}
                    onClick={() => setSelectedSuspect(suspect.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{suspect.avatar}</div>
                        <div>
                          <h4 className="font-medium text-slate-200">{suspect.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                              #{index + 1} Suspect
                            </Badge>
                            <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">
                              Score: {suspect.score}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {selectedSuspect === suspect.id && <CheckCircle className="w-6 h-6 text-red-400" />}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-slate-400">Trust Level</div>
                        <div className="text-sm font-medium text-blue-400">{suspect.trustLevel}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Evidence Count</div>
                        <div className="text-sm font-medium text-green-400">
                          {evidence?.filter((e) => e.suspectConnections.includes(suspect.id)).length || 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-slate-400">
                        <span className="font-medium">Motive:</span> {suspect.motive}
                      </div>
                      <div className="text-xs text-slate-400">
                        <span className="font-medium">Alibi:</span> {suspect.alibi}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No suspects available</p>
                  <p className="text-sm text-slate-500">Return to investigation to gather information</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Final Accusation */}
        <Card className="p-6 bg-slate-800 border-red-500/30">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Make Your Accusation</h3>

          {selectedSuspect ? (
            <div className="space-y-4">
              <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
                <p className="text-slate-200">
                  You are about to accuse{" "}
                  <span className="font-semibold text-red-400">
                    {suspects?.find((s) => s.id === selectedSuspect)?.name || "Unknown"}
                  </span>{" "}
                  of the crime. This decision is final and will determine the outcome of your case.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => onMakeAccusation(selectedSuspect)}
                  className="bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Make Final Accusation
                </Button>

                <Button
                  onClick={() => setSelectedSuspect(null)}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                  size="lg"
                >
                  Reconsider
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-2">Select a suspect from the analysis above</p>
              <p className="text-sm text-slate-500">Review the evidence connections and suspect rankings carefully</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
