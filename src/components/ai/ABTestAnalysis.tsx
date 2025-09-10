"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ABTestData {
  variantA: {
    total: number;
    delivered: number;
    opened: number;
    clicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
  variantB: {
    total: number;
    delivered: number;
    opened: number;
    clicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
  analysis: {
    openRateSignificance: number;
    clickRateSignificance: number;
    winner: "A" | "B" | "tie";
    confidenceLevel: number;
  };
  insights: {
    analysis: string;
    recommendations: {
      immediate: string[];
      longTerm: string[];
      testing: string[];
    };
    suggestedTests: {
      type: string;
      description: string;
      priority: string;
    }[];
  };
}

export function ABTestAnalysis({
  variantA,
  variantB,
  timeframe,
}: {
  variantA: string;
  variantB: string;
  timeframe: { start: string; end: string };
}) {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState<ABTestData | null>(null);

  const analyzeTest = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/ab-test-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantA,
          variantB,
          timeframe,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze test");
      }

      const data = await response.json();
      setTestData(data);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      toast.error("Failed to analyze test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (value: number | null | undefined) => {
    if (!value && value !== 0) return "text-gray-500";
    if (value >= 80) return "text-green-500";
    if (value >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>A/B Test Analysis</CardTitle>
        <CardDescription>
          Compare and analyze the performance of your message variants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={analyzeTest} disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analyze Test Results
        </Button>

        {testData && (
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Alert
                variant={
                  testData.analysis.confidenceLevel >= 95
                    ? "default"
                    : testData.analysis.confidenceLevel >= 90
                    ? "default"
                    : "destructive"
                }
              >
                <AlertTitle className="flex items-center gap-2">
                  {testData.analysis.confidenceLevel >= 95 ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  Test Results{" "}
                  {testData.analysis.confidenceLevel >= 95
                    ? "Significant"
                    : "Need More Data"}
                </AlertTitle>
                <AlertDescription>
                  Confidence Level: {testData.analysis.confidenceLevel}%
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Winner</CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.analysis.winner === "tie" ? (
                    <div className="text-center">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        It&apos;s a Tie!
                      </Badge>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Both variants performed similarly
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Badge
                        variant="default"
                        className="text-lg px-4 py-2"
                      >
                        Variant {testData.analysis.winner} Wins!
                      </Badge>
                      <p className="mt-2 text-sm text-muted-foreground">
                        With {testData.analysis.confidenceLevel}% confidence
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Variant A</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Delivery Rate</span>
                        <span
                          className={`text-sm font-medium ${getMetricColor(
                            testData.variantA.deliveryRate
                          )}`}
                        >
                          {testData.variantA.deliveryRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={testData.variantA.deliveryRate || 0}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Open Rate</span>
                        <span
                          className={`text-sm font-medium ${getMetricColor(
                            testData.variantA.openRate
                          )}`}
                        >
                          {testData.variantA.openRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={testData.variantA.openRate || 0}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Click Rate</span>
                        <span
                          className={`text-sm font-medium ${getMetricColor(
                            testData.variantA.clickRate
                          )}`}
                        >
                          {testData.variantA.clickRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={testData.variantA.clickRate || 0}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Variant B</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Delivery Rate</span>
                        <span
                          className={`text-sm font-medium ${getMetricColor(
                            testData.variantB.deliveryRate
                          )}`}
                        >
                          {testData.variantB.deliveryRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={testData.variantB.deliveryRate || 0}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Open Rate</span>
                        <span
                          className={`text-sm font-medium ${getMetricColor(
                            testData.variantB.openRate
                          )}`}
                        >
                          {testData.variantB.openRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={testData.variantB.openRate || 0}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Click Rate</span>
                        <span
                          className={`text-sm font-medium ${getMetricColor(
                            testData.variantB.clickRate
                          )}`}
                        >
                          {testData.variantB.clickRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={testData.variantB.clickRate || 0}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={[
                          {
                            metric: "Delivery Rate",
                            A: testData.variantA.deliveryRate || 0,
                            B: testData.variantB.deliveryRate || 0,
                          },
                          {
                            metric: "Open Rate",
                            A: testData.variantA.openRate || 0,
                            B: testData.variantB.openRate || 0,
                          },
                          {
                            metric: "Click Rate",
                            A: testData.variantA.clickRate || 0,
                            B: testData.variantB.clickRate || 0,
                          },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Variant A"
                          dataKey="A"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Variant B"
                          dataKey="B"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose dark:prose-invert">
                    <p className="whitespace-pre-wrap">
                      {testData.insights.analysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Immediate Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    {testData.insights.recommendations.immediate.map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Long-term Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    {testData.insights.recommendations.longTerm.map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testData.insights.suggestedTests.map((test, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <div>
                          <h4 className="font-medium">{test.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {test.description}
                          </p>
                          <Badge
                            variant={
                              test.priority === "High"
                                ? "destructive"
                                : test.priority === "Medium"
                                ? "default"
                                : "secondary"
                            }
                            className="mt-2"
                          >
                            {test.priority} Priority
                          </Badge>
                        </div>
                      </div>
                    ))}
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
