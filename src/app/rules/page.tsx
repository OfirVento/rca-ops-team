"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutGrid,
    Search,
    ExternalLink
} from 'lucide-react';
import { useEngine } from '@/context/EngineContext';
import { PilotGuide } from '@/components/layout/PilotGuide';
import { LifecycleStepper } from '@/components/ui/LifecycleStepper';
import { LogicGuidePanel, GuideItem } from '@/components/logic/LogicGuidePanel';
import { UsageMap } from '@/components/logic/UsageMap';
import { LogicHealthStrip } from '@/components/logic/LogicHealthStrip';
import { ImpactFeed, FeedItem } from '@/components/logic/ImpactFeed';

export default function LogicHome() {
    const router = useRouter();
    const { stages, ruleSets } = useEngine();

    const guideItems: GuideItem[] = [
        {
            headline: "CPQ Discount Policy v12 is driving 38% of today’s queue.",
            why: "Approval routing tightened last week.",
            cta: "Show CPQ v12",
            onClick: () => router.push('/rules/CPQ?ruleSet=rs1')
        },
        {
            headline: "Billing Anomaly rule is holding 12 invoices.",
            why: "Spike after usage import change.",
            cta: "Show Billing holds",
            onClick: () => router.push('/rules/Billing?ruleSet=rs6')
        },
        {
            headline: "2 legacy Contract rules still firing (safe to retire).",
            why: "Old template still referenced in APAC.",
            cta: "Show legacy rules",
            onClick: () => router.push('/rules/Contracts?filter=LEGACY')
        }
    ];

    const usageData = stages.map(stage => {
        const areaSets = ruleSets.filter(rs => rs.area === stage.name);
        return {
            stage: stage.name,
            now: areaSets.filter(rs => rs.status === 'ACTIVE').length,
            trending: areaSets.filter(rs => rs.violations90d > 100).length,
            legacy: areaSets.filter(rs => rs.status === 'LEGACY').length
        };
    });

    const feedItems: FeedItem[] = [
        {
            id: 'rs1',
            type: 'Deployed',
            title: 'CPQ Discount Approvals v12 deployed.',
            impactTags: ['Revenue', 'Cycle Time'],
            why: 'Approvals down 8% (7d) after routing refinement.',
            date: '6d ago'
        },
        {
            id: 'rs6',
            type: 'Proposed',
            title: 'Billing anomaly threshold v8 proposed.',
            impactTags: ['Revenue', 'Compliance'],
            why: 'Expected holds +4/week to capture Tier 2 surge.',
            date: '4d ago'
        },
        {
            id: 'rs4',
            type: 'Deprecated',
            title: 'Contracts Net Terms v2 marked legacy.',
            impactTags: ['Compliance'],
            why: 'Legacy still firing on APAC Template v2.',
            date: '120d ago'
        }
    ];

    const stats = {
        rulesInProd: ruleSets.filter(rs => rs.status === 'ACTIVE').length + 119,
        testsPassing: "98.4%",
        pendingApprovals: 3,
        driftAlerts: 7
    };

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                <header className="px-10 pt-10 pb-6 border-b border-m3-outline-variant bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-google-blue/10 flex items-center justify-center">
                                    <LayoutGrid className="h-3.5 w-3.5 text-google-blue" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-google-blue">Control Plane</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-m3-on-surface uppercase italic leading-none">
                                Business <span className="text-google-blue">Logic</span>
                            </h1>
                            <p className="text-sm font-bold text-m3-on-surface-variant">
                                Rules that power agents across the revenue lifecycle (outside Salesforce)
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search rules..."
                                    className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-600/10 transition-all w-64 shadow-sm"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
                                Salesforce <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-brand-600" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <LifecycleStepper />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-10 py-10 no-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-10">
                        {/* 2) Agent Guide Banner */}
                        <LogicGuidePanel items={guideItems} />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* 3) 90-Day Usage Map */}
                            <div className="lg:col-span-8 space-y-8">
                                <UsageMap
                                    data={usageData}
                                    onCellClick={(stage, col) => router.push(`/rules/${stage}?filter=${col}`)}
                                />

                                {/* 4) Logic Health Strip */}
                                <LogicHealthStrip
                                    stats={stats}
                                    onTileClick={(filter) => router.push(`/rules/All?filter=${filter}`)}
                                />
                            </div>

                            {/* 5) Change & Impact Feed */}
                            <div className="lg:col-span-4">
                                <ImpactFeed
                                    items={feedItems}
                                    onViewRuleSet={(id) => router.push(`/rules/All?ruleSet=${id}`)}
                                />
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="px-10 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Guide Mini-Assist</span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 italic">"What rules are most important this month?"</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Ask Logic Guide..."
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5 text-[10px] font-semibold w-64 focus:outline-none focus:ring-2 focus:ring-brand-600/10 transition-all"
                        />
                    </div>
                </footer>
            </div>

            <PilotGuide />
        </div>
    );
}
