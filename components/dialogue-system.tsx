"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Brain, Zap, Shield, TrendingUp, TrendingDown, ScrollText, User, Skull } from "lucide-react"
import type { Suspect, Clue, GameState } from "@/app/page"

interface DialogueOption {
  id: string
  text: string
  tone: "calm" | "aggressive" | "logical"
  requiredClue?: string
  trustChange: number
  unlocksInfo?: string
}

interface ConversationEntry {
  id: string
  speaker: "detective" | "suspect"
  text: string
  tone?: "calm" | "aggressive" | "logical"
  trustChange?: number
  timestamp: number
}

interface DialogueSystemProps {
  suspect: Suspect
  clues: Clue[]
  gameState: GameState
  onTrustChange: (change: number) => void
  onUnlockInfo: (info: string) => void
  onClose: () => void
}

const SUSPECT_RESPONSES = {
  brother: {
    intro_calm:
      "I appreciate you being professional about this. Alexander and I... we had our issues, but I'd never hurt him. I've been worried sick since he disappeared.",
    intro_aggressive:
      "Whoa, hold on! I don't like your tone. I'm not some criminal you can push around! I'm the victim's brother, for crying out loud!",
    alibi_logical:
      "I was at the Golden Palace Casino from 9 PM until 2 AM. I have the receipts, the security footage will show me there, and the dealers remember me because I lost big that night.",
    gambling_debt:
      "My debts are my business! But I'd never hurt Alexander for money! He's my brother - family means more than money, even if I'm broke.",
    inheritance:
      "I don't want the inheritance if it means losing my brother. Money isn't everything, and Alexander was trying to help me with my gambling problem.",
    clue_family_photo:
      "That photo... someone scratched out Richard's face. Alexander was furious about the business irregularities Richard was hiding. They had a huge fight about it.",
    clue_broken_glass:
      "I heard the glass break that night around 11:30. I thought it was just Alexander being clumsy - he'd been drinking more lately, stressed about the business and Richard's behavior.",
    clue_tire_tracks:
      "Those could be from my BMW. I did drive to the mansion that evening for dinner, but I left around 10 PM to go gambling. I can prove I was at the casino after that.",
    clue_oil_stain:
      "My car has been leaking oil lately. I've been meaning to get it fixed but money's tight. That stain proves I was there for dinner, but not that I did anything wrong.",
    clue_footprints:
      "I sometimes walk in those woods to clear my head when I visit. Alexander and I used to play there as kids before everything got complicated with money and the business.",
  },
  stepmother: {
    intro_calm:
      "Thank you for your respectful approach, Detective. I want to help find Alexander. He means everything to this family, and I'm devastated by his disappearance.",
    intro_aggressive:
      "Excuse me? I will not tolerate such disrespect! I am a pillar of this community and I demand better treatment! How dare you speak to me like a common criminal!",
    alibi_logical:
      "I was at the Children's Hospital charity gala at the Grand Ballroom. I gave the keynote speech at 10 PM. Over 300 people saw me there all evening, including the mayor and several council members.",
    control_estate:
      "How dare you! I married into this family for love, not money! I've been nothing but supportive of Alexander, and I resent these implications!",
    charity_gala:
      "The event coordinator was Margaret Stevens, the photographer was David Chen, and I have photos and video from the entire evening. Check with any of the 300 guests who were there.",
    clue_family_photo:
      "I don't know who would scratch out Richard's face like that. Alexander trusted him completely... perhaps too much. There were tensions I wasn't fully aware of.",
    clue_financial_records:
      "I handle the household finances, not the business accounts. But I did notice Alexander seemed worried about money lately. He was asking questions about Richard's management.",
    clue_tire_tracks:
      "I drive a Mercedes, and yes, I was at the mansion that day - it's my home too, Detective. I left for the gala at 6 PM and didn't return until after midnight.",
    clue_torn_fabric:
      "That fabric... it looks expensive. I have a dress in a similar material, but I'd have to check if it's damaged. I don't remember tearing anything that night.",
    clue_threatening_letter:
      "Alexander showed me that letter weeks ago. He was genuinely frightened. He thought it might be from someone he'd fired or crossed in business - possibly Richard's doing.",
  },
  business_partner: {
    intro_calm:
      "I... I suppose I should be honest with you, Detective. There are things about the business that Alexander discovered, and I've been trying to figure out how to explain them.",
    intro_aggressive:
      "Don't you dare accuse me! I built this company with Alexander's father! I've given my life to this business! Everything I did was to protect the company!",
    alibi_logical:
      "I was working late at the office, trying to... fix some accounting issues before Alexander's morning meeting. I was panicked about having to explain the discrepancies.",
    embezzlement:
      "It's not embezzlement! It's complicated business arrangements you wouldn't understand! I was borrowing against future profits to cover temporary shortfalls!",
    meeting_cancelled:
      "I cancelled that meeting because I knew Alexander was going to confront me about the missing money. I needed more time to prepare explanations and documentation.",
    clue_financial_records:
      "Those records... Alexander found the discrepancies three weeks ago. I was trying to explain them, but he wouldn't listen to reason. He threatened to call the police and the board.",
    clue_security_footage:
      "That footage shows me leaving late, yes. I was panicked about the meeting the next day. Alexander was asking too many questions, and I knew my career was over if he exposed everything.",
    clue_appointment_book:
      "I cancelled that meeting because I was terrified. Alexander had discovered the missing $2.3 million, and I knew he was going to destroy me. I needed time to figure out what to do.",
    clue_hidden_phone:
      "That's... that's my burner phone. I used it to coordinate some offshore transfers and... unofficial business transactions. When Alexander got suspicious, I panicked and tried to cover my tracks.",
    clue_threatening_letter:
      "I didn't write that letter, but I know it looks bad. I was desperate, Detective. Alexander was going to ruin me, destroy everything I'd worked for. But I swear I didn't hurt him!",
  },
  ex_employee: {
    intro_calm:
      "Finally, someone who doesn't treat me like dirt. Yes, I was angry about being fired, but I didn't hurt anyone. I just wanted my job back and my reputation cleared.",
    intro_aggressive:
      "Here we go again! Everyone always blames the person who got screwed over! I'm innocent! They fired me over false accusations and now you want to pin this on me too!",
    alibi_logical:
      "I was home alone that night, job hunting online and making calls to employment agencies. Check my internet history and phone records - you'll see I was desperately looking for work.",
    revenge_motive:
      "Revenge? I just wanted justice! They ruined my reputation over false accusations of theft! I never stole anything - Richard Sterling set me up to cover his own crimes!",
    garage_access:
      "I knew where they hid that key because I used to maintain their cars when I worked there. But lots of people knew about it - it wasn't exactly a secret.",
    clue_garage_key:
      "Yes, I knew about that key. I used it when I worked there to access the garage for car maintenance. But I wasn't the only one who knew - Richard Sterling knew too.",
    clue_broken_glass:
      "I heard Alexander and Richard arguing loudly that night when I was walking past the property. There was shouting, then the sound of breaking glass. It sounded violent.",
    clue_footprints:
      "I sometimes walked through those woods when I worked there - it was a shortcut from the bus stop. But that night, I saw two sets of footprints, not just mine.",
    clue_hidden_phone:
      "I've seen Richard with phones like that. He was always making secretive calls, especially when Alexander wasn't around. He was definitely hiding something big.",
    clue_threatening_letter:
      "That handwriting... it looks familiar. I think I've seen Richard write notes like that when he thought no one was looking. He has very distinctive handwriting.",
  },
}

export function DialogueSystem({
  suspect,
  clues,
  gameState,
  onTrustChange,
  onUnlockInfo,
  onClose,
}: DialogueSystemProps) {
  const [dialogueOptions, setDialogueOptions] = useState<DialogueOption[]>([])
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([])
  const [typingAnimation, setTypingAnimation] = useState(false)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const conversationRef = useRef<HTMLDivElement>(null)

  const generateDialogueOptions = (): DialogueOption[] => {
    const relevantClues = clues.filter((c) => c.relevantSuspects.includes(suspect.id))

    const baseOptions: DialogueOption[] = [
      {
        id: "intro_calm",
        text: "I'd like to ask you a few questions about the disappearance.",
        tone: "calm",
        trustChange: 5,
      },
      {
        id: "intro_aggressive",
        text: "Where were you on the night of the disappearance?",
        tone: "aggressive",
        trustChange: -10,
      },
      {
        id: "alibi_logical",
        text: "Can you provide more details about your alibi?",
        tone: "logical",
        trustChange: 0,
      },
    ]

    const suspectSpecificOptions = {
      brother: [
        {
          id: "gambling_debt",
          text: "I know about your gambling debts. How desperate were you for money?",
          tone: "aggressive" as const,
          trustChange: -15,
        },
        {
          id: "inheritance",
          text: "You stand to inherit everything if Alexander is gone. That's quite a motive.",
          tone: "logical" as const,
          trustChange: -10,
        },
      ],
      stepmother: [
        {
          id: "control_estate",
          text: "You control the estate if Alexander is declared dead. Convenient timing.",
          tone: "aggressive" as const,
          trustChange: -20,
        },
        {
          id: "charity_gala",
          text: "Tell me more about this charity gala. Who can verify you were there?",
          tone: "logical" as const,
          trustChange: 5,
        },
      ],
      business_partner: [
        {
          id: "embezzlement",
          text: "The financial records show missing money. You've been embezzling, haven't you?",
          tone: "aggressive" as const,
          trustChange: -25,
          unlocksInfo: "embezzlement_confession",
        },
        {
          id: "meeting_cancelled",
          text: "Why did you cancel your meeting with Alexander the next morning?",
          tone: "logical" as const,
          trustChange: -5,
        },
      ],
      ex_employee: [
        {
          id: "revenge_motive",
          text: "You were fired for theft. This seems like the perfect revenge.",
          tone: "aggressive" as const,
          trustChange: -15,
        },
        {
          id: "garage_access",
          text: "You knew where the garage key was hidden. That gave you access to the property.",
          tone: "logical" as const,
          trustChange: -5,
        },
      ],
    }

    const specificOptions = suspectSpecificOptions[suspect.id as keyof typeof suspectSpecificOptions] || []
    baseOptions.push(...specificOptions)

    relevantClues.forEach((clue) => {
      baseOptions.push({
        id: `clue_${clue.id}`,
        text: `What can you tell me about this ${clue.name.toLowerCase()}?`,
        tone: "logical",
        requiredClue: clue.id,
        trustChange: suspect.mood === "cooperative" ? 5 : -5,
        unlocksInfo: `${clue.id}_${suspect.id}_info`,
      })
    })

    return baseOptions
  }

  const getSuspectResponse = (optionId: string): string => {
    const suspectResponses = SUSPECT_RESPONSES[suspect.id as keyof typeof SUSPECT_RESPONSES]

    if (suspectResponses && suspectResponses[optionId as keyof typeof suspectResponses]) {
      return suspectResponses[optionId as keyof typeof suspectResponses]
    }

    return "I understand you need to ask these questions. I'll try to help however I can."
  }

  useEffect(() => {
    const options = generateDialogueOptions()
    setDialogueOptions(options)
    setConversationHistory([
      {
        id: "intro",
        speaker: "suspect",
        text: `${suspect.avatar} ${suspect.name} looks ${suspect.mood} as you enter the interrogation room. The air feels heavy with tension.`,
        timestamp: Date.now(),
      },
    ])
  }, [suspect, clues])

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight
    }
  }, [conversationHistory])

  const handleDialogueChoice = (option: DialogueOption) => {
    // Mark question as asked
    setAskedQuestions((prev) => new Set([...prev, option.id]))

    // Add detective's question to history
    const questionEntry: ConversationEntry = {
      id: `question_${Date.now()}`,
      speaker: "detective",
      text: option.text,
      tone: option.tone,
      trustChange: option.trustChange,
      timestamp: Date.now(),
    }

    setConversationHistory((prev) => [...prev, questionEntry])
    setTypingAnimation(true)

    // Get and display response after delay
    setTimeout(() => {
      const response = getSuspectResponse(option.id)

      const responseEntry: ConversationEntry = {
        id: `response_${Date.now()}`,
        speaker: "suspect",
        text: response,
        timestamp: Date.now(),
      }

      setConversationHistory((prev) => [...prev, responseEntry])
      setTypingAnimation(false)

      // Apply trust changes
      onTrustChange(option.trustChange)

      // Unlock information if applicable
      if (option.unlocksInfo) {
        onUnlockInfo(option.unlocksInfo)
      }
    }, 2000)
  }

  const getToneIcon = (tone: "calm" | "aggressive" | "logical") => {
    switch (tone) {
      case "calm":
        return <Shield className="w-4 h-4" />
      case "aggressive":
        return <Zap className="w-4 h-4" />
      case "logical":
        return <Brain className="w-4 h-4" />
    }
  }

  const getToneColor = (tone: "calm" | "aggressive" | "logical") => {
    switch (tone) {
      case "calm":
        return "bg-green-600 hover:bg-green-700"
      case "aggressive":
        return "bg-red-600 hover:bg-red-700"
      case "logical":
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  const trustInfo = {
    color:
      gameState.suspectTrustLevels[suspect.id] >= 60
        ? "text-green-400"
        : gameState.suspectTrustLevels[suspect.id] >= 40
          ? "text-yellow-400"
          : "text-red-400",
    description:
      gameState.suspectTrustLevels[suspect.id] >= 60
        ? "Cooperative"
        : gameState.suspectTrustLevels[suspect.id] >= 40
          ? "Cautious"
          : "Hostile",
  }

  // Filter available options (remove asked ones but keep them visible in history)
  const availableOptions = dialogueOptions.filter(
    (option) =>
      (!option.requiredClue || clues.some((c) => c.id === option.requiredClue)) && !askedQuestions.has(option.id),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Suspect Info Header */}
        <Card className="p-6 bg-gradient-to-r from-black/95 to-red-950/90 border-red-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center text-4xl border-4 border-red-500/50 shadow-lg">
                  {suspect.avatar}
                </div>
                <div
                  className={`absolute inset-0 rounded-full border-4 animate-pulse ${
                    suspect.mood === "cooperative"
                      ? "border-green-400 shadow-green-400/50"
                      : suspect.mood === "defensive"
                        ? "border-yellow-400 shadow-yellow-400/50"
                        : suspect.mood === "hostile"
                          ? "border-red-400 shadow-red-400/50"
                          : "border-purple-400 shadow-purple-400/50"
                  } shadow-lg`}
                ></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <Skull className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-red-200 mb-2">{suspect.name}</h3>
                <p className="text-red-300 text-lg mb-3">{suspect.description}</p>
                <Badge
                  variant="outline"
                  className={`${
                    suspect.mood === "cooperative"
                      ? "border-green-500/30 text-green-400 bg-green-500/10"
                      : suspect.mood === "defensive"
                        ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                        : suspect.mood === "hostile"
                          ? "border-red-500/30 text-red-400 bg-red-500/10"
                          : "border-purple-500/30 text-purple-400 bg-purple-500/10"
                  } px-3 py-1`}
                >
                  {suspect.mood.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Trust Meter */}
            <div className="text-center bg-black/70 p-6 rounded-lg border border-red-600/50 min-w-[200px]">
              <div className="text-sm text-red-400 mb-2">Trust Level</div>
              <div className={`text-4xl font-bold ${trustInfo.color} mb-3`}>
                {gameState.suspectTrustLevels[suspect.id]}%
              </div>
              <div className="w-40 bg-red-900/50 rounded-full h-4 mb-3 border border-red-600/30">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    gameState.suspectTrustLevels[suspect.id] >= 60
                      ? "bg-green-500"
                      : gameState.suspectTrustLevels[suspect.id] >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${gameState.suspectTrustLevels[suspect.id]}%` }}
                />
              </div>
              <div className={`text-sm ${trustInfo.color} font-medium`}>{trustInfo.description}</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation History - Fixed scrolling and layout */}
          <div className="lg:col-span-2">
            <Card className="bg-black/95 border-red-500/30 shadow-xl">
              <div className="p-6 border-b border-red-500/30">
                <h4 className="text-2xl font-bold text-red-200 flex items-center">
                  <ScrollText className="w-6 h-6 mr-3 text-red-400" />
                  Interrogation Log
                </h4>
              </div>

              <div
                ref={conversationRef}
                className="p-6 h-[500px] overflow-y-auto space-y-4 bg-gradient-to-b from-red-950/10 to-black/50"
                style={{ scrollBehavior: "smooth" }}
              >
                {conversationHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex ${entry.speaker === "detective" ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-lg shadow-lg ${
                        entry.speaker === "detective"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-500/50"
                          : "bg-gradient-to-r from-red-900/80 to-black/80 text-red-100 border border-red-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold flex items-center">
                            {entry.speaker === "detective" ? (
                              <>🕵️ Detective Iconic</>
                            ) : (
                              <>
                                <User className="w-4 h-4 mr-1" />
                                {suspect.name}
                              </>
                            )}
                          </span>
                          {entry.tone && getToneIcon(entry.tone)}
                        </div>
                        {entry.trustChange && (
                          <div
                            className={`text-xs flex items-center font-medium ${
                              entry.trustChange > 0 ? "text-green-300" : "text-red-300"
                            }`}
                          >
                            {entry.trustChange > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {entry.trustChange > 0 ? `+${entry.trustChange}` : entry.trustChange}
                          </div>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{entry.text}</p>
                    </div>
                  </div>
                ))}

                {typingAnimation && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gradient-to-r from-red-900/80 to-black/80 text-red-200 max-w-md p-4 rounded-lg border border-red-500/50 shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-bold flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {suspect.name}
                        </span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-red-300">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Dialogue Options - Fixed sizing */}
          <Card className="bg-black/95 border-red-500/30 shadow-xl">
            <div className="p-6 border-b border-red-500/30">
              <h4 className="text-xl font-bold text-red-200 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-red-400" />
                Questions ({availableOptions.length} available)
              </h4>
            </div>

            <div className="p-6">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {availableOptions.length > 0 ? (
                  availableOptions.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleDialogueChoice(option)}
                      className={`${getToneColor(option.tone)} text-left justify-start p-4 h-auto w-full text-sm hover:scale-105 transition-all duration-200`}
                      disabled={typingAnimation}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        {getToneIcon(option.tone)}
                        <div className="flex-1 text-left">
                          <div className="font-medium mb-1 text-base leading-relaxed">{option.text}</div>
                          <div className="text-xs opacity-75 flex items-center space-x-2">
                            <span>{option.tone.charAt(0).toUpperCase() + option.tone.slice(1)}</span>
                            {option.requiredClue && <span>• Evidence</span>}
                            {option.trustChange > 0 && (
                              <span className="text-green-300 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />+{option.trustChange}
                              </span>
                            )}
                            {option.trustChange < 0 && (
                              <span className="text-red-300 flex items-center">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                {option.trustChange}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-red-400">All questions asked</p>
                    <p className="text-sm text-red-500">Review the conversation to build your case</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-red-600/30">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full border-red-600/50 text-red-300 hover:bg-red-950/30 hover:border-red-500"
                >
                  End Interrogation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
