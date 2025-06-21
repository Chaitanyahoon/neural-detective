"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Home } from "lucide-react"
import type { GameState, Suspect } from "@/app/page"

interface CaseConclusionProps {
  gameState: GameState
  suspects: Suspect[]
  onPlayAgain: () => void
  onMainMenu: () => void
}

export function CaseConclusion({ gameState, suspects, onPlayAgain, onMainMenu }: CaseConclusionProps) {
  const accusedSuspect = suspects.find((s) => s.id === gameState.finalAccusation)
  const correctSuspect = suspects.find((s) => s.id === "business_partner")

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-slate-900 flex items-center justify-center p-4">
      <Card className="p-8 max-w-2xl w-full bg-black/95 border-red-500/30 shadow-2xl">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-red-200">Case Closed</h2>

          {gameState.gameResult === "correct" ? (
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-semibold text-green-400 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 mr-2" />
                Correct Accusation!
              </h3>
              <div className="bg-green-900/30 p-6 rounded-lg border border-green-500/30">
                <p className="text-green-200 leading-relaxed">
                  Excellent detective work! <strong>{accusedSuspect?.name}</strong> was indeed the culprit. Richard
                  Sterling had been embezzling money from the company, and when Alexander discovered his scheme, he
                  orchestrated the disappearance to cover his tracks. The evidence you collected painted a clear picture
                  of his guilt.
                </p>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10 px-4 py-2">
                CASE SOLVED
              </Badge>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">❌</div>
              <h3 className="text-2xl font-semibold text-red-400 flex items-center justify-center">
                <XCircle className="w-8 h-8 mr-2" />
                Wrong Accusation
              </h3>
              <div className="bg-red-900/30 p-6 rounded-lg border border-red-500/30">
                <p className="text-red-200 leading-relaxed">
                  You accused <strong>{accusedSuspect?.name}</strong>, but the real culprit was{" "}
                  <strong>{correctSuspect?.name}</strong>. Richard Sterling had been embezzling funds and eliminated
                  Alexander when his crimes were about to be exposed. The evidence pointed to his guilt, but perhaps you
                  missed some crucial connections.
                </p>
              </div>
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 px-4 py-2">
                CASE UNSOLVED
              </Badge>
            </div>
          )}

          {/* Case Summary */}
          <div className="bg-black/50 p-6 rounded-lg border border-red-600/30">
            <h4 className="text-lg font-semibold text-red-200 mb-4">Investigation Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-red-400">Locations Visited:</span>
                <span className="text-red-200 ml-2">{gameState.locationsVisited.length}/4</span>
              </div>
              <div>
                <span className="text-red-400">Evidence Collected:</span>
                <span className="text-red-200 ml-2">{gameState.evidenceCollected.length}</span>
              </div>
              <div>
                <span className="text-red-400">Suspects Interrogated:</span>
                <span className="text-red-200 ml-2">{gameState.suspectInterrogated.length}/4</span>
              </div>
              <div>
                <span className="text-red-400">Final Accusation:</span>
                <span className="text-red-200 ml-2">{accusedSuspect?.name}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 justify-center">
            <Button
              onClick={onMainMenu}
              variant="outline"
              className="border-red-600/50 text-red-300 hover:bg-red-950/30"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Main Menu
            </Button>

            <Button
              onClick={onPlayAgain}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
