import { type NextRequest, NextResponse } from "next/server"

interface InterrogationRequest {
  suspectId: string
  question: string
  tone: "calm" | "aggressive" | "logical"
  evidence: string[]
  suspectMood: string
  trustLevel: number
}

interface InterrogationResponse {
  response: string
  trustChange: number
  newMood: string
  unlockedInfo?: string
  effectiveness: "low" | "medium" | "high"
}

// Simple AI logic for generating suspect responses
const generateSuspectResponse = (request: InterrogationRequest): InterrogationResponse => {
  const { suspectId, question, tone, evidence, suspectMood, trustLevel } = request

  // Base responses for different suspects and tones
  const suspectPersonalities = {
    brother: {
      cooperative: "I understand you need to ask these questions. I'll help however I can.",
      defensive: "Look, I know how this looks, but I didn't do anything wrong.",
      hostile: "I don't have to listen to this. You're wasting your time.",
      nervous: "I... I'm not sure what you want me to say about that.",
    },
    stepmother: {
      cooperative: "Of course, detective. I want to find Alexander as much as anyone.",
      defensive: "I resent the implication. I care about this family.",
      hostile: "How dare you suggest I had anything to do with this!",
      nervous: "This is all very overwhelming. I'm not sure I can help.",
    },
    business_partner: {
      cooperative: "I'll answer your questions, but I hope we can resolve this quickly.",
      defensive: "The business is complicated. You wouldn't understand.",
      hostile: "I don't appreciate being treated like a criminal.",
      nervous: "There are... complexities you don't know about.",
    },
    ex_employee: {
      cooperative: "Fine, I'll talk. But I didn't do anything illegal.",
      defensive: "They fired me unfairly. That doesn't make me a kidnapper.",
      hostile: "You people ruined my life. Why should I help you?",
      nervous: "I just wanted my job back. That's all.",
    },
  }

  let response =
    suspectPersonalities[suspectId as keyof typeof suspectPersonalities]?.[
      suspectMood as keyof typeof suspectPersonalities.brother
    ] || "I don't know what to say."
  let trustChange = 0
  let newMood = suspectMood
  let effectiveness: "low" | "medium" | "high" = "medium"
  let unlockedInfo: string | undefined

  // Adjust response based on tone and current mood
  switch (tone) {
    case "calm":
      if (suspectMood === "hostile" || suspectMood === "defensive") {
        trustChange = 5
        newMood = suspectMood === "hostile" ? "defensive" : "cooperative"
        effectiveness = "high"
      } else {
        trustChange = 3
        effectiveness = "medium"
      }
      break

    case "aggressive":
      if (suspectMood === "cooperative") {
        trustChange = -10
        newMood = "defensive"
        effectiveness = "low"
        response = "I was trying to help, but if you're going to be hostile..."
      } else if (suspectMood === "nervous") {
        trustChange = -5
        effectiveness = "medium"
        unlockedInfo = `${suspectId}_pressure_info`
        response = "Okay, okay! There's something I haven't told you..."
      } else {
        trustChange = -8
        effectiveness = "low"
      }
      break

    case "logical":
      if (evidence.length > 0) {
        trustChange = 2
        effectiveness = "high"
        unlockedInfo = `${suspectId}_evidence_response`
        response = "I see you've found evidence. Let me explain what I know about that."
      } else {
        trustChange = 0
        effectiveness = "medium"
      }
      break
  }

  // Adjust based on trust level
  if (trustLevel < 30) {
    trustChange = Math.floor(trustChange * 0.5)
    effectiveness = effectiveness === "high" ? "medium" : "low"
  } else if (trustLevel > 70) {
    trustChange = Math.floor(trustChange * 1.5)
    effectiveness = effectiveness === "low" ? "medium" : "high"
  }

  return {
    response,
    trustChange,
    newMood,
    unlockedInfo,
    effectiveness,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: InterrogationRequest = await request.json()

    // Generate AI response
    const aiResponse = generateSuspectResponse(body)

    return NextResponse.json(aiResponse)
  } catch (error) {
    console.error("AI Interrogation Error:", error)
    return NextResponse.json({ error: "Failed to process interrogation" }, { status: 500 })
  }
}
