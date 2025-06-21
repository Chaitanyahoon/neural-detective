"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, FileText, Camera, Wrench, Smartphone, Brain, Eye, Zap, Search } from "lucide-react"
import type { Evidence } from "@/app/page"

interface EvidenceBoardProps {
  evidence: Evidence[]
}

export function EvidenceBoard({ evidence }: EvidenceBoardProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<Record<string, string[]>>({})

  const getEvidenceIcon = (type: Evidence["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="w-6 h-6" />
      case "photo":
        return <Camera className="w-6 h-6" />
      case "physical":
        return <Wrench className="w-6 h-6" />
      case "digital":
        return <Smartphone className="w-6 h-6" />
    }
  }

  const getEvidenceColor = (type: Evidence["type"]) => {
    switch (type) {
      case "document":
        return "border-blue-500/50 text-blue-400 bg-blue-500/10"
      case "photo":
        return "border-purple-500/50 text-purple-400 bg-purple-500/10"
      case "physical":
        return "border-green-500/50 text-green-400 bg-green-500/10"
      case "digital":
        return "border-amber-500/50 text-amber-400 bg-amber-500/10"
    }
  }

  const getEvidenceGradient = (type: Evidence["type"]) => {
    switch (type) {
      case "document":
        return "bg-gradient-to-br from-blue-900/30 to-blue-950/50"
      case "photo":
        return "bg-gradient-to-br from-purple-900/30 to-purple-950/50"
      case "physical":
        return "bg-gradient-to-br from-green-900/30 to-green-950/50"
      case "digital":
        return "bg-gradient-to-br from-amber-900/30 to-amber-950/50"
    }
  }

  const analyzeEvidence = (evidenceItem: Evidence) => {
    setAnalyzing(evidenceItem.id)

    // Enhanced AI analysis with more detailed results
    setTimeout(() => {
      const analysisTypes = {
        document: [
          "🔍 Handwriting analysis reveals stress patterns",
          "📊 Paper composition matches high-end stationery",
          "🧬 Fingerprint traces detected on edges",
          "⚡ Ink analysis shows recent composition",
          "🎯 Document authenticity: 94% verified",
        ],
        photo: [
          "📸 Metadata analysis reveals timestamp manipulation",
          "🔬 Image enhancement shows hidden details",
          "👁️ Facial recognition identifies key subjects",
          "🌟 Lighting analysis suggests indoor environment",
          "🎯 Photo authenticity: 87% verified",
        ],
        physical: [
          "🧬 DNA traces detected from multiple sources",
          "🔬 Material composition analysis complete",
          "📊 Wear patterns suggest recent handling",
          "⚡ Chemical residue indicates specific location",
          "🎯 Evidence integrity: 96% confirmed",
        ],
        digital: [
          "💾 Data recovery reveals deleted communications",
          "🔐 Encryption patterns analyzed",
          "📱 Device fingerprinting complete",
          "🌐 Network traffic analysis shows connections",
          "🎯 Digital forensics: 91% complete",
        ],
      }

      const analysis = analysisTypes[evidenceItem.type] || [
        "🔬 Forensic analysis complete",
        "🧬 Trace evidence detected",
        "📊 Pattern analysis reveals connections",
        "🎯 Suspect correlation identified",
      ]

      setAnalysisResults((prev) => ({
        ...prev,
        [evidenceItem.id]: analysis,
      }))
      setAnalyzing(null)
    }, 3000)
  }

  return (
    <Card className="p-6 bg-black/95 border-red-500/30 shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-red-200 flex items-center">
            <Package className="w-8 h-8 mr-3 text-amber-400" />
            EVIDENCE VAULT
          </h3>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 px-3 py-1">
              {evidence.length} ITEMS SECURED
            </Badge>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {evidence.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <Package className="w-20 h-20 text-red-600 mx-auto opacity-50" />
              <Search className="w-8 h-8 text-amber-400 absolute top-0 right-1/2 animate-bounce" />
            </div>
            <p className="text-red-400 text-xl font-bold">EVIDENCE VAULT EMPTY</p>
            <p className="text-sm text-red-500 mt-2">Search locations to collect crucial evidence</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {evidence.map((item, index) => (
              <Card
                key={item.id}
                className={`p-6 ${getEvidenceGradient(item.type)} border-2 ${getEvidenceColor(item.type).split(" ")[0]} hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg ${
                  selectedEvidence?.id === item.id ? "ring-4 ring-red-500 shadow-red-500/50" : ""
                }`}
                onClick={() => setSelectedEvidence(selectedEvidence?.id === item.id ? null : item)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${getEvidenceColor(item.type)} shadow-lg`}>
                        {getEvidenceIcon(item.type)}
                      </div>
                      <div>
                        <span className="font-bold text-red-200 text-lg">{item.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={`${getEvidenceColor(item.type)} text-xs font-bold`}>
                            {item.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 text-xs">
                            ITEM #{String(index + 1).padStart(3, "0")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Eye className={`w-6 h-6 ${selectedEvidence?.id === item.id ? "text-red-400" : "text-gray-500"}`} />
                  </div>

                  <div className="bg-black/50 p-4 rounded-lg border border-red-600/30">
                    <p className="text-sm text-red-300 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.suspectConnections.map((suspectId) => (
                      <Badge
                        key={suspectId}
                        variant="outline"
                        className="text-xs border-amber-500/50 text-amber-400 bg-amber-500/10 font-bold"
                      >
                        🎯 {suspectId.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>

                  {selectedEvidence?.id === item.id && (
                    <div className="mt-6 p-6 bg-black/70 rounded-lg border-2 border-red-600/50 shadow-inner">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-red-200 flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-purple-400" />
                          AI FORENSIC ANALYSIS
                        </h4>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            analyzeEvidence(item)
                          }}
                          disabled={analyzing === item.id}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/30"
                        >
                          {analyzing === item.id ? (
                            <>
                              <Brain className="w-4 h-4 mr-2 animate-spin" />
                              ANALYZING...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              RUN ANALYSIS
                            </>
                          )}
                        </Button>
                      </div>

                      {analysisResults[item.id] && (
                        <div className="space-y-3">
                          {analysisResults[item.id].map((result, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-green-300 p-3 bg-green-900/20 rounded border border-green-500/30 animate-fadeIn"
                              style={{ animationDelay: `${idx * 0.2}s` }}
                            >
                              {result}
                            </div>
                          ))}
                          <div className="mt-4 p-3 bg-blue-900/20 rounded border border-blue-500/30">
                            <p className="text-xs text-blue-300 font-bold">
                              ⚡ ANALYSIS COMPLETE - Evidence processed and catalogued
                            </p>
                          </div>
                        </div>
                      )}

                      {!analysisResults[item.id] && analyzing !== item.id && (
                        <div className="text-center py-6">
                          <Brain className="w-12 h-12 text-purple-600 mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-red-400">
                            Click "RUN ANALYSIS" to examine this evidence with advanced AI forensics
                          </p>
                        </div>
                      )}

                      {analyzing === item.id && (
                        <div className="text-center py-6">
                          <div className="relative">
                            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-pulse" />
                            <div className="absolute inset-0 w-12 h-12 mx-auto border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <p className="text-sm text-purple-300 font-bold">AI FORENSIC ANALYSIS IN PROGRESS...</p>
                          <div className="mt-2 w-32 h-2 bg-purple-900/50 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
