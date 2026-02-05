'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface FinancialData {
  fiscalYear: string;
  revenue: string;
  cogs: string;
  grossProfit: string;
  operatingExpenses: string;
  operatingIncome: string;
  interestExpense: string;
  taxExpense: string;
  netIncome: string;
  totalAssets: string;
  currentAssets: string;
  nonCurrentAssets: string;
  totalLiabilities: string;
  currentLiabilities: string;
  nonCurrentLiabilities: string;
  totalEquity: string;
  paidInCapital: string;
  retainedEarnings: string;
  totalEmployees: string;
}

const initialData: FinancialData = {
  fiscalYear: new Date().getFullYear().toString(),
  revenue: '',
  cogs: '',
  grossProfit: '',
  operatingExpenses: '',
  operatingIncome: '',
  interestExpense: '',
  taxExpense: '',
  netIncome: '',
  totalAssets: '',
  currentAssets: '',
  nonCurrentAssets: '',
  totalLiabilities: '',
  currentLiabilities: '',
  nonCurrentLiabilities: '',
  totalEquity: '',
  paidInCapital: '',
  retainedEarnings: '',
  totalEmployees: '',
};

export default function FinancialDataPage() {
  const [formData, setFormData] = useState<FinancialData>(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.revenue || !formData.totalAssets || !formData.totalLiabilities) {
        toast.error('Please fill in required fields');
        return;
      }

      // In production, this would save to a database
      localStorage.setItem('financialData', JSON.stringify(formData));

      toast.success('Financial data saved successfully!');
    } catch (error) {
      toast.error('Failed to save financial data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(Number(value));
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
        <h1 className="text-3xl font-bold text-foreground">Financial Data Input</h1>
        <p className="text-muted-foreground mt-2">
          Enter your company's financial information for the selected fiscal year
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-8 border border-border">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fiscalYear" className="text-foreground font-medium">
                Fiscal Year
              </Label>
              <Input
                id="fiscalYear"
                name="fiscalYear"
                type="number"
                value={formData.fiscalYear}
                onChange={handleChange}
                className="bg-input border-border"
                required
              />
            </div>
          </div>

          {/* Tabs for Financial Sections */}
          <Tabs defaultValue="income" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="income">Income Statement</TabsTrigger>
              <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
              <TabsTrigger value="operational">Operational</TabsTrigger>
            </TabsList>

            {/* Income Statement Tab */}
            <TabsContent value="income" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="revenue" className="text-foreground font-medium">
                    Total Revenue (ETB)
                  </Label>
                  <Input
                    id="revenue"
                    name="revenue"
                    type="number"
                    placeholder="0"
                    value={formData.revenue}
                    onChange={handleChange}
                    className="bg-input border-border"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.revenue && formatCurrency(formData.revenue)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cogs" className="text-foreground font-medium">
                    Cost of Goods Sold (ETB)
                  </Label>
                  <Input
                    id="cogs"
                    name="cogs"
                    type="number"
                    placeholder="0"
                    value={formData.cogs}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.cogs && formatCurrency(formData.cogs)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grossProfit" className="text-foreground font-medium">
                    Gross Profit (ETB)
                  </Label>
                  <Input
                    id="grossProfit"
                    name="grossProfit"
                    type="number"
                    placeholder="0"
                    value={formData.grossProfit}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="operatingExpenses"
                    className="text-foreground font-medium"
                  >
                    Operating Expenses (ETB)
                  </Label>
                  <Input
                    id="operatingExpenses"
                    name="operatingExpenses"
                    type="number"
                    placeholder="0"
                    value={formData.operatingExpenses}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="operatingIncome"
                    className="text-foreground font-medium"
                  >
                    Operating Income (ETB)
                  </Label>
                  <Input
                    id="operatingIncome"
                    name="operatingIncome"
                    type="number"
                    placeholder="0"
                    value={formData.operatingIncome}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="interestExpense"
                    className="text-foreground font-medium"
                  >
                    Interest Expense (ETB)
                  </Label>
                  <Input
                    id="interestExpense"
                    name="interestExpense"
                    type="number"
                    placeholder="0"
                    value={formData.interestExpense}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxExpense" className="text-foreground font-medium">
                    Tax Expense (ETB)
                  </Label>
                  <Input
                    id="taxExpense"
                    name="taxExpense"
                    type="number"
                    placeholder="0"
                    value={formData.taxExpense}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="netIncome" className="text-foreground font-medium">
                    Net Income (ETB)
                  </Label>
                  <Input
                    id="netIncome"
                    name="netIncome"
                    type="number"
                    placeholder="0"
                    value={formData.netIncome}
                    onChange={handleChange}
                    className="bg-input border-border"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.netIncome && formatCurrency(formData.netIncome)}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Balance Sheet Tab */}
            <TabsContent value="balance" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Assets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentAssets"
                        className="text-foreground font-medium"
                      >
                        Current Assets (ETB)
                      </Label>
                      <Input
                        id="currentAssets"
                        name="currentAssets"
                        type="number"
                        placeholder="0"
                        value={formData.currentAssets}
                        onChange={handleChange}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="nonCurrentAssets"
                        className="text-foreground font-medium"
                      >
                        Non-Current Assets (ETB)
                      </Label>
                      <Input
                        id="nonCurrentAssets"
                        name="nonCurrentAssets"
                        type="number"
                        placeholder="0"
                        value={formData.nonCurrentAssets}
                        onChange={handleChange}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="totalAssets"
                        className="text-foreground font-medium font-bold"
                      >
                        Total Assets (ETB)
                      </Label>
                      <Input
                        id="totalAssets"
                        name="totalAssets"
                        type="number"
                        placeholder="0"
                        value={formData.totalAssets}
                        onChange={handleChange}
                        className="bg-input border-border border-primary/50"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.totalAssets && formatCurrency(formData.totalAssets)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Liabilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentLiabilities"
                        className="text-foreground font-medium"
                      >
                        Current Liabilities (ETB)
                      </Label>
                      <Input
                        id="currentLiabilities"
                        name="currentLiabilities"
                        type="number"
                        placeholder="0"
                        value={formData.currentLiabilities}
                        onChange={handleChange}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="nonCurrentLiabilities"
                        className="text-foreground font-medium"
                      >
                        Non-Current Liabilities (ETB)
                      </Label>
                      <Input
                        id="nonCurrentLiabilities"
                        name="nonCurrentLiabilities"
                        type="number"
                        placeholder="0"
                        value={formData.nonCurrentLiabilities}
                        onChange={handleChange}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="totalLiabilities"
                        className="text-foreground font-medium font-bold"
                      >
                        Total Liabilities (ETB)
                      </Label>
                      <Input
                        id="totalLiabilities"
                        name="totalLiabilities"
                        type="number"
                        placeholder="0"
                        value={formData.totalLiabilities}
                        onChange={handleChange}
                        className="bg-input border-border border-primary/50"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.totalLiabilities && formatCurrency(formData.totalLiabilities)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Equity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="paidInCapital"
                        className="text-foreground font-medium"
                      >
                        Paid-in Capital (ETB)
                      </Label>
                      <Input
                        id="paidInCapital"
                        name="paidInCapital"
                        type="number"
                        placeholder="0"
                        value={formData.paidInCapital}
                        onChange={handleChange}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="retainedEarnings"
                        className="text-foreground font-medium"
                      >
                        Retained Earnings (ETB)
                      </Label>
                      <Input
                        id="retainedEarnings"
                        name="retainedEarnings"
                        type="number"
                        placeholder="0"
                        value={formData.retainedEarnings}
                        onChange={handleChange}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="totalEquity"
                        className="text-foreground font-medium font-bold"
                      >
                        Total Equity (ETB)
                      </Label>
                      <Input
                        id="totalEquity"
                        name="totalEquity"
                        type="number"
                        placeholder="0"
                        value={formData.totalEquity}
                        onChange={handleChange}
                        className="bg-input border-border border-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Operational Tab */}
            <TabsContent value="operational" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalEmployees" className="text-foreground font-medium">
                    Total Employees
                  </Label>
                  <Input
                    id="totalEmployees"
                    name="totalEmployees"
                    type="number"
                    placeholder="0"
                    value={formData.totalEmployees}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  Additional operational metrics and questionnaire will be completed in the next
                  section. This data helps us calculate key financial ratios and assess your
                  operational maturity.
                </p>
              </div>
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
              <Button
                type="submit"
                disabled={loading}
                className="gap-2"
              >
                {loading ? 'Saving...' : 'Save & Continue'}{' '}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Help Section */}
      <Card className="p-6 border border-border bg-muted/30">
        <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
        <p className="text-sm text-muted-foreground">
          All amounts should be in Ethiopian Birr (ETB). Use figures from your most recent
          audited financial statements. Ensure balance sheet equation is maintained: Assets =
          Liabilities + Equity.
        </p>
      </Card>
    </div>
  );
}
