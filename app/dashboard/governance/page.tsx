'use client';

import React from "react"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function GovernancePage() {
  const [formData, setFormData] = useState({
    boardMembers: '',
    cfoName: '',
    cfoExperience: '',
    hasAuditCommittee: 'yes',
    auditCommitteeChair: '',
    governanceCodeScore: '3',
    ownershipConcentration: '',
    majorShareholders: '',
    conflictPolicyExists: 'yes',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem('governanceData', JSON.stringify(formData));
      toast.success('Governance data saved successfully!');
    } catch (error) {
      toast.error('Failed to save governance data');
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-foreground">Governance Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Evaluate your company's governance structures and practices
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-8 border border-border">
        <form onSubmit={handleSave} className="space-y-8">
          <Tabs defaultValue="board" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="board">Board & Leadership</TabsTrigger>
              <TabsTrigger value="structure">Ownership Structure</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            {/* Board & Leadership */}
            <TabsContent value="board" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="boardMembers" className="text-foreground font-medium">
                    Number of Board Members
                  </Label>
                  <Input
                    id="boardMembers"
                    name="boardMembers"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.boardMembers}
                    onChange={handleChange}
                    className="bg-input border-border"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    ESX requires minimum 3 members
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cfoName" className="text-foreground font-medium">
                    CFO Name
                  </Label>
                  <Input
                    id="cfoName"
                    name="cfoName"
                    type="text"
                    placeholder="Chief Financial Officer name"
                    value={formData.cfoName}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cfoExperience" className="text-foreground font-medium">
                    CFO Years of Experience
                  </Label>
                  <Input
                    id="cfoExperience"
                    name="cfoExperience"
                    type="number"
                    placeholder="e.g., 15"
                    value={formData.cfoExperience}
                    onChange={handleChange}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hasAuditCommittee" className="text-foreground font-medium">
                    Audit Committee Exists
                  </Label>
                  <select
                    id="hasAuditCommittee"
                    name="hasAuditCommittee"
                    value={formData.hasAuditCommittee}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="auditCommitteeChair" className="text-foreground font-medium">
                    Audit Committee Chair Name
                  </Label>
                  <Input
                    id="auditCommitteeChair"
                    name="auditCommitteeChair"
                    type="text"
                    placeholder="Name of audit committee chair"
                    value={formData.auditCommitteeChair}
                    onChange={handleChange}
                    className="bg-input border-border"
                    disabled={formData.hasAuditCommittee === 'no'}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Ownership Structure */}
            <TabsContent value="structure" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="majorShareholders" className="text-foreground font-medium">
                  Major Shareholders (List top 5 with shareholding %)
                </Label>
                <textarea
                  id="majorShareholders"
                  name="majorShareholders"
                  placeholder="e.g.&#10;John Doe: 35%&#10;Jane Smith: 25%&#10;etc."
                  value={formData.majorShareholders}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      majorShareholders: e.target.value,
                    }))
                  }
                  className="w-full min-h-32 px-3 py-2 rounded-lg border border-border bg-input text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownershipConcentration" className="text-foreground font-medium">
                  Ownership Concentration (Largest shareholder %)
                </Label>
                <Input
                  id="ownershipConcentration"
                  name="ownershipConcentration"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 45"
                  value={formData.ownershipConcentration}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Lower concentration is preferred for ESX listing
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-foreground font-medium mb-2">ESX Requirements</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Clear shareholding structure with register</li>
                  <li>• Shareholders agreement in place</li>
                  <li>• No significant beneficial ownership concerns</li>
                  <li>• Disclosure of related party transactions</li>
                </ul>
              </div>
            </TabsContent>

            {/* Compliance */}
            <TabsContent value="compliance" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="governanceCodeScore" className="text-foreground font-medium">
                  Governance Code Compliance Level (1-5)
                </Label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          governanceCodeScore: score.toString(),
                        }))
                      }
                      className={`w-12 h-12 rounded-lg border-2 transition-colors font-semibold ${
                        formData.governanceCodeScore === score.toString()
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border bg-background text-foreground hover:border-primary'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  1 = Non-compliant, 5 = Fully compliant
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conflictPolicyExists" className="text-foreground font-medium">
                  Conflict of Interest Policy Exists
                </Label>
                <select
                  id="conflictPolicyExists"
                  name="conflictPolicyExists"
                  value={formData.conflictPolicyExists}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="in_development">In Development</option>
                </select>
              </div>

              <Card className="p-6 border border-border bg-muted/30">
                <h4 className="font-semibold text-foreground mb-4">ESX Governance Standards</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-primary flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-muted-foreground">
                      Board must have independent directors
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-primary flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-muted-foreground">
                      Audit and Risk committees must be established
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-primary flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-muted-foreground">
                      Annual financial audits by external auditors required
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-primary flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-muted-foreground">
                      Transparent disclosure and reporting standards
                    </span>
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
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? 'Saving...' : 'Save Governance Data'}{' '}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
