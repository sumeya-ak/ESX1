'use client';

import React from "react"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? 'Registration failed');
      }

      toast.success('Account created successfully!');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              ESX
            </div>
            <span className="text-xl font-bold text-foreground">IPO Analyzer</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">
            Start your journey to IPO readiness with ESX
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-foreground font-medium">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Your company name"
                value={formData.companyName}
                onChange={handleChange}
                disabled={loading}
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
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
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
                placeholder="+251 9XX XXX XXXX"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="bg-input border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="bg-input border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-foreground font-medium"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="bg-input border-border"
                required
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <input
                id="terms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={loading}
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-primary hover:underline font-medium"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full gap-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}{' '}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          {[
            'Complete IPO readiness assessment',
            'Professional governance evaluation',
            'Risk identification & mitigation',
            'ESX Growth Market compliance tracking',
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
