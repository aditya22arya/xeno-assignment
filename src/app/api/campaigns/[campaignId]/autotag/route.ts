import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CampaignModel from '@/models/campaign';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  await dbConnect();
  const { campaignId } =await params;

  const campaign = await CampaignModel.findById(campaignId);
  if (!campaign) {
    return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
  }

  const { name, audienceRules, messageTemplate, status, audienceSize, sentCount, failedCount } = campaign;

  const prompt = `You are an expert marketing strategist.

Output format requirements:
1. Return ONLY a valid JSON object with a 'tags' array
2. Format must be EXACTLY: {"tags": ["tag1", "tag2", "tag3"]}
3. Use 1-3 tags from this list:
   - "Win-back"
   - "Loyalty"
   - "Reactivation"
   - "Upsell"
   - "Cross-sell"
   - "Engagement"
   - "Retention"
   - "Activation"
   - "Nurture"
   - "Promotional"
   - "Seasonal"
   - "Exclusive-Offer"

Campaign Information:
- Name: ${name}
- Status: ${status}
- Audience Rules: ${JSON.stringify(audienceRules)}
- Message Template: "${messageTemplate}"
- Audience Size: ${audienceSize}
- Sent: ${sentCount}
- Failed: ${failedCount}

Remember to ONLY output a valid JSON array of strings like ["tag1", "tag2"]. No other text or explanations.
`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are a JSON-generating assistant. Always respond with valid JSON objects containing a 'tags' array. Example: {\"tags\": [\"tag1\", \"tag2\"]}"
      },
      { role: "user", content: prompt }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.1,
    max_tokens: 100,
    response_format: { type: "json_object" },
  });

  let tags: string[] = [];
  try {
    const content = chatCompletion.choices[0]?.message?.content;
    if (content) {
      // Clean up the content
      const cleanContent = content
        .replace(/^```json\s*|```$/g, '')  // Remove code blocks
        .replace(/[\r\n]/g, '')            // Remove newlines
        .trim();
      
      // Try to parse the response as a structured object
      const parsed = JSON.parse(cleanContent);
      
      // Handle different possible response formats
      if (Array.isArray(parsed)) {
        tags = parsed;
      } else if (parsed && Array.isArray(parsed.tags)) {
        tags = parsed.tags;
      } else if (parsed && typeof parsed === 'object') {
        // If we got an object with string values, convert to array
        tags = Object.values(parsed).filter(v => typeof v === 'string');
      }
    }
  } catch (error) {
    console.error('Error parsing tags:', error);
    // Try to extract tags from malformed JSON
    const content = chatCompletion.choices[0]?.message?.content || '';
    tags = content.match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || [];
  }
  
  // Validate and clean up tags
  tags = tags
    .filter(tag => typeof tag === 'string' && tag.length > 0)  // Keep only non-empty strings
    .map(tag => tag.trim())                                    // Clean up whitespace
    .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
    .slice(0, 3);                                             // Limit to 3 tags

  campaign.tags = tags;
  await campaign.save();

  return NextResponse.json({ tags });
}
