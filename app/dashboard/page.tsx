'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface DashboardData {
  companyName: string;
  email: string;
  lastAssessment: string | null;
  overallScore: number | null;
  progressPercentage: number;
  assessmentStatus: 'not_started' | 'in_progress' | 'completed';
  readinessLevel?: string;
  recommendation?: string;
  sectionScores?: {
    financial: number;
    governance: number;
    operational: number;
    legal?: number;
    business?: number;
    market?: number;
    equityStory?: number;
  };
}

const mockData: DashboardData = {
  companyName: 'Demo Company',
  email: 'demo@company.com',
  lastAssessment: null,
  overallScore: null,
  progressPercentage: 0,
  assessmentStatus: 'not_started',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(mockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setData(prev => ({
            ...prev,
            companyName: userData.companyName || 'Your Company',
            email: userData.email || '',
          }));

          // Fetch the latest assessment data
          if (userData.companyId) {
            const response = await fetch(`/api/questionnaire?companyId=${userData.companyId}`);
            if (response.ok) {
              const assessmentData = await response.json();
              if (assessmentData) {
                setData(prev => ({
                  ...prev,
                  overallScore: assessmentData.overallScore || null,
                  lastAssessment: assessmentData.createdAt || null,
                  assessmentStatus: assessmentData.overallScore ? 'completed' : 'not_started',
                  readinessLevel: assessmentData.readinessLevel,
                  recommendation: assessmentData.recommendation,
                  sectionScores: assessmentData.sectionScores,
                  progressPercentage: assessmentData.overallScore ? 
                    Math.min(100, Math.max(0, assessmentData.overallScore)) : 0,
                }));
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...ni hao</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome, {data.companyName}
          </h1>
          <p className="text-muted-foreground">
            Track your IPO readiness journey with ESX
          </p>
        </div>
        <Link href="/dashboard/assessment">
          <Button size="lg" className="gap-2">
            Start Assessment <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Assessment Status */}
      {data.assessmentStatus === 'not_started' && (
        <Card className="p-6 md:p-8 border-l-4 border-l-primary bg-primary/5">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Get Started with Your Assessment
              </h2>
              <p className="text-muted-foreground mb-4">
                Complete our comprehensive IPO readiness assessment to evaluate your financial,
                governance, and operational maturity against ESX Growth Market requirements.
              </p>
              <Link href="/dashboard/assessment">
                <Button variant="default" className="gap-2">
                  Begin Assessment <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Overall Score</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.overallScore !== null ? `${Math.round(data.overallScore)}/100` : 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-xs font-medium mb-1">
            {data.readinessLevel || 'Not Assessed'}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {data.recommendation || 'Complete the assessment to get started'}
          </p>
        </Card>

        <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Progress</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.progressPercentage}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <Progress value={data.progressPercentage} className="h-2 mt-2" />
        </Card>

        <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Last Assessment</p>
              <p className="text-lg font-bold text-foreground mt-2">
                {data.lastAssessment ? new Date(data.lastAssessment).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {data.lastAssessment ? 'View historical assessments' : 'No assessments completed yet'}
          </p>
        </Card>

        <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Documents</p>
              <p className="text-3xl font-bold text-foreground mt-2">0</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Upload supporting documents</p>
        </Card>
      </div>

      {/* Main Assessment Card */}
      <Card className="p-8 border border-border">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            IPO Readiness Assessment
          </h2>
          <p className="text-muted-foreground">
            Complete the following sections to evaluate your readiness for ESX Growth Market listing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Financial Data',
              description: 'Enter financial statements and operational metrics',
              icon: BarChart3,
              href: '/dashboard/financial',
              status: data.sectionScores?.financial ? 'completed' : 'not_started',
              score: data.sectionScores?.financial,
            },
            {
              title: 'Governance Assessment',
              description: 'Evaluate board structure and governance practices',
              icon: CheckCircle2,
              href: '/dashboard/governance',
              status: data.sectionScores?.governance ? 'completed' : 'not_started',
              score: data.sectionScores?.governance,
            },
            {
              title: 'Risk Assessment',
              description: 'Identify and evaluate key risks to address',
              icon: AlertCircle,
              href: '/dashboard/assessment',
              status: data.overallScore ? 'completed' : 'not_started',
            },
          ].map((section, i) => (
            <Link key={i} href={section.href}>
              <div className="p-6 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  {section.score !== undefined && (
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      {Math.round(section.score)}%
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {section.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  {section.status === 'completed' ? 'View Details' : 'Get Started'}{' '}
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Resources */}
      <Card className="p-8 border border-border bg-muted/30">
        <h2 className="text-xl font-bold text-foreground mb-4">
          ESX Growth Market Requirements
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Minimum Financial Requirements',
              items: [
                'Audited financial statements (3 years)',
                'Minimum ETB 1 million in revenue',
                'Positive earnings in preceding 2 years',
              ],
            },
            {
              title: 'Governance Standards',
              items: [
                'Board of Directors (minimum 3 members)',
                'Audit Committee established',
                'Clear shareholding structure',
                'Code of conduct in place',
              ],
            },
          ].map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold text-foreground mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
