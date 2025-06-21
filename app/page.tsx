"use client"

import { useState, useEffect } from "react"
import { MakePage } from "@/components/make-page"
import { CaseFile } from "@/components/case-file"
import { InvestigationHub } from "@/components/investigation-hub"
import { InterrogationSystem } from "@/components/interrogation-system"
import { DeductionBoard } from "@/components/deduction-board"
import { CaseConclusion } from "@/components/case-conclusion"
import { BackgroundMusic } from "@/components/background-music"

export type GamePhase = "menu" | "briefing" | "investigation" | "interrogation" | "deduction" | "conclusion"

export type Evidence = {
  id: string
  name: string
  description: string
  location: string
  type: "document" | "physical" | "photo" | "digital"
  suspectConnections: string[]
  discovered: boolean
}

export type Suspect = {
  id: string
  name: string
  description: string
  avatar: string
  motive: string
  alibi: string
  trustLevel: number
  mood: "cooperative" | "defensive" | "hostile" | "nervous"
  questionsAsked: string[]
  responses: Record<string, string>
}

export type Location = {
  id: string
  name: string
  description: string
  visited: boolean
  evidenceIds: string[]
  x: number
  y: number
}

export type GameState = {
  phase: GamePhase
  currentLocation: string | null
  evidenceCollected: string[]
  locationsVisited: string[]
  suspectInterrogated: string[]
  suspectTrustLevels: Record<string, number>
  suspectMoods: Record<string, "cooperative" | "defensive" | "hostile" | "nervous">
  finalAccusation: string | null
  gameResult: "correct" | "incorrect" | null
  soundEnabled: boolean
}

export type Clue = {
  id: string
  name: string
  description: string
  type: string
  relevantSuspects: string[]
}

// Game Data
const LOCATIONS: Location[] = [
  {
    id: "mansion",
    name: "Blackwood Mansion",
    description: "The heir's luxurious family estate where he was last seen",
    visited: false,
    evidenceIds: ["family_photo", "threatening_letter", "broken_glass"],
    x: 150,
    y: 100,
  },
  {
    id: "office",
    name: "Corporate Office",
    description: "The family business headquarters with financial secrets",
    visited: false,
    evidenceIds: ["financial_records", "security_footage", "appointment_book"],
    x: 450,
    y: 120,
  },
  {
    id: "garage",
    name: "Private Garage",
    description: "Where luxury vehicles hide their secrets",
    visited: false,
    evidenceIds: ["tire_tracks", "oil_stain", "garage_key"],
    x: 120,
    y: 280,
  },
  {
    id: "woods",
    name: "Blackwood Forest",
    description: "Dark woods where secrets are buried",
    visited: false,
    evidenceIds: ["torn_fabric", "footprints", "hidden_phone"],
    x: 480,
    y: 300,
  },
]

const EVIDENCE: Evidence[] = [
  {
    id: "family_photo",
    name: "Defaced Family Photo",
    description: "A family portrait with someone's face violently scratched out",
    location: "mansion",
    type: "photo",
    suspectConnections: ["business_partner", "stepmother"],
    discovered: false,
  },
  {
    id: "threatening_letter",
    name: "Anonymous Threat",
    description: "A menacing letter demanding money, written in disguised handwriting",
    location: "mansion",
    type: "document",
    suspectConnections: ["business_partner", "ex_employee"],
    discovered: false,
  },
  {
    id: "broken_glass",
    name: "Bloodied Glass",
    description: "Shattered window glass with fresh blood traces",
    location: "mansion",
    type: "physical",
    suspectConnections: ["brother", "ex_employee"],
    discovered: false,
  },
  {
    id: "financial_records",
    name: "Suspicious Transactions",
    description: "Financial documents revealing massive embezzlement",
    location: "office",
    type: "document",
    suspectConnections: ["business_partner"],
    discovered: false,
  },
  {
    id: "security_footage",
    name: "CCTV Evidence",
    description: "Security camera showing suspicious late-night activity",
    location: "office",
    type: "digital",
    suspectConnections: ["business_partner", "ex_employee"],
    discovered: false,
  },
  {
    id: "appointment_book",
    name: "Cancelled Meeting",
    description: "Schedule showing a mysteriously cancelled confrontation",
    location: "office",
    type: "document",
    suspectConnections: ["business_partner"],
    discovered: false,
  },
  {
    id: "tire_tracks",
    name: "Fresh Tire Marks",
    description: "Recent tire tracks leading toward the forest",
    location: "garage",
    type: "physical",
    suspectConnections: ["brother", "stepmother"],
    discovered: false,
  },
  {
    id: "oil_stain",
    name: "Oil Evidence",
    description: "Fresh oil leak indicating recent vehicle movement",
    location: "garage",
    type: "physical",
    suspectConnections: ["brother"],
    discovered: false,
  },
  {
    id: "garage_key",
    name: "Hidden Access Key",
    description: "Spare key with fingerprints of someone who shouldn't have access",
    location: "garage",
    type: "physical",
    suspectConnections: ["ex_employee"],
    discovered: false,
  },
  {
    id: "torn_fabric",
    name: "Expensive Fabric",
    description: "Torn piece of luxury clothing caught on branches",
    location: "woods",
    type: "physical",
    suspectConnections: ["stepmother"],
    discovered: false,
  },
  {
    id: "footprints",
    name: "Multiple Footprints",
    description: "Several sets of footprints in the muddy forest floor",
    location: "woods",
    type: "physical",
    suspectConnections: ["brother", "ex_employee"],
    discovered: false,
  },
  {
    id: "hidden_phone",
    name: "Burner Phone",
    description: "Disposable phone with incriminating call records",
    location: "woods",
    type: "digital",
    suspectConnections: ["business_partner"],
    discovered: false,
  },
]

const SUSPECTS: Suspect[] = [
  {
    id: "brother",
    name: "Marcus Blackwood",
    description: "The heir's gambling-addicted younger brother",
    avatar: "👨‍💼",
    motive: "Massive gambling debts and inheritance rights",
    alibi: "Claims he was at the casino all night",
    trustLevel: 50,
    mood: "defensive",
    questionsAsked: [],
    responses: {},
  },
  {
    id: "stepmother",
    name: "Victoria Blackwood",
    description: "The calculating stepmother with expensive tastes",
    avatar: "👩‍💼",
    motive: "Controls estate if heir is declared dead",
    alibi: "Says she was at a charity gala",
    trustLevel: 60,
    mood: "cooperative",
    questionsAsked: [],
    responses: {},
  },
  {
    id: "business_partner",
    name: "Richard Sterling",
    description: "Nervous business partner hiding financial crimes",
    avatar: "👨‍💻",
    motive: "Embezzlement discovered, career and freedom at stake",
    alibi: "Working late at the office",
    trustLevel: 30,
    mood: "nervous",
    questionsAsked: [],
    responses: {},
  },
  {
    id: "ex_employee",
    name: "Sarah Chen",
    description: "Bitter ex-employee seeking revenge",
    avatar: "👩‍🔧",
    motive: "Wrongful termination and destroyed reputation",
    alibi: "Home alone with no witnesses",
    trustLevel: 40,
    mood: "hostile",
    questionsAsked: [],
    responses: {},
  },
]

const INITIAL_GAME_STATE: GameState = {
  phase: "menu",
  currentLocation: null,
  evidenceCollected: [],
  locationsVisited: [],
  suspectInterrogated: [],
  suspectTrustLevels: {
    brother: 50,
    stepmother: 60,
    business_partner: 30,
    ex_employee: 40,
  },
  suspectMoods: {
    brother: "defensive",
    stepmother: "cooperative",
    business_partner: "nervous",
    ex_employee: "hostile",
  },
  finalAccusation: null,
  gameResult: null,
  soundEnabled: true,
}

const CLUES: Clue[] = [
  {
    id: "family_photo",
    name: "Family Photo",
    description: "A defaced family photo",
    type: "photo",
    relevantSuspects: ["business_partner", "stepmother"],
  },
  {
    id: "threatening_letter",
    name: "Threatening Letter",
    description: "An anonymous threat",
    type: "document",
    relevantSuspects: ["business_partner", "ex_employee"],
  },
  {
    id: "broken_glass",
    name: "Broken Glass",
    description: "Bloodied glass",
    type: "physical",
    relevantSuspects: ["brother", "ex_employee"],
  },
  {
    id: "financial_records",
    name: "Financial Records",
    description: "Suspicious transactions",
    type: "document",
    relevantSuspects: ["business_partner"],
  },
  {
    id: "security_footage",
    name: "Security Footage",
    description: "CCTV evidence",
    type: "digital",
    relevantSuspects: ["business_partner", "ex_employee"],
  },
  {
    id: "appointment_book",
    name: "Appointment Book",
    description: "Cancelled meeting",
    type: "document",
    relevantSuspects: ["business_partner"],
  },
  {
    id: "tire_tracks",
    name: "Tire Tracks",
    description: "Fresh tire marks",
    type: "physical",
    relevantSuspects: ["brother", "stepmother"],
  },
  {
    id: "oil_stain",
    name: "Oil Stain",
    description: "Oil evidence",
    type: "physical",
    relevantSuspects: ["brother"],
  },
  {
    id: "garage_key",
    name: "Garage Key",
    description: "Hidden access key",
    type: "physical",
    relevantSuspects: ["ex_employee"],
  },
  {
    id: "torn_fabric",
    name: "Torn Fabric",
    description: "Expensive fabric",
    type: "physical",
    relevantSuspects: ["stepmother"],
  },
  {
    id: "footprints",
    name: "Footprints",
    description: "Multiple footprints",
    type: "physical",
    relevantSuspects: ["brother", "ex_employee"],
  },
  {
    id: "hidden_phone",
    name: "Hidden Phone",
    description: "Burner phone",
    type: "digital",
    relevantSuspects: ["business_partner"],
  },
]

export default function NeuralDetectiveGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  const [locations, setLocations] = useState<Location[]>(LOCATIONS)
  const [evidence, setEvidence] = useState<Evidence[]>(EVIDENCE)
  const [suspects, setSuspects] = useState<Suspect[]>(SUSPECTS)
  const [clues, setClues] = useState<Clue[]>(CLUES)

  // Auto-save functionality
  useEffect(() => {
    if (gameState.phase !== "menu") {
      const saveData = {
        gameState,
        locations,
        evidence,
        suspects,
        timestamp: Date.now(),
      }
      localStorage.setItem("neural-detective-save", JSON.stringify(saveData))
    }
  }, [gameState, locations, evidence, suspects])

  // Game Actions
  const startNewGame = () => {
    setGameState({ ...INITIAL_GAME_STATE, phase: "briefing" })
    setLocations(LOCATIONS.map((loc) => ({ ...loc, visited: false })))
    setEvidence(EVIDENCE.map((ev) => ({ ...ev, discovered: false })))
    setSuspects(SUSPECTS.map((sus) => ({ ...sus, trustLevel: sus.trustLevel, questionsAsked: [], responses: {} })))
  }

  const loadGame = () => {
    const saveData = localStorage.getItem("neural-detective-save")
    if (saveData) {
      try {
        const parsed = JSON.parse(saveData)
        setGameState(parsed.gameState)
        setLocations(parsed.locations)
        setEvidence(parsed.evidence)
        setSuspects(parsed.suspects)
      } catch (error) {
        console.error("Failed to load game:", error)
      }
    }
  }

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }))
  }

  const visitLocation = (locationId: string) => {
    console.log("Main: Visiting location:", locationId)
    setLocations((prev) => prev.map((loc) => (loc.id === locationId ? { ...loc, visited: true } : loc)))

    if (!gameState.locationsVisited.includes(locationId)) {
      setGameState((prev) => ({
        ...prev,
        locationsVisited: [...prev.locationsVisited, locationId],
        currentLocation: locationId,
      }))
    }
  }

  const discoverEvidence = (evidenceId: string) => {
    console.log("Main: Discovering evidence:", evidenceId)
    setEvidence((prev) => prev.map((ev) => (ev.id === evidenceId ? { ...ev, discovered: true } : ev)))

    if (!gameState.evidenceCollected.includes(evidenceId)) {
      setGameState((prev) => ({
        ...prev,
        evidenceCollected: [...prev.evidenceCollected, evidenceId],
      }))
    }
  }

  const updateSuspect = (suspectId: string, updates: Partial<Suspect>) => {
    setSuspects((prev) => prev.map((sus) => (sus.id === suspectId ? { ...sus, ...updates } : sus)))

    // Also update game state trust levels and moods
    if (updates.trustLevel !== undefined) {
      setGameState((prev) => ({
        ...prev,
        suspectTrustLevels: {
          ...prev.suspectTrustLevels,
          [suspectId]: updates.trustLevel,
        },
      }))
    }

    if (updates.mood !== undefined) {
      setGameState((prev) => ({
        ...prev,
        suspectMoods: {
          ...prev.suspectMoods,
          [suspectId]: updates.mood,
        },
      }))
    }
  }

  const makeAccusation = (suspectId: string) => {
    const correctSuspect = "business_partner" // Richard Sterling is the culprit
    const result = suspectId === correctSuspect ? "correct" : "incorrect"

    setGameState((prev) => ({
      ...prev,
      phase: "conclusion",
      finalAccusation: suspectId,
      gameResult: result,
    }))
  }

  // Render current phase
  const renderCurrentPhase = () => {
    switch (gameState.phase) {
      case "menu":
        return (
          <MakePage
            onStartGame={startNewGame}
            onLoadGame={loadGame}
            soundEnabled={gameState.soundEnabled}
            onToggleSound={() => updateGameState({ soundEnabled: !gameState.soundEnabled })}
          />
        )

      case "briefing":
        return <CaseFile onContinue={() => updateGameState({ phase: "investigation" })} gameState={gameState} />

      case "investigation":
        return (
          <InvestigationHub
            locations={locations}
            evidence={evidence}
            gameState={gameState}
            onVisitLocation={visitLocation}
            onDiscoverEvidence={discoverEvidence}
            onGoToInterrogation={() => updateGameState({ phase: "interrogation" })}
            onGoToDeduction={() => updateGameState({ phase: "deduction" })}
          />
        )

      case "interrogation":
        return (
          <InterrogationSystem
            suspects={suspects}
            evidence={evidence.filter((ev) => ev.discovered)}
            gameState={gameState}
            onUpdateSuspect={updateSuspect}
            onBackToInvestigation={() => updateGameState({ phase: "investigation" })}
          />
        )

      case "deduction":
        return (
          <DeductionBoard
            suspects={suspects}
            evidence={evidence.filter((ev) => ev.discovered)}
            gameState={gameState}
            onMakeAccusation={makeAccusation}
            onBackToInvestigation={() => updateGameState({ phase: "investigation" })}
          />
        )

      case "conclusion":
        return (
          <CaseConclusion
            gameState={gameState}
            suspects={suspects}
            onPlayAgain={startNewGame}
            onMainMenu={() => updateGameState({ phase: "menu" })}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {gameState.soundEnabled && <BackgroundMusic phase={gameState.phase} enabled={gameState.soundEnabled} />}
      {renderCurrentPhase()}
    </div>
  )
}
