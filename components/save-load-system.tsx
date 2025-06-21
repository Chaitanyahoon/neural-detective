"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Download, Trash2, Clock, X } from "lucide-react"

interface SaveData {
  name: string
  timestamp: number
  phase: string
  progress: {
    cluesCollected: number
    locationsVisited: number
    suspectsTalkedTo: number
  }
}

interface SaveLoadSystemProps {
  onClose: () => void
  onSave: () => void
  onLoad: () => void
}

export function SaveLoadSystem({ onClose, onSave, onLoad }: SaveLoadSystemProps) {
  const [saves, setSaves] = useState<SaveData[]>([])
  const [newSaveName, setNewSaveName] = useState("")

  useEffect(() => {
    loadSavesList()
  }, [])

  const loadSavesList = () => {
    const savedGames = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("neural-detective-save-")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}")
          savedGames.push({
            name: key.replace("neural-detective-save-", ""),
            timestamp: data.timestamp || Date.now(),
            phase: data.gameState?.phase || "unknown",
            progress: {
              cluesCollected: data.gameState?.cluesCollected?.length || 0,
              locationsVisited: data.gameState?.locationsVisited?.length || 0,
              suspectsTalkedTo: data.gameState?.unlockedDialogue?.length || 0,
            },
          })
        } catch (error) {
          console.error("Error loading save:", error)
        }
      }
    }
    setSaves(savedGames.sort((a, b) => b.timestamp - a.timestamp))
  }

  const handleSave = () => {
    if (!newSaveName.trim()) return

    const currentSave = localStorage.getItem("neural-detective-save")
    if (currentSave) {
      localStorage.setItem(`neural-detective-save-${newSaveName}`, currentSave)
      setNewSaveName("")
      loadSavesList()
      onSave()
    }
  }

  const handleLoad = (saveName: string) => {
    const saveData = localStorage.getItem(`neural-detective-save-${saveName}`)
    if (saveData) {
      localStorage.setItem("neural-detective-save", saveData)
      onLoad()
      onClose()
    }
  }

  const handleDelete = (saveName: string) => {
    localStorage.removeItem(`neural-detective-save-${saveName}`)
    loadSavesList()
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "investigation":
        return "border-blue-500/30 text-blue-400"
      case "interrogation":
        return "border-red-500/30 text-red-400"
      case "deduction":
        return "border-purple-500/30 text-purple-400"
      case "accusation":
        return "border-yellow-500/30 text-yellow-400"
      case "ending":
        return "border-green-500/30 text-green-400"
      default:
        return "border-slate-500/30 text-slate-400"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="p-6 bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-200">Save & Load Game</h2>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Save Current Game */}
        <Card className="p-4 bg-slate-700 border-slate-600 mb-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
            <Save className="w-5 h-5 mr-2 text-green-400" />
            Save Current Game
          </h3>

          <div className="flex space-x-3">
            <input
              type="text"
              value={newSaveName}
              onChange={(e) => setNewSaveName(e.target.value)}
              placeholder="Enter save name..."
              className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
            />
            <Button onClick={handleSave} disabled={!newSaveName.trim()} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </Card>

        {/* Load Saved Games */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-400" />
            Saved Games
          </h3>

          {saves.length === 0 ? (
            <div className="text-center py-8">
              <Save className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No saved games found</p>
              <p className="text-sm text-slate-500">Save your current progress to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {saves.map((save, index) => (
                <Card key={index} className="p-4 bg-slate-700 border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-slate-200">{save.name}</h4>
                        <Badge variant="outline" className={getPhaseColor(save.phase)}>
                          {save.phase}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(save.timestamp)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-4 text-xs text-slate-500">
                        <span>Clues: {save.progress.cluesCollected}</span>
                        <span>Locations: {save.progress.locationsVisited}</span>
                        <span>Dialogues: {save.progress.suspectsTalkedTo}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={() => handleLoad(save.name)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-3 h-3 mr-1" />
                        Load
                      </Button>

                      <Button
                        onClick={() => handleDelete(save.name)}
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
