import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { campaignType, targetAudience, tone, keyPoints } = await req.json();

    // AI prompt engineering for better message generation
    const prompt = `Create a marketing message for a ${campaignType} campaign targeting ${targetAudience}.
    Tone: ${tone}
    Key Points to Include: ${keyPoints.join(", ")}
    Requirements:
    - Keep it concise and engaging
    - Include personalization placeholders
    - Follow marketing best practices
    - Maintain brand voice
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an expert marketing copywriter who creates personalized, engaging messages."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    // Check if the API response has the expected structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response structure:", data);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }
    
    const generatedMessage = data.choices[0].message.content;

    // Add message variations
    const variations = await generateMessageVariations(generatedMessage);

    return NextResponse.json({
      message: generatedMessage,
      variations: variations,
      tone: tone,
      suggestions: {
        callToAction: extractCallToAction(generatedMessage),
        personalization: identifyPersonalizationOpportunities(generatedMessage)
      }
    });
  } catch (error) {
    console.error("Error in AI message generation:", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}

async function generateMessageVariations(baseMessage: string) {
  // Generate message variations with different tones and styles
  const variations = [
    { tone: "Professional", message: "" },
    { tone: "Casual", message: "" },
    { tone: "Urgent", message: "" }
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Generate three variations of this marketing message in different tones: professional, casual, and urgent."
        },
        {
          role: "user",
          content: baseMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  
  // Check if the API response has the expected structure for variations
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Unexpected API response structure for variations:", data);
    return variations; // Return empty variations array
  }
  
  const generatedVariations = data.choices[0].message.content.split("\n\n");
  
  variations.forEach((v, i) => {
    v.message = generatedVariations[i] || "";
  });

  return variations;
}

function extractCallToAction(message: string) {
  // Simple CTA extraction logic
  const ctaPatterns = [
    /click\s+(?:here|now)/i,
    /sign\s+up/i,
    /register\s+(?:now|today)/i,
    /learn\s+more/i,
    /get\s+started/i,
    /shop\s+now/i
  ];

  for (const pattern of ctaPatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

function identifyPersonalizationOpportunities(message: string) {
  return {
    hasNamePlaceholder: message.includes("{name}"),
    hasCustomFields: /{[^}]+}/.test(message),
    suggestedFields: [
      "name",
      "location",
      "last_purchase",
      "loyalty_tier",
      "interests"
    ].filter(field => !message.includes(`{${field}}`))
  };
}
