'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface UserProfile {
  companyName: string;
  email: string;
  phone: string;
  registrationNumber: string;
  industry: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    companyName: '',
    email: '',
    phone: '',
    registrationNumber: '',
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setProfile((prev) => ({
        ...prev,
        companyName: userData.companyName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const existingData = JSON.parse(userData);
        const updated = { ...existingData, ...profile };
        localStorage.setItem('user', JSON.stringify(updated));
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

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
        <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your company information and account settings
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-8 border border-border max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-foreground font-medium">
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              value={profile.companyName}
              onChange={handleChange}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber" className="text-foreground font-medium">
              Company Registration Number
            </Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={profile.registrationNumber}
              onChange={handleChange}
              className="bg-input border-border"
              placeholder="e.g., TIN or Business License Number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-foreground font-medium">
              Industry/Sector
            </Label>
            <Input
              id="industry"
              name="industry"
              type="text"
              value={profile.industry}
              onChange={handleChange}
              className="bg-input border-border"
              placeholder="e.g., Manufacturing, Services, Technology"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-border">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Additional Information */}
      <Card className="p-8 border border-border max-w-2xl bg-muted/30">
        <h3 className="font-semibold text-foreground text-lg mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Account Created</p>
            <p className="font-medium text-foreground">
              {new Date().toLocaleDateString('en-ET', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Account Status</p>
            <div className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
              Active
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Subscription Plan</p>
            <p className="font-medium text-foreground">Standard (Free)</p>
          </div>
        </div>
      </Card>

      {/* Help Section */}
      <Card className="p-8 border border-border max-w-2xl bg-muted/30">
        <h3 className="font-semibold text-foreground text-lg mb-4">Need Help?</h3>
        <p className="text-muted-foreground mb-4">
          If you have questions about your account or the assessment process, please contact our
          support team.
        </p>
        <Button variant="outline">Contact Support</Button>
      </Card>
    </div>
  );
}
