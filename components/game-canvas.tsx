"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import type { Location, GameState } from "@/app/page"

interface GameCanvasProps {
  locations: Location[]
  gameState: GameState
  onLocationClick: (locationId: string) => void
  selectedLocation: string | null
  searchingLocation: string | null
}

export function GameCanvas({
  locations,
  gameState,
  onLocationClick,
  selectedLocation,
  searchingLocation,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set proper canvas size
    canvas.width = 600
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw dark background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
    )
    gradient.addColorStop(0, "#1e1b4b")
    gradient.addColorStop(0.5, "#0f0f23")
    gradient.addColorStop(1, "#000000")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw connection lines between visited locations
    const visitedLocations = locations.filter((loc) => loc.visited)
    visitedLocations.forEach((location, index) => {
      if (index > 0) {
        const prevLocation = visitedLocations[index - 1]
        ctx.shadowColor = "#dc2626"
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.moveTo(prevLocation.x, prevLocation.y)
        ctx.lineTo(location.x, location.y)
        ctx.strokeStyle = "#dc2626"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    })

    // Draw locations with better positioning
    locations.forEach((location) => {
      const isVisited = location.visited
      const isCurrent = selectedLocation === location.id
      const isSearching = searchingLocation === location.id

      // Draw glow effect
      if (isVisited || isCurrent || isSearching) {
        ctx.shadowColor = isSearching ? "#f59e0b" : isCurrent ? "#3b82f6" : "#dc2626"
        ctx.shadowBlur = isSearching ? 25 : 20
      }

      // Draw location circle with larger size for better clicking
      const locationGradient = ctx.createRadialGradient(location.x, location.y, 0, location.x, location.y, 35)
      locationGradient.addColorStop(
        0,
        isSearching ? "#fbbf24" : isCurrent ? "#60a5fa" : isVisited ? "#dc2626" : "#64748b",
      )
      locationGradient.addColorStop(
        1,
        isSearching ? "#d97706" : isCurrent ? "#1d4ed8" : isVisited ? "#991b1b" : "#475569",
      )

      ctx.beginPath()
      ctx.arc(location.x, location.y, 35, 0, 2 * Math.PI)
      ctx.fillStyle = locationGradient
      ctx.fill()

      // Border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.shadowBlur = 0

      // Location icons
      ctx.fillStyle = "#ffffff"
      ctx.font = "28px Arial"
      ctx.textAlign = "center"

      const locationIcons = {
        mansion: "🏰",
        office: "🏢",
        garage: "🚗",
        woods: "🌲",
      }

      ctx.fillText(locationIcons[location.id as keyof typeof locationIcons] || "📍", location.x, location.y + 10)

      // Location name with better visibility
      const nameText = location.name
      const textMetrics = ctx.measureText(nameText)
      const nameWidth = textMetrics.width + 20
      const nameHeight = 28

      const nameX = location.x - nameWidth / 2
      const nameY = location.y + 50

      // Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
      ctx.fillRect(nameX, nameY, nameWidth, nameHeight)

      // Border
      ctx.strokeStyle = isVisited ? "#dc2626" : "#64748b"
      ctx.lineWidth = 2
      ctx.strokeRect(nameX, nameY, nameWidth, nameHeight)

      // Text
      ctx.fillStyle = isVisited ? "#fca5a5" : "#cbd5e1"
      ctx.font = "bold 14px Arial"
      ctx.fillText(nameText, location.x, location.y + 68)

      // Visit order
      if (isVisited) {
        const visitOrder = gameState.locationsVisited.indexOf(location.id) + 1
        ctx.fillStyle = "#dc2626"
        ctx.beginPath()
        ctx.arc(location.x - 40, location.y - 30, 15, 0, 2 * Math.PI)
        ctx.fill()

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 14px Arial"
        ctx.fillText(visitOrder.toString(), location.x - 40, location.y - 25)
      }

      // Pulsing effect for current location
      if (isCurrent) {
        const time = Date.now() * 0.005
        const pulseRadius = 40 + Math.sin(time) * 5
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 3
        ctx.globalAlpha = 0.5 + Math.sin(time) * 0.3
        ctx.beginPath()
        ctx.arc(location.x, location.y, pulseRadius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Searching animation
      if (isSearching) {
        const time = Date.now() * 0.01
        const searchRadius = 45 + Math.sin(time) * 8
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 4
        ctx.globalAlpha = 0.7 + Math.sin(time) * 0.3
        ctx.beginPath()
        ctx.arc(location.x, location.y, searchRadius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    })
  }, [locations, gameState, selectedLocation, searchingLocation])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY

    console.log("Canvas clicked at:", x, y)

    locations.forEach((location) => {
      const distance = Math.sqrt(Math.pow(x - location.x, 2) + Math.pow(y - location.y, 2))
      console.log(`Distance to ${location.name}:`, distance)

      if (distance <= 35) {
        console.log("Clicked on location:", location.name)
        onLocationClick(location.id)
      }
    })
  }

  return (
    <Card className="p-6 bg-black/95 border-red-500/30 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-red-200 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-red-400" />
            Investigation Map
          </h2>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
              {gameState.locationsVisited.length}/{locations.length} Explored
            </Badge>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 bg-red-950/20 rounded-lg border border-red-500/30">
          <h3 className="text-sm font-medium text-red-300 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Investigation Timeline
          </h3>
          <div className="flex items-center space-x-2 text-xs text-red-400 flex-wrap gap-2">
            {gameState.locationsVisited.length > 0 ? (
              gameState.locationsVisited.map((locationId, index) => {
                const location = locations.find((l) => l.id === locationId)
                return (
                  <div key={locationId} className="flex items-center">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {index + 1}. {location?.name}
                    </span>
                    {index < gameState.locationsVisited.length - 1 && <span className="mx-2 text-red-400">→</span>}
                  </div>
                )
              })
            ) : (
              <span className="text-red-500 italic">No locations visited yet</span>
            )}
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border-2 border-red-600/50 rounded-lg cursor-pointer bg-black w-full max-w-[600px] hover:border-red-500 transition-colors"
            onClick={handleCanvasClick}
            style={{ aspectRatio: "600/400" }}
          />

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-black/90 rounded-lg p-3 space-y-2 border border-red-600/50">
            <div className="text-xs font-bold text-red-200 mb-2">Legend</div>
            <div className="flex items-center space-x-2 text-xs text-red-300">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Unvisited</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-red-300">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-red-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-red-300">
              <div className="w-2 h-2 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                1
              </div>
              <span>Order</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
