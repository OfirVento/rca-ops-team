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
import { LiveWorkspace } from '@/components/workspace/LiveWorkspace';

export default function ControlTower() {
  const { stages, issues, heartbeat } = useEngine();
  const [activeView, setActiveView] = React.useState<'Live Workspace' | 'Dashboard'>('Dashboard');

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
          <div className="flex items-center justify-between">
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

            {/* View Switcher */}
            <div className="flex bg-m3-surface-container p-0.5 rounded-full border border-m3-outline-variant shadow-sm h-fit mb-2">
              {['Dashboard', 'Live Workspace'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    activeView === view
                      ? "bg-white text-google-blue shadow-m3-1"
                      : "text-m3-on-surface-variant hover:text-m3-on-surface text-opacity-70"
                  )}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <LifecycleStepper />
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-12 space-y-12">
          {activeView === 'Dashboard' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-h-0"
            >
              <LiveWorkspace />
            </motion.div>
          )}
        </div>
      </div>

      <PilotGuide />
    </div>
  );
}
