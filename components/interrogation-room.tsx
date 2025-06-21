"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, Brain, Zap, Shield, TrendingUp, TrendingDown, Skull } from "lucide-react"
import type { Suspect, Evidence } from "@/app/page"

interface Message {
  id: string
  speaker: "detective" | "suspect"
  text: string
  tone?: "calm" | "aggressive" | "logical"
  trustChange?: number
  timestamp: number
}

interface Question {
  id: string
  text: string
  tone: "calm" | "aggressive" | "logical"
  trustChange: number
  evidenceRequired?: string
  response: string
}

interface InterrogationRoomProps {
  suspect: Suspect
  evidence: Evidence[]
  onUpdateSuspect: (suspectId: string, updates: Partial<Suspect>) => void
  onBack: () => void
}

// Enhanced question database with more dramatic responses
const QUESTIONS: Record<string, Question[]> = {
  brother: [
    {
      id: "intro_calm",
      text: "Marcus, I know this is difficult. Can you help me understand what happened that night?",
      tone: "calm",
      trustChange: 8,
      response:
        "Detective, I appreciate your approach. I've been losing sleep over Alexander's disappearance. We had our differences, but he's still my brother. I'd never hurt him.",
    },
    {
      id: "intro_aggressive",
      text: "Cut the act, Marcus! Where were you when your brother vanished?",
      tone: "aggressive",
      trustChange: -15,
      response:
        "Whoa! Back off! I don't deserve this treatment! I'm the victim's brother, not some street criminal! I was at the Golden Palace Casino - check the damn records!",
    },
    {
      id: "gambling_debts",
      text: "Your gambling debts are crushing you. How desperate were you for Alexander's money?",
      tone: "aggressive",
      trustChange: -20,
      response:
        "You think I'd hurt my own brother for money?! Yes, I owe money, but Alexander was helping me! He was trying to get me into rehab, not the other way around!",
    },
    {
      id: "inheritance",
      text: "With Alexander gone, you inherit everything. That's quite convenient, isn't it?",
      tone: "logical",
      trustChange: -12,
      response:
        "Convenient? CONVENIENT?! I don't want his money if it means losing him! You think I'm some monster who'd kill for inheritance? Check my alibi!",
    },
    {
      id: "casino_alibi",
      text: "Tell me exactly what happened at the casino that night.",
      tone: "logical",
      trustChange: 5,
      response:
        "I arrived at Golden Palace around 9 PM. Lost $3,000 at blackjack - the dealers will remember me. Security cameras, credit card records, everything's there. I was desperate, but not THAT desperate.",
    },
  ],
  stepmother: [
    {
      id: "intro_calm",
      text: "Victoria, I know you care about Alexander. Can you help me find him?",
      tone: "calm",
      trustChange: 10,
      response:
        "Thank you for treating me with respect, Detective. Alexander means everything to this family. I've been devastated since he disappeared. I'll do anything to help bring him home.",
    },
    {
      id: "intro_aggressive",
      text: "You married into money and now you control it all if Alexander's dead. How convenient!",
      tone: "aggressive",
      trustChange: -25,
      response:
        "How DARE you! I will not tolerate such vile accusations! I married Robert for love, and I've treated Alexander like my own son! This is absolutely outrageous!",
    },
    {
      id: "charity_gala",
      text: "Walk me through your evening at the charity gala. Every detail.",
      tone: "logical",
      trustChange: 8,
      response:
        "I arrived at the Grand Ballroom at 6:30 PM. Gave my keynote speech at 10 PM about children's healthcare. Over 300 witnesses, including Mayor Davidson and the entire city council. Check the photos, the videos.",
    },
    {
      id: "estate_control",
      text: "You have significant influence over the family finances. What aren't you telling me?",
      tone: "logical",
      trustChange: -8,
      response:
        "I manage household expenses, yes, but Alexander controlled the business with Richard. I noticed he seemed worried lately - asking questions about discrepancies he'd found.",
    },
  ],
  business_partner: [
    {
      id: "intro_calm",
      text: "Richard, I need your help understanding Alexander's business concerns.",
      tone: "calm",
      trustChange: 8,
      response:
        "Detective... I... I suppose there's no point hiding it anymore. Alexander had discovered some... irregularities in our accounts. I've been trying to figure out how to explain them.",
    },
    {
      id: "intro_aggressive",
      text: "You've been stealing from the company! Alexander found out and now he's gone!",
      tone: "aggressive",
      trustChange: -30,
      response:
        "Don't you dare accuse me of theft! I built this company with Alexander's father! Everything I did was to protect our business! You don't understand the complexities of corporate finance!",
    },
    {
      id: "embezzlement",
      text: "The missing $2.3 million - where did it go, Richard?",
      tone: "logical",
      trustChange: -20,
      response:
        "It's not embezzlement! It's... complicated offshore investments and temporary liquidity solutions! I was borrowing against future profits to cover short-term cash flow issues!",
    },
    {
      id: "cancelled_meeting",
      text: "Why did you cancel your crucial meeting with Alexander the morning after he disappeared?",
      tone: "logical",
      trustChange: -15,
      response:
        "I... I was terrified. Alexander had found the discrepancies and was demanding explanations. I knew he was going to destroy me, call the board, maybe even the police. I needed more time to prepare.",
    },
    {
      id: "late_night_panic",
      text: "Security footage shows you leaving the office at 2 AM, looking panicked. Why?",
      tone: "logical",
      trustChange: -10,
      evidenceRequired: "security_footage",
      response:
        "I was in full panic mode. Alexander was asking too many questions, getting too close to the truth. I knew my career, my reputation, everything was about to be destroyed. But I swear I didn't hurt him!",
    },
  ],
  ex_employee: [
    {
      id: "intro_calm",
      text: "Sarah, I'd like to hear your side of what happened with your termination.",
      tone: "calm",
      trustChange: 10,
      response:
        "Finally, someone who doesn't treat me like garbage. Yes, I was angry about being fired, but I didn't hurt anyone. They destroyed my reputation over false accusations.",
    },
    {
      id: "intro_aggressive",
      text: "You were fired for theft and now Alexander's missing. That's not a coincidence!",
      tone: "aggressive",
      trustChange: -20,
      response:
        "Here we go again! Everyone always blames the person who got screwed over! I'm innocent! They fired me to cover up Richard Sterling's crimes, and now you want to pin this on me too!",
    },
    {
      id: "revenge_motive",
      text: "This seems like the perfect revenge for your wrongful termination.",
      tone: "aggressive",
      trustChange: -15,
      response:
        "Revenge? I wanted JUSTICE! They ruined my life over false accusations! I never stole anything - Richard Sterling set me up to cover his own embezzlement!",
    },
    {
      id: "garage_access",
      text: "You knew exactly where the garage key was hidden. That gave you perfect access.",
      tone: "logical",
      trustChange: -8,
      evidenceRequired: "garage_key",
      response:
        "I knew about that key because I used to maintain their vehicles when I worked there. But I wasn't the only one - Richard Sterling knew about it too. Check his fingerprints!",
    },
    {
      id: "witness_account",
      text: "What did you see the night Alexander disappeared?",
      tone: "logical",
      trustChange: 5,
      response:
        "I was walking past the property around 11 PM when I heard Alexander and Richard arguing violently. There was shouting, then the sound of breaking glass. It sounded like someone was in real danger.",
    },
  ],
}

export function InterrogationRoom({ suspect, evidence, onUpdateSuspect, onBack }: InterrogationRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([])
  const [suspectEmotion, setSuspectEmotion] = useState<"neutral" | "angry" | "nervous" | "cooperative">("neutral")
  const [roomLighting, setRoomLighting] = useState<"normal" | "tense" | "dramatic">("normal")
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Character portraits based on suspect and emotion
  const getCharacterPortrait = (suspectId: string, emotion: string) => {
    const portraits = {
      brother: {
        neutral: "🧑‍💼",
        angry: "😠",
        nervous: "😰",
        cooperative: "😌",
      },
      stepmother: {
        neutral: "👩‍💼",
        angry: "😡",
        nervous: "😟",
        cooperative: "😊",
      },
      business_partner: {
        neutral: "👨‍💻",
        angry: "🤬",
        nervous: "😨",
        cooperative: "😅",
      },
      ex_employee: {
        neutral: "👩‍🔧",
        angry: "😤",
        nervous: "😬",
        cooperative: "🙂",
      },
    }
    return portraits[suspectId as keyof typeof portraits]?.[emotion as keyof typeof portraits.brother] || suspect.avatar
  }

  useEffect(() => {
    // Initialize conversation with dramatic entrance
    const initialMessage: Message = {
      id: "intro",
      speaker: "suspect",
      text: `The interrogation room door slams shut. ${suspect.name} sits across from you under the harsh fluorescent lights, their expression ${suspect.mood}. The air is thick with tension.`,
      timestamp: Date.now(),
    }

    setMessages([initialMessage])

    // Load available questions for this suspect
    const suspectQuestions = QUESTIONS[suspect.id] || []
    const unaskedQuestions = suspectQuestions.filter((q) => !suspect.questionsAsked.includes(q.id))
    const availableQs = unaskedQuestions.filter(
      (q) => !q.evidenceRequired || evidence.some((e) => e.id === q.evidenceRequired),
    )
    setAvailableQuestions(availableQs)
    setAskedQuestions(new Set(suspect.questionsAsked))
  }, [suspect, evidence])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const askQuestion = (question: Question) => {
    if (isTyping || askedQuestions.has(question.id)) return

    // Mark question as asked immediately
    setAskedQuestions((prev) => new Set([...prev, question.id]))

    // Set room atmosphere based on question tone
    setRoomLighting(question.tone === "aggressive" ? "dramatic" : question.tone === "logical" ? "tense" : "normal")

    // Add detective's question to messages
    const questionMessage: Message = {
      id: `q_${Date.now()}`,
      speaker: "detective",
      text: question.text,
      tone: question.tone,
      trustChange: question.trustChange,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, questionMessage])
    setIsTyping(true)

    // Update suspect emotion based on question tone and trust change
    if (question.trustChange < -15) {
      setSuspectEmotion("angry")
    } else if (question.trustChange < -5) {
      setSuspectEmotion("nervous")
    } else if (question.trustChange > 5) {
      setSuspectEmotion("cooperative")
    } else {
      setSuspectEmotion("neutral")
    }

    // Simulate typing delay with dramatic pause
    setTimeout(() => {
      // Add suspect's response - this is the key fix
      const responseMessage: Message = {
        id: `r_${Date.now()}`,
        speaker: "suspect",
        text: question.response,
        timestamp: Date.now(),
      }

      // Update messages state properly
      setMessages((prevMessages) => [...prevMessages, responseMessage])
      setIsTyping(false)

      // Update suspect data
      const newTrustLevel = Math.max(0, Math.min(100, suspect.trustLevel + question.trustChange))
      let newMood = suspect.mood

      // Update mood based on trust level with more dramatic changes
      if (newTrustLevel >= 75) newMood = "cooperative"
      else if (newTrustLevel >= 50) newMood = "defensive"
      else if (newTrustLevel >= 25) newMood = "nervous"
      else newMood = "hostile"

      // Update suspect with new data
      onUpdateSuspect(suspect.id, {
        trustLevel: newTrustLevel,
        mood: newMood,
        questionsAsked: [...suspect.questionsAsked, question.id],
        responses: { ...suspect.responses, [question.id]: question.response },
      })

      // Update available questions - filter out asked questions
      const suspectQuestions = QUESTIONS[suspect.id] || []
      const newAskedQuestions = new Set([...suspect.questionsAsked, question.id])
      const unaskedQuestions = suspectQuestions.filter((q) => !newAskedQuestions.has(q.id))
      const availableQs = unaskedQuestions.filter(
        (q) => !q.evidenceRequired || evidence.some((e) => e.id === q.evidenceRequired),
      )
      setAvailableQuestions(availableQs)

      // Reset room lighting after response
      setTimeout(() => setRoomLighting("normal"), 2000)
    }, 2500) // Slightly shorter delay for better UX
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
        return "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-500/30"
      case "aggressive":
        return "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/30"
      case "logical":
        return "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30"
    }
  }

  const trustInfo = {
    color: suspect.trustLevel >= 70 ? "text-green-400" : suspect.trustLevel >= 40 ? "text-yellow-400" : "text-red-400",
    bgColor:
      suspect.trustLevel >= 70 ? "bg-green-500/20" : suspect.trustLevel >= 40 ? "bg-yellow-500/20" : "bg-red-500/20",
    description: suspect.trustLevel >= 70 ? "Cooperative" : suspect.trustLevel >= 40 ? "Cautious" : "Hostile",
  }

  // Filter available questions to exclude already asked ones
  const filteredQuestions = availableQuestions.filter((q) => !askedQuestions.has(q.id))

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        roomLighting === "dramatic"
          ? "bg-gradient-to-br from-red-900 via-black to-red-950"
          : roomLighting === "tense"
            ? "bg-gradient-to-br from-blue-900 via-black to-slate-900"
            : "bg-gradient-to-br from-black via-red-950/20 to-slate-900"
      } p-4`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cinematic Header with Character Portrait */}
        <Card
          className={`p-6 bg-gradient-to-r from-black/95 to-red-950/90 border-red-500/30 shadow-2xl transition-all duration-500 ${
            roomLighting === "dramatic" ? "shadow-red-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Large Character Portrait */}
              <div className="relative">
                <div
                  className={`w-32 h-32 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center text-6xl border-4 transition-all duration-500 ${
                    suspectEmotion === "angry"
                      ? "border-red-500 shadow-red-500/50 animate-pulse"
                      : suspectEmotion === "nervous"
                        ? "border-yellow-500 shadow-yellow-500/50"
                        : suspectEmotion === "cooperative"
                          ? "border-green-500 shadow-green-500/50"
                          : "border-red-500/50"
                  } shadow-2xl`}
                >
                  {getCharacterPortrait(suspect.id, suspectEmotion)}
                </div>

                {/* Mood indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-red-500">
                  {suspectEmotion === "angry" && <span className="text-red-400">💢</span>}
                  {suspectEmotion === "nervous" && <span className="text-yellow-400">😰</span>}
                  {suspectEmotion === "cooperative" && <span className="text-green-400">😌</span>}
                  {suspectEmotion === "neutral" && <Skull className="w-4 h-4 text-red-400" />}
                </div>

                {/* Animated rings for dramatic effect */}
                <div
                  className={`absolute inset-0 rounded-full border-2 animate-ping ${
                    suspectEmotion === "angry"
                      ? "border-red-400"
                      : suspectEmotion === "nervous"
                        ? "border-yellow-400"
                        : suspectEmotion === "cooperative"
                          ? "border-green-400"
                          : "border-red-400"
                  } opacity-30`}
                ></div>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-red-200 mb-2">{suspect.name}</h2>
                <p className="text-red-300 text-lg mb-3">{suspect.description}</p>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={`${
                      suspect.mood === "cooperative"
                        ? "border-green-500/50 text-green-400 bg-green-500/10"
                        : suspect.mood === "defensive"
                          ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                          : suspect.mood === "hostile"
                            ? "border-red-500/50 text-red-400 bg-red-500/10"
                            : "border-purple-500/50 text-purple-400 bg-purple-500/10"
                    } px-3 py-1 animate-pulse`}
                  >
                    {suspect.mood.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 px-3 py-1">
                    {askedQuestions.size} QUESTIONS ASKED
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhanced Trust Meter */}
            <div
              className={`text-center ${trustInfo.bgColor} p-6 rounded-lg border-2 border-red-600/50 min-w-[250px] shadow-2xl`}
            >
              <div className="text-sm text-red-400 mb-2 font-bold">PSYCHOLOGICAL PROFILE</div>
              <div className={`text-5xl font-bold ${trustInfo.color} mb-3 animate-pulse`}>{suspect.trustLevel}%</div>
              <div className="w-48 bg-red-900/50 rounded-full h-6 mb-3 border-2 border-red-600/30 overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all duration-1000 ${
                    suspect.trustLevel >= 70
                      ? "bg-gradient-to-r from-green-500 to-green-400 shadow-green-400/50"
                      : suspect.trustLevel >= 40
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-yellow-400/50"
                        : "bg-gradient-to-r from-red-500 to-red-400 shadow-red-400/50"
                  } shadow-lg`}
                  style={{ width: `${suspect.trustLevel}%` }}
                />
              </div>
              <div className={`text-sm ${trustInfo.color} font-bold tracking-wider`}>{trustInfo.description}</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Conversation Display */}
          <div className="lg:col-span-2">
            <Card className="bg-black/95 border-red-500/30 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-red-500/30 bg-gradient-to-r from-red-950/50 to-black">
                <h3 className="text-2xl font-bold text-red-200 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-red-400" />
                  INTERROGATION LOG
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-400">RECORDING</span>
                  </div>
                </h3>
              </div>

              <div
                className="p-6 h-[600px] overflow-y-auto space-y-6 bg-gradient-to-b from-red-950/10 to-black/50 custom-scrollbar"
                style={{ scrollBehavior: "smooth" }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.speaker === "detective" ? "justify-end" : "justify-start"} mb-6 animate-fadeIn`}
                  >
                    <div
                      className={`max-w-lg p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
                        message.speaker === "detective"
                          ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-2 border-blue-500/50 shadow-blue-500/30"
                          : "bg-gradient-to-br from-red-900/90 via-black to-red-950/90 text-red-100 border-2 border-red-500/50 shadow-red-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.speaker === "detective" ? "bg-blue-500" : "bg-red-600"
                            }`}
                          >
                            {message.speaker === "detective" ? "🕵️" : getCharacterPortrait(suspect.id, suspectEmotion)}
                          </div>
                          <span className="text-sm font-bold">
                            {message.speaker === "detective" ? "DETECTIVE ICONIC" : suspect.name.toUpperCase()}
                          </span>
                          {message.tone && (
                            <div
                              className={`p-1 rounded ${
                                message.tone === "calm"
                                  ? "bg-green-500/30"
                                  : message.tone === "aggressive"
                                    ? "bg-red-500/30"
                                    : "bg-blue-500/30"
                              }`}
                            >
                              {getToneIcon(message.tone)}
                            </div>
                          )}
                        </div>
                        {message.trustChange && (
                          <div
                            className={`text-xs flex items-center font-bold px-2 py-1 rounded ${
                              message.trustChange > 0 ? "text-green-300 bg-green-500/20" : "text-red-300 bg-red-500/20"
                            }`}
                          >
                            {message.trustChange > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {message.trustChange > 0 ? `+${message.trustChange}` : message.trustChange}
                          </div>
                        )}
                      </div>
                      <p className="text-base leading-relaxed font-medium">{message.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start mb-6 animate-fadeIn">
                    <div className="bg-gradient-to-br from-red-900/90 via-black to-red-950/90 text-red-200 max-w-lg p-6 rounded-2xl border-2 border-red-500/50 shadow-2xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          {getCharacterPortrait(suspect.id, "nervous")}
                        </div>
                        <span className="text-sm font-bold">{suspect.name.toUpperCase()}</span>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-base text-red-300 italic">Thinking carefully...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card>
          </div>

          {/* Enhanced Question Panel */}
          <Card className="bg-black/95 border-red-500/30 shadow-2xl">
            <div className="p-6 border-b border-red-500/30 bg-gradient-to-r from-red-950/50 to-black">
              <h3 className="text-xl font-bold text-red-200 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-red-400" />
                INTERROGATION OPTIONS
              </h3>
              <p className="text-sm text-red-400 mt-1">{filteredQuestions.length} questions available</p>
            </div>

            <div className="p-6">
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <Button
                      key={question.id}
                      onClick={() => askQuestion(question)}
                      className={`${getToneColor(question.tone)} text-left justify-start p-6 h-auto w-full text-sm hover:scale-105 transition-all duration-300 shadow-lg border border-white/10`}
                      disabled={isTyping || askedQuestions.has(question.id)}
                    >
                      <div className="flex items-start space-x-4 w-full">
                        <div className="p-2 bg-white/20 rounded-full">{getToneIcon(question.tone)}</div>
                        <div className="flex-1 text-left">
                          <div className="font-bold mb-2 text-base leading-relaxed">{question.text}</div>
                          <div className="text-xs opacity-90 flex items-center space-x-3">
                            <span className="bg-white/20 px-2 py-1 rounded">
                              {question.tone.charAt(0).toUpperCase() + question.tone.slice(1)}
                            </span>
                            {question.evidenceRequired && (
                              <span className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-300">
                                Evidence Required
                              </span>
                            )}
                            {question.trustChange > 0 && (
                              <span className="text-green-300 flex items-center bg-green-500/20 px-2 py-1 rounded">
                                <TrendingUp className="w-3 h-3 mr-1" />+{question.trustChange}
                              </span>
                            )}
                            {question.trustChange < 0 && (
                              <span className="text-red-300 flex items-center bg-red-500/20 px-2 py-1 rounded">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                {question.trustChange}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <p className="text-red-400 text-lg font-bold">All Questions Exhausted</p>
                    <p className="text-sm text-red-500">Review the conversation to build your case</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-red-600/30">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full border-red-600/50 text-red-300 hover:bg-red-950/30 hover:border-red-500 py-3 font-bold"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
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
