'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface GovernanceQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'yes_no' | 'rating';
  maxValue?: number;
}

interface ESXRequirement {
  id: string;
  category: string;
  requirement: string;
  met: boolean;
}

const governanceQuestions: GovernanceQuestion[] = [
  {
    id: 'board',
    question: 'Does your company have a Board of Directors?',
    description: 'ESX Growth Market requires a formal board with at least 3 members',
    type: 'yes_no',
  },
  {
    id: 'cfo',
    question: 'Does your company have a Chief Financial Officer (CFO) or equivalent?',
    type: 'yes_no',
  },
  {
    id: 'audit_committee',
    question: 'Do you have an Audit Committee in place?',
    type: 'yes_no',
  },
  {
    id: 'audited_statements',
    question: 'Are your financial statements audited by an independent auditor?',
    description: 'Mandatory for ESX listing',
    type: 'yes_no',
  },
  {
    id: 'governance_code',
    question: 'How well does your company comply with corporate governance codes?',
    type: 'rating',
    maxValue: 5,
  },
  {
    id: 'ownership_concentration',
    question: 'How is ownership distributed among shareholders?',
    description: 'High concentration (>80%) may be a concern',
    type: 'rating',
    maxValue: 5,
  },
  {
    id: 'conflict_management',
    question: 'How effectively does your company manage conflicts of interest?',
    type: 'rating',
    maxValue: 5,
  },
];

const esxRequirements: ESXRequirement[] = [
  {
    id: 'req1',
    category: 'Financial',
    requirement: 'Audited financial statements for at least 3 years',
    met: false,
  },
  {
    id: 'req2',
    category: 'Financial',
    requirement: 'Minimum ETB 1 million in annual revenue',
    met: false,
  },
  {
    id: 'req3',
    category: 'Financial',
    requirement: 'Positive earnings in at least 2 of preceding 3 years',
    met: false,
  },
  {
    id: 'req4',
    category: 'Governance',
    requirement: 'Board of Directors with at least 3 members',
    met: false,
  },
  {
    id: 'req5',
    category: 'Governance',
    requirement: 'Audit Committee established',
    met: false,
  },
  {
    id: 'req6',
    category: 'Governance',
    requirement: 'Clear shareholding structure and register',
    met: false,
  },
  {
    id: 'req7',
    category: 'Governance',
    requirement: 'Code of conduct and ethics policy',
    met: false,
  },
  {
    id: 'req8',
    category: 'Operational',
    requirement: 'Minimum 50 employees or equivalent operational scale',
    met: false,
  },
  {
    id: 'req9',
    category: 'Operational',
    requirement: 'Documented business strategy and growth plan',
    met: false,
  },
  {
    id: 'req10',
    category: 'Operational',
    requirement: 'Quality management and operational controls',
    met: false,
  },
];

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState('governance');
  const [governanceResponses, setGovernanceResponses] = useState<Record<string, any>>({});
  const [esxRequirementsMet, setESXRequirementsMet] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleGovernanceChange = (id: string, value: any) => {
    setGovernanceResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleESXRequirementToggle = (id: string) => {
    setESXRequirementsMet((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Retrieve any saved financial & operational data
      const financialRaw = localStorage.getItem('financialData');
      const operationalRaw = localStorage.getItem('operationalData');
      const financialData = financialRaw ? JSON.parse(financialRaw) : {};
      const operationalData = operationalRaw ? JSON.parse(operationalRaw) : {};

      const mapNumber = (v: any) => (v ? Number(v) : 0);

      // Build minimal metric objects expected by backend
      const financial = {
        currentRatio: mapNumber(financialData.currentAssets) && mapNumber(financialData.currentLiabilities)
          ? mapNumber(financialData.currentAssets) / mapNumber(financialData.currentLiabilities)
          : 0,
        debtToEquity:
          mapNumber(financialData.totalLiabilities) && mapNumber(financialData.totalEquity)
            ? mapNumber(financialData.totalLiabilities) / mapNumber(financialData.totalEquity)
            : 0,
        netProfitMargin:
          mapNumber(financialData.netIncome) && mapNumber(financialData.revenue)
            ? mapNumber(financialData.netIncome) / mapNumber(financialData.revenue)
            : 0,
        returnOnAssets:
          mapNumber(financialData.netIncome) && mapNumber(financialData.totalAssets)
            ? mapNumber(financialData.netIncome) / mapNumber(financialData.totalAssets)
            : 0,
        revenueGrowth: 0,
        yearsInOperation: 0,
        liquidAssets: mapNumber(financialData.currentAssets),
        totalAssets: mapNumber(financialData.totalAssets),
      };

      const governance = {
        hasBoard: governanceResponses['board'] === 'yes',
        hasCFO: governanceResponses['cfo'] === 'yes',
        hasAuditCommittee: governanceResponses['audit_committee'] === 'yes',
        auditedFinancials: governanceResponses['audited_statements'] === 'yes',
        corporateGovernanceCode: Number(governanceResponses['governance_code'] || 0),
        ownershipConcentration: 100 - Number(governanceResponses['ownership_concentration'] || 0),
        conflictOfInterest: Number(governanceResponses['conflict_management'] || 0),
      };

      const operational = {
        totalEmployees: Number(financialData.totalEmployees || 0),
        hasHRPolicy: true,
        hasQualityControl: true,
        customerRetention: 0,
        marketPosition: 3,
        hasSuccessionPlan: true,
        hasITInfrastructure: true,
      };

      const userRaw = localStorage.getItem('user');
      const userData = userRaw ? JSON.parse(userRaw) : {};

      const payload = {
        companyId: userData.companyId || userData._id || '',
        financial,
        governance,
        operational,
        rawAnswers: {
          governanceResponses,
          esxRequirementsMet,
          financialData,
          operationalData,
        },
      };

      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to save assessment');
      }

      toast.success('Assessment saved! Generating report...');
      const { id } = await res.json();
      setTimeout(() => {
        window.location.href = `/dashboard/reports?id=${id}`;
      }, 1500);
    } catch (error) {
      toast.error('Failed to save assessment');
    } finally {
      setLoading(false);
    }
  };

  const completedQuestions = Object.keys(governanceResponses).length;
  const governanceProgress = (completedQuestions / governanceQuestions.length) * 100;
  const metRequirements = Object.values(esxRequirementsMet).filter(Boolean).length;
  const requirementsProgress = (metRequirements / esxRequirements.length) * 100;

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
        <h1 className="text-3xl font-bold text-foreground">IPO Readiness Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Complete governance and operational assessment aligned with ESX Growth Market requirements
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="governance">Governance & Operations</TabsTrigger>
            <TabsTrigger value="esx">ESX Requirements</TabsTrigger>
          </TabsList>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <Card className="p-6 md:p-8 border border-border">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Governance & Operational Assessment
                  </h2>
                  <div className="text-sm text-muted-foreground">{completedQuestions} / {governanceQuestions.length}</div>
                </div>
                <Progress value={governanceProgress} className="h-2" />
              </div>

              <div className="space-y-8">
                {governanceQuestions.map((q, idx) => (
                  <div key={q.id} className="p-6 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 text-lg font-semibold text-primary">{idx + 1}</div>
                      <div className="flex-1">
                        <Label className="text-base font-semibold text-foreground cursor-pointer">
                          {q.question}
                        </Label>
                        {q.description && (
                          <p className="text-sm text-muted-foreground mt-1">{q.description}</p>
                        )}
                      </div>
                    </div>

                    {q.type === 'yes_no' ? (
                      <RadioGroup
                        value={governanceResponses[q.id] || ''}
                        onValueChange={(value) => handleGovernanceChange(q.id, value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                          <Label htmlFor={`${q.id}-yes`} className="cursor-pointer font-normal">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${q.id}-no`} />
                          <Label htmlFor={`${q.id}-no`} className="cursor-pointer font-normal">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="flex gap-3">
                        {Array.from({ length: q.maxValue || 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              handleGovernanceChange(q.id, (i + 1).toString())
                            }
                            className={`w-10 h-10 rounded-lg border-2 transition-colors font-semibold ${
                              governanceResponses[q.id] === (i + 1).toString()
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-border bg-background text-foreground hover:border-primary'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ESX Requirements Tab */}
          <TabsContent value="esx" className="space-y-6">
            <Card className="p-6 md:p-8 border border-border">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    ESX Growth Market Requirements
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {metRequirements} / {esxRequirements.length} met
                  </div>
                </div>
                <Progress value={requirementsProgress} className="h-2" />
              </div>

              <div className="space-y-6">
                {['Financial', 'Governance', 'Operational'].map((category) => (
                  <div key={category} className="space-y-4">
                    <h3 className="font-semibold text-foreground text-lg">{category} Requirements</h3>
                    <div className="space-y-3">
                      {esxRequirements
                        .filter((req) => req.category === category)
                        .map((req) => (
                          <div
                            key={req.id}
                            className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={req.id}
                                checked={esxRequirementsMet[req.id] || false}
                                onCheckedChange={() => handleESXRequirementToggle(req.id)}
                                className="mt-1"
                              />
                              <label
                                htmlFor={req.id}
                                className="flex-1 text-sm font-medium text-foreground cursor-pointer"
                              >
                                {req.requirement}
                              </label>
                              {esxRequirementsMet[req.id] && (
                                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary */}
        <Card className="p-6 md:p-8 border border-border bg-muted/30">
          <h3 className="font-semibold text-foreground mb-4">Assessment Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Governance Questionnaire</p>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-foreground">
                  {completedQuestions}/{governanceQuestions.length}
                </div>
                <p className="text-sm text-muted-foreground mb-0.5">questions answered</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">ESX Requirements</p>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-foreground">
                  {metRequirements}/{esxRequirements.length}
                </div>
                <p className="text-sm text-muted-foreground mb-0.5">requirements met</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between pt-6 border-t border-border">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={
              loading ||
              completedQuestions < governanceQuestions.length ||
              metRequirements === 0
            }
            className="gap-2"
          >
            {loading ? 'Generating Report...' : 'Generate Assessment Report'}{' '}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
