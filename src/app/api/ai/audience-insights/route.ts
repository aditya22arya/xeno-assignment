import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Customer from "@/models/customer";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { segmentId } = await req.json();

    // Analyze customer data patterns
    const customerData = await Customer.find({ segmentId }).limit(100).lean();
    
    // Prepare data for AI analysis
    const analysisData = customerData.map((customer: any) => ({
      location: customer.location,
      purchaseHistory: customer.purchaseHistory,
      preferences: customer.preferences,
      engagementScore: customer.engagementScore
    }));

    const prompt = `Analyze this customer segment data and provide insights:
    ${JSON.stringify(analysisData)}
    
    Provide:
    1. Key demographic patterns
    2. Behavioral insights
    3. Purchase patterns
    4. Engagement trends
    5. Recommendations for targeting`;

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
            content: "You are an expert marketing analyst providing detailed customer segment insights."
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

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Generate visual data suggestions
    const visualizations = generateVisualizationSuggestions(analysisData);

    return NextResponse.json({
      insights: {
        analysis,
        demographics: extractDemographics(analysisData),
        behaviors: analyzeBehavioralPatterns(analysisData),
        recommendations: generateRecommendations(analysis),
        visualizations
      }
    });
  } catch (error) {
    console.error("Error in audience insights generation:", error);
    return NextResponse.json(
      { error: "Failed to generate audience insights" },
      { status: 500 }
    );
  }
}

function extractDemographics(data: any[]) {
  // Extract key demographic information
  const demographics = {
    locations: {} as Record<string, number>,
    engagementLevels: {
      high: 0,
      medium: 0,
      low: 0
    }
  };

  data.forEach(customer => {
    // Count locations
    if (customer.location) {
      demographics.locations[customer.location] = 
        (demographics.locations[customer.location] || 0) + 1;
    }

    // Categorize engagement
    if (customer.engagementScore >= 8) demographics.engagementLevels.high++;
    else if (customer.engagementScore >= 4) demographics.engagementLevels.medium++;
    else demographics.engagementLevels.low++;
  });

  return demographics;
}

function analyzeBehavioralPatterns(data: any[]) {
  // Analyze customer behavior patterns
  const patterns = {
    purchaseFrequency: {
      high: 0,
      medium: 0,
      low: 0
    },
    preferences: {} as Record<string, number>,
    peakPurchaseTimes: {} as Record<string, number>
  };

  data.forEach(customer => {
    // Analyze purchase history
    if (customer.purchaseHistory) {
      const frequency = customer.purchaseHistory.length;
      if (frequency > 10) patterns.purchaseFrequency.high++;
      else if (frequency > 5) patterns.purchaseFrequency.medium++;
      else patterns.purchaseFrequency.low++;

      // Analyze preferences
      customer.preferences?.forEach((pref: string) => {
        patterns.preferences[pref] = (patterns.preferences[pref] || 0) + 1;
      });
    }
  });

  return patterns;
}

function generateVisualizationSuggestions(data: any[]) {
  // Suggest relevant visualizations based on data patterns
  const suggestions = [];

  // Check if we have location data
  if (Object.keys(data[0]?.location || {}).length > 0) {
    suggestions.push({
      type: "map",
      title: "Geographic Distribution",
      description: "Show customer concentration across different locations"
    });
  }

  // Check if we have engagement scores
  if (data.some(d => d.engagementScore !== undefined)) {
    suggestions.push({
      type: "gauge",
      title: "Engagement Level Distribution",
      description: "Display engagement score distribution"
    });
  }

  // Add timeline suggestion if we have purchase history
  if (data.some(d => d.purchaseHistory?.length > 0)) {
    suggestions.push({
      type: "timeline",
      title: "Purchase Pattern Timeline",
      description: "Visualize purchase frequency over time"
    });
  }

  return suggestions;
}

function generateRecommendations(analysis: string) {
  // Extract and structure recommendations from the AI analysis
  const recommendations = {
    messaging: [] as string[],
    timing: [] as string[],
    channels: [] as string[],
    content: [] as string[]
  };

  // Parse the analysis for specific recommendation types
  if (analysis.toLowerCase().includes("message")) {
    recommendations.messaging.push("Personalized messaging based on engagement level");
  }
  if (analysis.toLowerCase().includes("time") || analysis.toLowerCase().includes("when")) {
    recommendations.timing.push("Optimal sending times based on past engagement");
  }
  if (analysis.toLowerCase().includes("channel")) {
    recommendations.channels.push("Multi-channel approach recommended");
  }
  if (analysis.toLowerCase().includes("content")) {
    recommendations.content.push("Content tailored to segment preferences");
  }

  return recommendations;
}
