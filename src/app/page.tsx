"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  LayoutGrid,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine } from '@/context/EngineContext';
import { LifecycleStepper } from '@/components/ui/LifecycleStepper';
import { KPIStrip } from '@/components/ui/KPIStrip';
import { FunnelTile } from '@/components/ui/FunnelTile';
import { IssueCard } from '@/components/ui/IssueCard';
import { PilotGuide } from '@/components/layout/PilotGuide';

export default function ControlTower() {
  const { stages, issues, heartbeat } = useEngine();

  const getStageMetrics = (stageName: string) => {
    switch (stageName) {
      case 'Catalog': return [{ label: 'Effective Conflict', value: 2 }, { label: 'Missing Tier', value: 3 }];
      case 'CPQ': return [{ label: 'Quotes in Progress', value: 124 }, { label: 'Approvals Pending', value: 8 }];
      case 'Contracts': return [{ label: 'Pending Signature', value: 11 }, { label: 'Term Mismatch', value: 19 }];
      case 'Orders': return [{ label: 'Blocked Tasks', value: 6 }, { label: 'Overdue SLA', value: 4 }];
      case 'Assets': return [{ label: 'Renewals 30d', value: 48 }, { label: 'Entitlement Drift', value: 22 }];
      case 'Billing': return [{ label: 'Ready / Held', value: 12 }, { label: 'Anomalies', value: 4 }];
      default: return [];
    }
  };

  return (
    <div className="flex h-full w-full bg-m3-surface-container-low">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header Section */}
        <header className="px-10 pt-10 pb-6 space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-google-blue/10 flex items-center justify-center shadow-m3-1">
                  <Activity className="h-4 w-4 text-google-blue animate-pulse" />
                </div>
                <span className="m3-type-label-large text-google-blue">Live Operations</span>
              </div>
              <h1 className="m3-type-display-large text-m3-on-surface italic">
                Control <span className="text-google-blue opacity-40">Tower</span>
              </h1>
              <p className="m3-type-body-large text-m3-on-surface-variant max-w-lg">
                Coordinating autonomous revenue across all customers.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-m3-lg border border-m3-outline-variant shadow-m3-1 hover:shadow-m3-2 transition-all">
              <div className="px-5 py-2 border-r border-m3-outline-variant flex flex-col items-center">
                <span className="m3-type-label-large text-m3-on-surface-variant mb-1">Heartbeat</span>
                <span className="m3-type-label-large text-google-blue font-black tracking-widest">0x{heartbeat.toString(16).toUpperCase()}</span>
              </div>
              <div className="px-4 py-1 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-m3-surface-container shadow-m3-1" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="m3-type-label-large text-m3-on-surface !tracking-tight">6 Specialists</span>
                  <span className="text-[10px] font-black text-google-green uppercase tracking-widest mt-0.5">Sync Active</span>
                </div>
              </div>
            </div>
          </div>

          <LifecycleStepper />
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-12 space-y-12">
          {/* Global KPI Strip */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <div className="h-1 w-8 rounded-full bg-google-blue shadow-google-glow" />
              <h2 className="m3-type-label-large text-m3-on-surface-variant flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Global Status
              </h2>
            </div>
            <KPIStrip />
          </section>

          {/* Funnel Tiles */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-google-green shadow-m3-1" />
                <h2 className="m3-type-label-large text-m3-on-surface-variant flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Lifecycle Performance
                </h2>
              </div>
              <button className="m3-type-label-large text-google-blue hover:underline">
                View Full Metrics
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stages.map((stage, i) => (
                <FunnelTile
                  key={stage.name}
                  stage={stage}
                  idx={i}
                  metrics={getStageMetrics(stage.name)}
                />
              ))}
            </div>
          </section>

          {/* Priority Queue Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-google-red shadow-m3-1" />
                <h2 className="m3-type-label-large text-m3-on-surface-variant flex items-center gap-2">
                  <Zap className="h-4 w-4 text-google-yellow" />
                  Critical Workstreams
                </h2>
              </div>
              <button className="m3-type-label-large text-google-blue flex items-center gap-1 group">
                Open Inbox <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <PilotGuide />
    </div>
  );
}
