"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, User, MapPin, Clock } from "lucide-react"
import type { GameState } from "@/app/page"

interface CaseFileProps {
  onContinue: () => void
  gameState: GameState
}

export function CaseFile({ onContinue, gameState }: CaseFileProps) {
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-slate-200">Case File #2024-001</h1>
            </div>
            <h2 className="text-xl text-blue-400">The Vanishing Heir</h2>
            <Badge variant="outline" className="border-red-500/30 text-red-400">
              HIGH PRIORITY
            </Badge>
          </div>
        </Card>

        {/* Case Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-green-400" />
              Missing Person
            </h3>
            <div className="space-y-3">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center text-4xl">👤</div>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-slate-300">Name:</span> Alexander Blackwood
                </p>
                <p>
                  <span className="font-medium text-slate-300">Age:</span> 32
                </p>
                <p>
                  <span className="font-medium text-slate-300">Status:</span> Heir to Blackwood Industries
                </p>
                <p>
                  <span className="font-medium text-slate-300">Last Seen:</span> October 15th, 11:30 PM
                </p>
                <p>
                  <span className="font-medium text-slate-300">Location:</span> Blackwood Mansion
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-amber-400" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="border-l-2 border-slate-600 pl-4 space-y-3">
                <div>
                  <p className="font-medium text-slate-300">October 15th, 6:00 PM</p>
                  <p className="text-sm text-slate-400">Family dinner at the mansion</p>
                </div>
                <div>
                  <p className="font-medium text-slate-300">October 15th, 9:00 PM</p>
                  <p className="text-sm text-slate-400">Alexander leaves for his office</p>
                </div>
                <div>
                  <p className="font-medium text-slate-300">October 15th, 11:30 PM</p>
                  <p className="text-sm text-slate-400">Last confirmed sighting</p>
                </div>
                <div>
                  <p className="font-medium text-slate-300">October 16th, 8:00 AM</p>
                  <p className="text-sm text-slate-400">Reported missing by family</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Case Summary */}
        <Card className="p-6 bg-slate-800 border-slate-700">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Case Summary</h3>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-300 leading-relaxed">
              Alexander Blackwood, heir to the Blackwood Industries fortune, vanished without a trace on the night of
              October 15th. He was last seen leaving the family mansion around 11:30 PM, claiming he needed to return to
              his office for urgent business matters.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              The family reported him missing when he failed to appear for an important board meeting the following
              morning. His car was found abandoned in the company parking garage, but there were no signs of struggle or
              foul play at the scene.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Initial investigations have revealed tensions within the family and business, with several individuals
              having potential motives. Your task is to investigate the key locations, gather evidence, and interrogate
              the suspects to uncover the truth.
            </p>
          </div>
        </Card>

        {/* Suspects Overview */}
        <Card className="p-6 bg-slate-800 border-slate-700">
          <h3 className="text-xl font-semibold text-slate-200 mb-4">Primary Suspects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">👨‍💼</span>
                <div>
                  <p className="font-medium text-slate-200">Marcus Blackwood</p>
                  <p className="text-sm text-slate-400">Younger Brother</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Known gambling debts, stands to inherit</p>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">👩‍💼</span>
                <div>
                  <p className="font-medium text-slate-200">Victoria Blackwood</p>
                  <p className="text-sm text-slate-400">Stepmother</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Controls estate if heir is declared dead</p>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">👨‍💻</span>
                <div>
                  <p className="font-medium text-slate-200">Richard Sterling</p>
                  <p className="text-sm text-slate-400">Business Partner</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Financial irregularities in company books</p>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">👩‍🔧</span>
                <div>
                  <p className="font-medium text-slate-200">Sarah Chen</p>
                  <p className="text-sm text-slate-400">Former Employee</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Fired for alleged theft, seeking revenge</p>
            </div>
          </div>
        </Card>

        {/* Investigation Areas */}
        <Card className="p-6 bg-slate-800 border-slate-700">
          <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            Key Investigation Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium text-slate-300">🏠 Blackwood Mansion</p>
              <p className="text-sm text-slate-400">Family home, scene of last confirmed sighting</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-300">🏢 Corporate Office</p>
              <p className="text-sm text-slate-400">Business headquarters, financial records</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-300">🚗 Private Garage</p>
              <p className="text-sm text-slate-400">Where the missing person's car was found</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-300">🌲 Blackwood Forest</p>
              <p className="text-sm text-slate-400">Dense woods behind the estate</p>
            </div>
          </div>
        </Card>

        {/* AI Assistant Info */}
        <Card className="p-6 bg-slate-800 border-slate-700 border-blue-500/30">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Neural Detective AI Assistant</h3>
          <div className="space-y-3">
            <p className="text-slate-300">You have access to an advanced AI interrogation system that can help you:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4">
              <li>Analyze suspect responses and detect inconsistencies</li>
              <li>Suggest optimal questioning strategies based on evidence</li>
              <li>Track trust levels and emotional states during interrogations</li>
              <li>Connect evidence to build a comprehensive case</li>
            </ul>
            <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
              <p className="text-blue-300 text-sm">
                💡 <strong>Tip:</strong> Different interrogation approaches (calm, aggressive, logical) will yield
                different results based on each suspect's personality and current mood.
              </p>
            </div>
          </div>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button onClick={onContinue} size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
            Begin Investigation
          </Button>
        </div>
      </div>
    </div>
  )
}
