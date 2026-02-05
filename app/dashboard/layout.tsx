'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  LogOut,
  Menu,
  Settings,
  User,
  Home,
  FileText,
  TrendingUp,
  Shield,
  CheckSquare,
  X,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login');
    } else {
      const userData = JSON.parse(user);
      setUserEmail(userData.email || '');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!mounted) return null;

  const menuItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: TrendingUp, label: 'Financial Data', href: '/dashboard/financial' },
    { icon: Shield, label: 'Governance', href: '/dashboard/governance' },
    { icon: CheckSquare, label: 'Assessment', href: '/dashboard/assessment' },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Toggle */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-background border-b border-border lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            ESX
          </div>
          <span className="font-semibold text-foreground">IPO Analyzer</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 left-0 top-0 h-screen w-64 bg-card border-r border-border pt-20 lg:pt-0 transition-transform duration-200 z-30 flex flex-col`}
      >
        {/* Logo (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            ESX
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">IPO Analyzer</div>
            <div className="text-xs text-muted-foreground">Assessment Tool</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="px-4 py-3 rounded-lg bg-muted">
            <div className="text-xs text-muted-foreground">Logged in as</div>
            <div className="text-sm font-medium text-foreground truncate">
              {userEmail}
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 justify-start bg-transparent"
              onClick={() => setSidebarOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-20 lg:pt-0">
        <div className="h-full">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
