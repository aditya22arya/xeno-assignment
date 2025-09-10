import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, MessageSquare, Users, Zap, CheckCircle2, ChevronRight } from "lucide-react";

import { GradientMesh } from "@/components/ui/gradient-mesh";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative">
      <GradientMesh />
      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="w-full pt-12 pb-12 md:pt-24 md:pb-24 lg:pt-32 lg:pb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background"></div>
          <div className="container px-4 mx-auto md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-[800px] mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium mb-6 animate-slide-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Xeno SDE Internship Assignment – 2025
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-primary">
                Mini CRM Platform
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mb-8">
                Build a modern CRM that enables customer segmentation, personalized campaign delivery, secure APIs, and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                  <Link href="/campaigns" className="gap-2">
                    Start Building <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-foreground border-border hover:bg-muted transition-all duration-300 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                  <Link href="api-docs" className="gap-2">
                    API Reference <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-16 lg:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center text-center mb-12 md:mb-16">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                Core Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl mb-4 text-foreground">
                End-to-End CRM Assignment Workflow
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                The platform implements secure data ingestion, campaign creation, delivery & logging, authentication, and AI-driven insights.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Feature Cards */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardContent className="p-6 md:p-8 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Customer Segmentation</h3>
                  <p className="text-muted-foreground mb-6">
                    Create flexible audience segments using powerful rule logic to target the right customers.
                  </p>
                  <ul className="space-y-2 text-sm text-left w-full">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Define complex conditions with AND/OR logic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Preview audience size before saving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Save segments for future campaigns</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardContent className="p-6 md:p-8 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Campaign Delivery</h3>
                  <p className="text-muted-foreground mb-6">
                    Send personalized messages to your audience segments with real-time delivery tracking.
                  </p>
                  <ul className="space-y-2 text-sm text-left w-full">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Personalized messaging for each customer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Track delivery status in real-time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>View campaign history and performance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardContent className="p-6 md:p-8 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">AI-Powered Insights</h3>
                  <p className="text-muted-foreground mb-6">
                    Leverage artificial intelligence to gain deeper insights and optimize your campaigns.
                  </p>
                  <ul className="space-y-2 text-sm text-left w-full">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Natural language to segment rules conversion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>AI-driven message suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Smart scheduling recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-1 border-none shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardContent className="p-6 md:p-8 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive analytics to measure campaign performance and customer engagement.
                  </p>
                  <ul className="space-y-2 text-sm text-left w-full">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Campaign performance metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Customer engagement tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Actionable insights and recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-18 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="container px-4 mx-auto md:px-6 relative z-10">
            <div className="max-w-[800px] mx-auto bg-card rounded-xl border transition-all duration-300 dark:shadow-[0_0_25px_rgba(255,255,255,0.08)] shadow-[0_0_25px_rgba(0,0,0,0.08)] p-8 md:p-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
                  Ready to complete the CRM challenge?
                </h2>
                <p className="text-muted-foreground md:text-xl max-w-[600px]">
                  Start building your Mini CRM Assignment for Xeno SDE Internship 2025 and demonstrate your skills in APIs, UI, delivery, and AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                    <Link href="/campaigns" className="gap-2">
                      Start Now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
