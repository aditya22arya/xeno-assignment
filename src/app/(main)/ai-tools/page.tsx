import { AIMessageGenerator } from "@/components/ai/MessageGenerator";
import { AudienceInsights } from "@/components/ai/AudienceInsights";
import { ABTestAnalysis } from "@/components/ai/ABTestAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIInsightsPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Campaign Tools</CardTitle>
          <CardDescription>
            Leverage AI to optimize your campaigns and understand your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="message-generator" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="message-generator">Message Generator</TabsTrigger>
              <TabsTrigger value="audience-insights">Audience Insights</TabsTrigger>
              <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="message-generator">
              <AIMessageGenerator />
            </TabsContent>

            <TabsContent value="audience-insights">
              <AudienceInsights segmentId="current" />
            </TabsContent>

            <TabsContent value="ab-testing">
              <ABTestAnalysis
                variantA="version-a"
                variantB="version-b"
                timeframe={{
                  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                  end: new Date().toISOString(),
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    );
  }
