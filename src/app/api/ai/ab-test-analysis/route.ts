import { NextResponse } from "next/server";
import { auth } from "@/auth";
import CommunicationLog from "@/models/communicationLog";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { variantA, variantB, timeframe } = await req.json();

    // Fetch results for both variants
    const [variantAResults, variantBResults] = await Promise.all([
      CommunicationLog.find({
        messageVariant: variantA,
        createdAt: { $gte: new Date(timeframe.start), $lte: new Date(timeframe.end) }
      }).lean(),
      CommunicationLog.find({
        messageVariant: variantB,
        createdAt: { $gte: new Date(timeframe.start), $lte: new Date(timeframe.end) }
      }).lean()
    ]);

    // Calculate metrics
    const variantAMetrics = calculateMetrics(variantAResults);
    const variantBMetrics = calculateMetrics(variantBResults);

    // Analyze statistical significance
    const analysis = analyzeResults(variantAMetrics, variantBMetrics);

    // Generate AI insights
    const insights = await generateAIInsights({
      variantA: variantAMetrics,
      variantB: variantBMetrics,
      analysis
    });

    return NextResponse.json({
      variantA: variantAMetrics,
      variantB: variantBMetrics,
      analysis,
      insights,
      recommendations: insights.recommendations,
      confidenceLevel: analysis.confidenceLevel
    });
  } catch (error) {
    console.error("Error in A/B test analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze A/B test results" },
      { status: 500 }
    );
  }
}

function calculateMetrics(logs: any[]) {
  const total = logs.length;
  const delivered = logs.filter(log => log.status === "delivered").length;
  const opened = logs.filter(log => log.opened).length;
  const clicked = logs.filter(log => log.clicked).length;

  return {
    total,
    delivered,
    opened,
    clicked,
    deliveryRate: (delivered / total) * 100,
    openRate: (opened / delivered) * 100,
    clickRate: (clicked / opened) * 100
  };
}

function analyzeResults(variantA: any, variantB: any) {
  // Calculate z-score for statistical significance
  const calculateZScore = (rate1: number, count1: number, rate2: number, count2: number) => {
    const p1 = rate1 / 100;
    const p2 = rate2 / 100;
    const n1 = count1;
    const n2 = count2;
    
    const p = (p1 * n1 + p2 * n2) / (n1 + n2);
    const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
    
    return Math.abs((p1 - p2) / se);
  };

  const openRateZScore = calculateZScore(
    variantA.openRate,
    variantA.delivered,
    variantB.openRate,
    variantB.delivered
  );

  const clickRateZScore = calculateZScore(
    variantA.clickRate,
    variantA.opened,
    variantB.clickRate,
    variantB.opened
  );

  // Determine confidence level
  const getConfidenceLevel = (zScore: number) => {
    if (zScore > 2.576) return 99;
    if (zScore > 1.96) return 95;
    if (zScore > 1.645) return 90;
    return 0;
  };

  return {
    openRateSignificance: getConfidenceLevel(openRateZScore),
    clickRateSignificance: getConfidenceLevel(clickRateZScore),
    winner: determineWinner(variantA, variantB),
    confidenceLevel: Math.max(
      getConfidenceLevel(openRateZScore),
      getConfidenceLevel(clickRateZScore)
    )
  };
}

function determineWinner(variantA: any, variantB: any) {
  const metrics = ['openRate', 'clickRate'];
  let aScore = 0;
  let bScore = 0;

  metrics.forEach(metric => {
    if (variantA[metric] > variantB[metric]) aScore++;
    else if (variantB[metric] > variantA[metric]) bScore++;
  });

  if (aScore > bScore) return 'A';
  if (bScore > aScore) return 'B';
  return 'tie';
}

async function generateAIInsights(data: any) {
  const prompt = `Analyze these A/B test results and provide insights:
    Variant A: ${JSON.stringify(data.variantA)}
    Variant B: ${JSON.stringify(data.variantB)}
    Statistical Analysis: ${JSON.stringify(data.analysis)}
    
    Provide:
    1. Key findings
    2. Reasons for performance differences
    3. Actionable recommendations
    4. Suggestions for future tests`;

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
          content: "You are an expert in A/B testing analysis and marketing optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const aiResponse = await response.json();
  const insights = aiResponse.choices[0].message.content;

  return {
    analysis: insights,
    recommendations: extractRecommendations(insights),
    suggestedTests: generateTestSuggestions(data)
  };
}

function extractRecommendations(insights: string) {
  // Extract specific recommendations from AI insights
  const recommendations = {
    immediate: [] as string[],
    longTerm: [] as string[],
    testing: [] as string[]
  };

  // Simple parsing logic - could be enhanced with more sophisticated NLP
  if (insights.toLowerCase().includes("immediately") || insights.toLowerCase().includes("right away")) {
    recommendations.immediate.push("Implement winning variant immediately");
  }
  if (insights.toLowerCase().includes("future") || insights.toLowerCase().includes("next test")) {
    recommendations.testing.push("Plan follow-up tests to validate findings");
  }
  if (insights.toLowerCase().includes("long term") || insights.toLowerCase().includes("strategy")) {
    recommendations.longTerm.push("Update messaging strategy based on insights");
  }

  return recommendations;
}

function generateTestSuggestions(data: any) {
  // Generate suggestions for future A/B tests based on current results
  const suggestions = [];

  if (data.analysis.confidenceLevel < 95) {
    suggestions.push({
      type: "Sample Size",
      description: "Increase test duration to achieve higher confidence level",
      priority: "High"
    });
  }

  if (Math.abs(data.variantA.openRate - data.variantB.openRate) < 5) {
    suggestions.push({
      type: "Subject Line",
      description: "Test more distinctive subject line variations",
      priority: "Medium"
    });
  }

  suggestions.push({
    type: "Time of Day",
    description: "Test sending at different times to optimize delivery",
    priority: "Medium"
  });

  return suggestions;
}
