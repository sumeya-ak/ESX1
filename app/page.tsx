'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BarChart3, CheckCircle2, Shield, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              ESX
            </div>
            <span className="text-lg font-semibold text-foreground">IPO Analyzer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Prepare Your SME for the Ethiopian Security Exchange
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Comprehensive IPO readiness assessment platform designed for Ethiopian small and medium enterprises. Evaluate financial health, governance standards, and operational maturity with AI-powered scoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Start Your Assessment <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete IPO Readiness Solution
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to evaluate and improve your readiness for ESX Growth Market listing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Financial Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Analyze your income statements, balance sheets, and calculate key financial ratios including liquidity, profitability, and leverage metrics.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Governance Assessment</h3>
            <p className="text-muted-foreground text-sm">
              Evaluate board structure, audit practices, corporate governance codes, and ownership transparency aligned with ESX requirements.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Operational Readiness</h3>
            <p className="text-muted-foreground text-sm">
              Assess operational maturity, HR practices, quality controls, and market positioning against growth market standards.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Risk Identification</h3>
            <p className="text-muted-foreground text-sm">
              Identify financial, governance, operational, and market risks with automated risk scoring and mitigation recommendations.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">ESX Compliance</h3>
            <p className="text-muted-foreground text-sm">
              Track compliance with ESX Growth Market requirements through interactive checklists and gap analysis.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Detailed Reporting</h3>
            <p className="text-muted-foreground text-sm">
              Generate comprehensive reports with executive summaries, detailed analysis, recommendations, and progress tracking.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-card rounded-2xl border border-border my-20">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'Create Account',
              description: 'Register your SME with basic company information',
            },
            {
              step: '2',
              title: 'Enter Financial Data',
              description: 'Input your income statement and balance sheet information',
            },
            {
              step: '3',
              title: 'Complete Assessment',
              description: 'Answer governance and operational questionnaires',
            },
            {
              step: '4',
              title: 'Get Results',
              description: 'Receive detailed readiness scores and recommendations',
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                {item.step}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Assess Your IPO Readiness?</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Join Ethiopian SMEs taking their first step toward listing on the ESX Growth Market
        </p>
        <Link href="/auth/register">
          <Button size="lg" className="gap-2">
            Start Free Assessment <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  ESX
                </div>
                <span className="font-semibold text-foreground">IPO Analyzer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Supporting Ethiopian SMEs in their journey to public markets
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ESX IPO Readiness Analyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
