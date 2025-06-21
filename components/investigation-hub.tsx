"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Users, Brain, Eye, AlertCircle } from "lucide-react"
import { GameCanvas } from "@/components/game-canvas"
import { EvidenceBoard } from "@/components/evidence-board"
import type { Location, Evidence, GameState } from "@/app/page"

interface InvestigationHubProps {
  locations: Location[]
  evidence: Evidence[]
  gameState: GameState
  onVisitLocation: (locationId: string) => void
  onDiscoverEvidence: (evidenceId: string) => void
  onGoToInterrogation: () => void
  onGoToDeduction: () => void
}

export function InvestigationHub({
  locations,
  evidence,
  gameState,
  onVisitLocation,
  onDiscoverEvidence,
  onGoToInterrogation,
  onGoToDeduction,
}: InvestigationHubProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [searchingLocation, setSearchingLocation] = useState<string | null>(null)

  const visitLocation = (locationId: string) => {
    console.log("Visiting location:", locationId)
    onVisitLocation(locationId)
    setSelectedLocation(locationId)

    // Automatically discover one piece of evidence when first visiting a location
    const location = locations.find((l) => l.id === locationId)
    if (location && !location.visited) {
      const availableEvidence = location.evidenceIds
        .map((id) => evidence.find((e) => e.id === id))
        .filter((e) => e && !e.discovered)

      if (availableEvidence.length > 0) {
        // Automatically discover the first piece of evidence
        setTimeout(() => {
          onDiscoverEvidence(availableEvidence[0]!.id)
        }, 1000)
      }
    }
  }

  const searchForEvidence = async (locationId: string) => {
    const location = locations.find((l) => l.id === locationId)
    if (!location || !location.visited) return

    setSearchingLocation(locationId)

    // Get ALL evidence for this location, not just discovered ones
    const allLocationEvidence = location.evidenceIds
      .map((id) => evidence.find((e) => e.id === id))
      .filter((e) => e) as Evidence[]

    const undiscoveredEvidence = allLocationEvidence.filter((e) => !e.discovered)

    console.log(`Searching ${location.name}:`, {
      total: allLocationEvidence.length,
      undiscovered: undiscoveredEvidence.length,
      evidenceIds: location.evidenceIds,
    })

    if (undiscoveredEvidence.length === 0) {
      setTimeout(() => {
        setSearchingLocation(null)
      }, 2000)
      return
    }

    // Always discover evidence after delay
    setTimeout(() => {
      const randomEvidence = undiscoveredEvidence[Math.floor(Math.random() * undiscoveredEvidence.length)]
      if (randomEvidence) {
        console.log("Discovering evidence:", randomEvidence.name)
        onDiscoverEvidence(randomEvidence.id)
      }
      setSearchingLocation(null)
    }, 2500)
  }

  // Get all evidence from the main evidence array, not just discovered ones
  const allEvidence = evidence
  const discoveredEvidence = allEvidence.filter((e) => e.discovered)

  const canGoToInterrogation = discoveredEvidence.length >= 2
  const canGoToDeduction = discoveredEvidence.length >= 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/10 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-black/95 to-red-950/90 border-red-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full border border-blue-500/50">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-red-200">Investigation Hub</h1>
                <p className="text-red-300 text-lg">Uncover the dark truth behind the disappearance</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 px-3 py-1">
                {gameState.locationsVisited.length}/{locations.length} Locations
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10 px-3 py-1">
                {discoveredEvidence.length}/12 Evidence
              </Badge>
            </div>
          </div>
        </Card>

        {/* Quick Start Guide */}
        {gameState.locationsVisited.length === 0 && (
          <Card className="p-4 bg-blue-950/30 border-blue-500/30">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-blue-400">How to Play</h3>
                <p className="text-blue-200 text-sm">
                  1. Click on locations on the map to visit them 2. Search for evidence at each location 3. Collect
                  evidence to unlock interrogations 4. Question suspects to solve the case
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map and Location Details */}
          <div className="lg:col-span-2 space-y-6">
            <GameCanvas
              locations={locations}
              gameState={gameState}
              onLocationClick={visitLocation}
              selectedLocation={selectedLocation}
              searchingLocation={searchingLocation}
            />

            {/* Location Details */}
            {selectedLocation && (
              <Card className="p-6 bg-black/95 border-red-500/30">
                {(() => {
                  const location = locations.find((l) => l.id === selectedLocation)
                  if (!location) return null

                  // Get all evidence for this location from the main evidence array
                  const locationEvidence = location.evidenceIds
                    .map((id) => allEvidence.find((e) => e.id === id))
                    .filter((e) => e) as Evidence[]

                  const discoveredLocationEvidence = locationEvidence.filter((e) => e.discovered)
                  const undiscoveredLocationEvidence = locationEvidence.filter((e) => !e.discovered)

                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-red-200 mb-2">{location.name}</h3>
                        <p className="text-red-300">{location.description}</p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${location.visited ? "border-green-500/30 text-green-400" : "border-gray-500/30 text-gray-400"}`}
                        >
                          {location.visited ? "VISITED" : "UNVISITED"}
                        </Badge>
                      </div>

                      {location.visited ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-red-200">Evidence Status:</span>
                            <Badge variant="outline" className="border-green-500/30 text-green-400">
                              {discoveredLocationEvidence.length}/{locationEvidence.length} Found
                            </Badge>
                          </div>

                          {discoveredLocationEvidence.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-green-400">Discovered Evidence:</h4>
                              {discoveredLocationEvidence.map((ev) => (
                                <div
                                  key={ev.id}
                                  className="flex items-center space-x-3 p-3 bg-green-900/20 rounded border border-green-500/30"
                                >
                                  <Eye className="w-4 h-4 text-green-400" />
                                  <div>
                                    <span className="text-green-200 font-medium">{ev.name}</span>
                                    <p className="text-sm text-green-300">{ev.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {undiscoveredLocationEvidence.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-amber-400">Potential Evidence:</h4>
                              <p className="text-sm text-amber-300">
                                {undiscoveredLocationEvidence.length} more pieces of evidence may be hidden here...
                              </p>
                            </div>
                          )}

                          <Button
                            onClick={() => searchForEvidence(location.id)}
                            disabled={searchingLocation === location.id || undiscoveredLocationEvidence.length === 0}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
                            size="lg"
                          >
                            {searchingLocation === location.id ? (
                              <>
                                <Search className="w-5 h-5 mr-2 animate-spin" />
                                AI Analyzing Scene...
                              </>
                            ) : undiscoveredLocationEvidence.length > 0 ? (
                              <>
                                <Search className="w-5 h-5 mr-2" />
                                Search for More Evidence ({undiscoveredLocationEvidence.length} remaining)
                              </>
                            ) : (
                              <>
                                <Eye className="w-5 h-5 mr-2" />
                                All Evidence Found
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-blue-950/30 p-4 rounded border border-blue-500/30">
                            <p className="text-blue-200 text-sm">
                              Visit this location to begin your investigation and automatically discover initial
                              evidence.
                            </p>
                          </div>
                          <Button
                            onClick={() => visitLocation(location.id)}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            size="lg"
                          >
                            <MapPin className="w-5 h-5 mr-2" />
                            Investigate Location
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </Card>
            )}
          </div>

          {/* Evidence and Actions */}
          <div className="space-y-6">
            <EvidenceBoard evidence={discoveredEvidence} />

            {/* Objectives */}
            <Card className="p-4 bg-black/95 border-red-500/30">
              <h3 className="text-lg font-semibold text-red-200 mb-3">Investigation Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-300">Locations Visited</span>
                  <Badge
                    variant="outline"
                    className={`${gameState.locationsVisited.length >= 4 ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}
                  >
                    {gameState.locationsVisited.length}/4
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-300">Evidence Collected</span>
                  <Badge
                    variant="outline"
                    className={`${discoveredEvidence.length >= 8 ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}
                  >
                    {discoveredEvidence.length}/12
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-300">Ready for Interrogation</span>
                  <Badge
                    variant="outline"
                    className={`${canGoToInterrogation ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}
                  >
                    {canGoToInterrogation ? "YES" : "NO"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-300">Ready for Deduction</span>
                  <Badge
                    variant="outline"
                    className={`${canGoToDeduction ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}
                  >
                    {canGoToDeduction ? "YES" : "NO"}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onGoToInterrogation}
                disabled={!canGoToInterrogation}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50"
                size="lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Interrogate Suspects
                {!canGoToInterrogation && (
                  <span className="ml-2 text-xs">(Need {2 - discoveredEvidence.length} more evidence)</span>
                )}
              </Button>

              <Button
                onClick={onGoToDeduction}
                disabled={!canGoToDeduction}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50"
                size="lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                Make Deduction
                {!canGoToDeduction && (
                  <span className="ml-2 text-xs">(Need {5 - discoveredEvidence.length} more evidence)</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
