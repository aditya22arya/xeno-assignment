
"use client"

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface MessageVariation {
  tone: string;
  message: string;
}

export function AIMessageGenerator() {
  const [loading, setLoading] = useState(false);
  const [campaignType, setCampaignType] = useState("");
  const [tone, setTone] = useState("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [generatedContent, setGeneratedContent] = useState<{
    message: string;
    variations: MessageVariation[];
    suggestions: {
      callToAction: string | null;
      personalization: {
        hasNamePlaceholder: boolean;
        hasCustomFields: boolean;
        suggestedFields: string[];
      };
    };
  } | null>(null);

  const generateMessage = async () => {
    if (!campaignType || !targetAudience || !keyPoints) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignType,
          targetAudience,
          tone,
          keyPoints: keyPoints.split(",").map((point) => point.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate message");
      }

      const data = await response.json();
      setGeneratedContent(data);
      toast.success("Message generated successfully!");
    } catch (error) {
      toast.error("Failed to generate message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Message Generator</CardTitle>
        <CardDescription>
          Generate personalized campaign messages using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              Campaign Type
            </label>
            <Select value={campaignType} onValueChange={setCampaignType}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="welcome">Welcome</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Target Audience
            </label>
            <Input
              placeholder="Describe your target audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Key Points (comma-separated)
            </label>
            <Textarea
              placeholder="Enter key points to include in the message"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select message tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateMessage}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Message
          </Button>
        </div>

        {generatedContent && (
          <div className="space-y-4 mt-6">
            <Tabs defaultValue="original">
              <TabsList className="w-full">
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="original" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="whitespace-pre-wrap">
                      {generatedContent.message}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variations" className="mt-4 space-y-4">
                {generatedContent.variations.map((variation, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {variation.tone} Variation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap">
                        {variation.message}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="insights" className="mt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {generatedContent.suggestions.callToAction && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Call to Action
                        </h4>
                        <Badge variant="secondary">
                          {generatedContent.suggestions.callToAction}
                        </Badge>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Personalization
                      </h4>
                      <div className="space-y-2">
                        {generatedContent.suggestions.personalization
                          .suggestedFields.length > 0 && (
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Suggested fields to include:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {generatedContent.suggestions.personalization.suggestedFields.map(
                                (field) => (
                                  <Badge key={field} variant="outline">
                                    {field}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
