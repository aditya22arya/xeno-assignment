
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2, LineChart, PieChartIcon, MapIcon } from "lucide-react";
import { toast } from "sonner";

interface InsightData {
  analysis: string;
  demographics: {
    locations: Record<string, number>;
    engagementLevels: {
      high: number;
      medium: number;
      low: number;
    };
  };
  behaviors: {
    purchaseFrequency: {
      high: number;
      medium: number;
      low: number;
    };
    preferences: Record<string, number>;
  };
  recommendations: {
    messaging: string[];
    timing: string[];
    channels: string[];
    content: string[];
  };
  visualizations: {
    type: string;
    title: string;
    description: string;
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function AudienceInsights({ segmentId }: { segmentId?: string }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>(segmentId || "");

  // Fetch available audience segments
  const fetchSegments = async () => {
    try {
      const response = await fetch("/api/audiences");
      if (response.ok) {
        const data = await response.json();
        setSegments(data.audienceSegments || []);
        if (!selectedSegment && data.audienceSegments?.length > 0) {
          setSelectedSegment(data.audienceSegments[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch segments:", error);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const generateInsights = async () => {
    if (!selectedSegment) {
      toast.error("Please select an audience segment");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/audience-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          segmentId: selectedSegment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      const data = await response.json();
      setInsights(data.insights);
      toast.success("Insights generated successfully!");
    } catch (error) {
      toast.error("Failed to generate insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Audience Insights</CardTitle>
        <CardDescription>
          Generate deep insights about your audience segment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Audience Segment
            </label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an audience segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment._id} value={segment._id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={generateInsights}
            disabled={loading || !selectedSegment}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LineChart className="mr-2 h-4 w-4" />
            )}
            Generate Insights
          </Button>
        </div>

        {insights && (
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-wrap">{insights.analysis}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(insights.demographics.locations).map(
                            ([name, value]) => ({
                              name,
                              value,
                            })
                          )}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {Object.entries(insights.demographics.locations).map(
                            (_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engagement Levels</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "High",
                            value: insights.demographics.engagementLevels.high,
                          },
                          {
                            name: "Medium",
                            value: insights.demographics.engagementLevels.medium,
                          },
                          {
                            name: "Low",
                            value: insights.demographics.engagementLevels.low,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Purchase Frequency</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "High",
                            value: insights.behaviors.purchaseFrequency.high,
                          },
                          {
                            name: "Medium",
                            value: insights.behaviors.purchaseFrequency.medium,
                          },
                          {
                            name: "Low",
                            value: insights.behaviors.purchaseFrequency.low,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(insights.behaviors.preferences).map(
                      ([pref, count]) => (
                        <Badge key={pref} variant="secondary">
                          {pref}: {count}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Messaging Recommendations
                      </h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {insights.recommendations.messaging.map((rec, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Timing Recommendations
                      </h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {insights.recommendations.timing.map((rec, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Channel Recommendations
                      </h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {insights.recommendations.channels.map((rec, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Content Recommendations
                      </h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {insights.recommendations.content.map((rec, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
