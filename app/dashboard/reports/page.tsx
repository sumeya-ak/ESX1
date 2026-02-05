'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  calculateFinancialReadinessScore,
  calculateGovernanceReadinessScore,
  calculateOperationalReadinessScore,
  calculateOverallIPOReadinessScore,
  assessRisks,
  type FinancialScoreInput,
  type GovernanceScoreInput,
  type OperationalScoreInput,
} from '@/lib/scoring';

interface ReportData {
  financialScore: number;
  governanceScore: number;
  operationalScore: number;
  overallScore: number;
  readinessLevel: string;
  recommendation: string;
  risks: Array<{
    category: string;
    type: string;
    description: string;
    severity: string;
  }>;
  financialBreakdown: Record<string, number>;
  governanceBreakdown: Record<string, number>;
  operationalBreakdown: Record<string, number>;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assessment data and generating scores
    const financialData: FinancialScoreInput = {
      currentRatio: 2.5,
      debtToEquity: 1.2,
      netProfitMargin: 0.08,
      returnOnAssets: 0.12,
      revenueGrowth: 0.15,
      yearsInOperation: 4,
      liquidAssets: 5000000,
      totalAssets: 25000000,
    };

    const governanceData: GovernanceScoreInput = {
      hasBoard: true,
      hasCFO: true,
      hasAuditCommittee: true,
      auditedFinancials: true,
      corporateGovernanceCode: 4,
      ownershipConcentration: 45,
      conflictOfInterest: 4,
    };

    const operationalData: OperationalScoreInput = {
      totalEmployees: 150,
      hasHRPolicy: true,
      hasQualityControl: true,
      customerRetention: 85,
      marketPosition: 4,
      hasSuccessionPlan: true,
      hasITInfrastructure: true,
    };

    const financialResult = calculateFinancialReadinessScore(financialData);
    const governanceResult = calculateGovernanceReadinessScore(governanceData);
    const operationalResult = calculateOperationalReadinessScore(operationalData);
    const overallResult = calculateOverallIPOReadinessScore(
      financialResult.score,
      governanceResult.score,
      operationalResult.score
    );
    const risks = assessRisks(financialData, governanceData, operationalData);

    setReportData({
      financialScore: financialResult.score,
      governanceScore: governanceResult.score,
      operationalScore: operationalResult.score,
      overallScore: overallResult.score,
      readinessLevel: overallResult.readinessLevel,
      recommendation: overallResult.recommendation,
      risks: risks.map((r) => ({ ...r, severity: r.severity })),
      financialBreakdown: financialResult.breakdown,
      governanceBreakdown: governanceResult.breakdown,
      operationalBreakdown: operationalResult.breakdown,
    });

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Generating your IPO Readiness Report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Assessment Data</h2>
          <p className="text-muted-foreground mb-6">
            Please complete the assessment first to generate a report
          </p>
          <Link href="/dashboard/assessment">
            <Button className="gap-2">
              Go to Assessment <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-foreground">IPO Readiness Report</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive assessment of your readiness for ESX Growth Market listing
        </p>
      </div>

      {/* Overall Score Card */}
      <Card className="p-8 border border-border bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-muted-foreground font-medium mb-2">Overall IPO Readiness Score</p>
            <h2 className="text-5xl font-bold text-foreground mb-4">
              {reportData.overallScore}
              <span className="text-2xl text-muted-foreground">/100</span>
            </h2>
            <div className="space-y-3">
              <div className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold">
                {reportData.readinessLevel}
              </div>
              <p className="text-muted-foreground max-w-lg">
                {reportData.recommendation}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Financial Readiness</p>
                <p className="text-lg font-bold text-foreground">{reportData.financialScore}</p>
              </div>
              <Progress value={reportData.financialScore} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Governance Readiness</p>
                <p className="text-lg font-bold text-foreground">{reportData.governanceScore}</p>
              </div>
              <Progress value={reportData.governanceScore} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Operational Readiness</p>
                <p className="text-lg font-bold text-foreground">{reportData.operationalScore}</p>
              </div>
              <Progress value={reportData.operationalScore} className="h-3" />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="next_steps">Next Steps</TabsTrigger>
        </TabsList>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Financial Analysis */}
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Financial Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">Score</p>
                  <p className="text-2xl font-bold text-primary">{reportData.financialScore}</p>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  {Object.entries(reportData.financialBreakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium text-foreground">
                        {typeof value === 'number' ? value.toFixed(1) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Governance Analysis */}
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Governance Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">Score</p>
                  <p className="text-2xl font-bold text-primary">{reportData.governanceScore}</p>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  {Object.entries(reportData.governanceBreakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium text-foreground">
                        {typeof value === 'number' ? value.toFixed(0) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Operational Analysis */}
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Operational Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">Score</p>
                  <p className="text-2xl font-bold text-primary">{reportData.operationalScore}</p>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  {Object.entries(reportData.operationalBreakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium text-foreground">
                        {typeof value === 'number' ? value.toFixed(0) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-6">
          {reportData.risks.length === 0 ? (
            <Card className="p-8 border border-border text-center">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">No Critical Risks Identified</p>
              <p className="text-muted-foreground">Your company demonstrates good readiness</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reportData.risks.map((risk, idx) => (
                <Card
                  key={idx}
                  className={`p-6 border ${getSeverityBg(risk.severity)}`}
                >
                  <div className="flex items-start gap-4">
                    {risk.severity === 'critical' && (
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    {risk.severity === 'high' && (
                      <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    )}
                    {(risk.severity === 'medium' || risk.severity === 'low') && (
                      <Info className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{risk.type}</h4>
                        <span
                          className={`text-xs font-semibold uppercase px-2 py-1 rounded ${getSeverityColor(
                            risk.severity
                          )}`}
                        >
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{risk.category}</p>
                      <p className="text-sm text-foreground">{risk.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card className="p-8 border border-border">
            <h3 className="font-semibold text-foreground text-lg mb-4">Key Recommendations</h3>
            <div className="space-y-4">
              {reportData.overallScore >= 80 && (
                <>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <p className="font-medium text-foreground mb-1">1. Proceed with IPO Preparation</p>
                    <p className="text-sm text-muted-foreground">
                      Your company demonstrates strong IPO readiness. Begin formal IPO process and
                      engage with ESX advisors and underwriters.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <p className="font-medium text-foreground mb-1">2. Maintain Momentum</p>
                    <p className="text-sm text-muted-foreground">
                      Continue strengthening operational controls and governance practices while
                      preparing for public markets.
                    </p>
                  </div>
                </>
              )}
              {reportData.overallScore < 80 && reportData.overallScore >= 65 && (
                <>
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="font-medium text-foreground mb-1">1. Address Key Gaps</p>
                    <p className="text-sm text-muted-foreground">
                      Focus on identified gaps in financial metrics and governance structures
                      before proceeding with IPO plans.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="font-medium text-foreground mb-1">2. Strengthen Financial Position</p>
                    <p className="text-sm text-muted-foreground">
                      Work on improving profitability and reducing leverage ratios to meet ESX
                      requirements.
                    </p>
                  </div>
                </>
              )}
              {reportData.overallScore < 65 && (
                <>
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="font-medium text-foreground mb-1">1. Develop Improvement Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Create a comprehensive 2-3 year plan to address financial, governance, and
                      operational gaps.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="font-medium text-foreground mb-1">2. Strengthen Foundation</p>
                    <p className="text-sm text-muted-foreground">
                      Priority should be on establishing strong governance structures and improving
                      financial performance.
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Next Steps Tab */}
        <TabsContent value="next_steps" className="space-y-6">
          <Card className="p-8 border border-border">
            <h3 className="font-semibold text-foreground text-lg mb-6">Recommended Next Steps</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Schedule Consultation</p>
                  <p className="text-sm text-muted-foreground">
                    Meet with ESX advisors to discuss your specific situation and roadmap
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Prepare Documentation</p>
                  <p className="text-sm text-muted-foreground">
                    Gather audited financial statements and governance documents
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Engage Professional Advisors</p>
                  <p className="text-sm text-muted-foreground">
                    Hire investment banks, legal counsel, and audit firms specializing in IPOs
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Develop IPO Timeline</p>
                  <p className="text-sm text-muted-foreground">
                    Create a realistic roadmap and timeline for your listing process
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-between pt-6 border-t border-border">
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" /> Download Report
          </Button>
          <Link href="/dashboard/assessment">
            <Button className="gap-2">
              New Assessment <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
