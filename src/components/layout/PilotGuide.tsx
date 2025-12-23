"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
    Sparkles,
    BrainCircuit,
    Terminal,
    ChevronRight,
    Send,
    Zap,
    Target,
    Layers,
    Search,
    User,
    CheckCircle,
    Activity,
    Loader2,
    MessageSquare,
    Bug,
    TrendingUp,
    ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types for the script ---
interface ChatStep {
    id: string;
    agentSpecialty: string;
    agentName: string;
    thinking?: string;
    reasoning?: string[];
    message: string;
    actions?: { label: string; icon?: any; primary?: boolean }[];
    delay?: number;
}

// --- Sub-components ---

const TypewriterText = ({ text, delay = 10, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasCompleted = useRef(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        setDisplayedText('');
        setCurrentIndex(0);
        hasCompleted.current = false;
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (currentIndex === text.length && !hasCompleted.current) {
            hasCompleted.current = true;
            onCompleteRef.current?.();
        }
    }, [currentIndex, text.length, delay]);

    return <span className="font-medium whitespace-pre-wrap">{displayedText}</span>;
};

const ReasoningBlock = ({ steps, active }: { steps: string[]; active: boolean }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!steps || steps.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/30 overflow-hidden shadow-[0_2px_4px_rgba(59,130,246,0.02)]"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-blue-600/80 hover:bg-blue-600/5 transition-colors uppercase tracking-[0.1em]"
            >
                <div className="flex-1 text-left flex items-center gap-2.5">
                    {active ? (
                        <div className="relative">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping" />
                        </div>
                    ) : (
                        <BrainCircuit className="h-3.5 w-3.5" />
                    )}
                    {active ? 'Logic Engine Active...' : 'Strategic Reasoning'}
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                    <span className="text-[9px] font-black">{isOpen ? 'HIDE' : 'SHOW'}</span>
                    <ChevronRight className={cn("h-3 w-3 transition-transform", isOpen && "rotate-90")} />
                </div>
            </button>

            {isOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-blue-100/50 pt-3">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-2.5 text-[11px] text-slate-700 font-medium leading-relaxed"
                        >
                            <div className="mt-1 flex-shrink-0">
                                <CheckCircle className="h-3 w-3 text-blue-500/60" />
                            </div>
                            <span>{step}</span>
                        </motion.div>
                    ))}
                    {active && (
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="flex gap-2.5 text-[11px] text-blue-600 font-bold items-center pl-0.5"
                        >
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                            <span>Processing live signals...</span>
                        </motion.div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

const AgentAvatar = ({ specialty }: { specialty: string }) => {
    const icons: Record<string, any> = {
        'Catalog': Layers,
        'CPQ': Search,
        'Contracts': Target,
        'Orders': Activity,
        'Assets': CheckCircle,
        'Billing': BrainCircuit,
        'System': Sparkles
    };

    const colors: Record<string, string> = {
        'Catalog': 'bg-black text-white',
        'CPQ': 'bg-google-blue text-white',
        'Contracts': 'bg-google-red text-white',
        'Orders': 'bg-slate-700 text-white',
        'Assets': 'bg-google-yellow text-white',
        'Billing': 'bg-indigo-600 text-white',
        'System': 'bg-slate-900 text-white'
    };

    const Icon = icons[specialty] || User;

    return (
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-white/10", colors[specialty] || 'bg-slate-900 text-white')}>
            <Icon size={14} strokeWidth={2.5} />
        </div>
    );
};

// --- Main Chat Logic ---

export function PilotGuide() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<'Feed' | 'Logs'>('Feed');
    const [scrolled, setScrolled] = useState(false);

    // Typing states
    const [visibleSteps, setVisibleSteps] = useState<number>(0);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [extraSteps, setExtraSteps] = useState<ChatStep[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Contextual Scripts - Memoized to prevent infinite loops
    const currentScript = React.useMemo((): ChatStep[] => {
        if (pathname === '/' || pathname === '/index.html') {
            return [
                {
                    id: 'd1',
                    agentSpecialty: 'System',
                    agentName: 'Orchestration Pilot',
                    thinking: 'Reviewing lifecycle performance...',
                    reasoning: [
                        'Checking where deals slow down',
                        'Checking where the system disagrees with itself',
                        'Checking where billing might surprise a customer'
                    ],
                    message: "Hi — I’m watching your revenue lifecycle end-to-end, and also keeping the machine running smoothly: approvals, rules, and billing logic.",
                },
                {
                    id: 'd2',
                    agentSpecialty: 'System',
                    agentName: 'Orchestration Pilot',
                    message: "Here are the 3 things that matter today (ranked):\n\n1. **A contract-to-billing mismatch** that could cause disputes (high impact)\n2. **Approvals are backing up** and slowing closes (flow problem)\n3. **A rule conflict in CPQ** is creating inconsistent outcomes (logic problem)",
                },
                {
                    id: 'd3',
                    agentSpecialty: 'System',
                    agentName: 'Orchestration Pilot',
                    message: "Where do you want to start?",
                    actions: [
                        { label: 'Fix contract ↔ billing mismatch', icon: Zap, primary: true },
                        { label: 'Unstick approvals' },
                        { label: 'Resolve CPQ rule conflict' },
                        { label: 'Show proof first' },
                        { label: 'Fastest win' },
                        { label: 'Why this order?' }
                    ]
                }
            ];
        }
        if (pathname.includes('/rules')) {
            return [
                {
                    id: 'r1',
                    agentSpecialty: 'Billing',
                    agentName: 'Logic Sentinel',
                    reasoning: [
                        'Reviewing legacy logic clusters (90d+ inactive)',
                        'Simulating rule prune impact on engine load',
                        'Verifying regional overlap in APAC corridors'
                    ],
                    message: "Rules analysis finalized. I've identified **14 legacy rules** in APAC that haven't triggered this quarter. Retiring these would increase engine performance by **8.2%**.",
                    actions: [{ label: 'Prune Logic', icon: Bug, primary: true }, { label: 'Audit Trace' }]
                }
            ];
        }
        if (pathname.includes('/work-queue')) {
            return [
                {
                    id: 'q1',
                    agentSpecialty: 'Orders',
                    agentName: 'Queue Guardian',
                    thinking: 'Triaging operational queue...',
                    reasoning: [
                        'Triaging 31 open operational issues',
                        'Identifying root cause for Contracts bottleneck',
                        'Flagging SLA breaches in CPQ queue'
                    ],
                    message: "Issues Inbox analysis complete. There are **31 active items**. I've identified a recurring pattern of **payment term overrides** in the Contracts stage causing a cumulative delay of **42 hours** per cycle.",
                    actions: [{ label: 'Prioritize Tickets', icon: Zap, primary: true }, { label: 'View Root Cause' }]
                }
            ];
        }
        if (pathname.includes('/lab')) {
            return [
                {
                    id: 'l1',
                    agentSpecialty: 'System',
                    agentName: 'Efficiency Pilot',
                    thinking: 'Modeling efficiency gains...',
                    reasoning: [
                        'Modeling net revenue efficiency (84.2%)',
                        'Simulating auto-remediation impact on ARR',
                        'Optimizing multi-tier approval logic'
                    ],
                    message: "Optimization Lab is active. Current efficiency is **84.2%**. My simulations suggest that enabling **autonomous contract reconciliation** could recover **$14.2k monthly**.",
                    actions: [{ label: 'Run Full Simulation', icon: TrendingUp, primary: true }, { label: 'Deploy Heuristic' }]
                }
            ];
        }
        if (pathname.includes('/stage/')) {
            const stage = pathname.split('/').pop();
            return [
                {
                    id: 's1',
                    agentSpecialty: stage || 'CPQ',
                    agentName: `${stage} Monitor`,
                    thinking: `Optimizing ${stage} throughput...`,
                    message: `Telemetry for **${stage}** indicates stable throughput, however **SLA cycle times** are trending upward. Recommendation: Apply a heuristic routing bypass for secondary approvals.`,
                    actions: [{ label: 'Simulate Workflow', icon: TrendingUp, primary: true }]
                }
            ];
        }
        return [];
    }, [pathname]);

    useEffect(() => {
        setVisibleSteps(0);
        setCompletedSteps(new Set());
        setExtraSteps([]);
        // Start script
        if (currentScript.length > 0) {
            setVisibleSteps(1);
        }
    }, [pathname, currentScript.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [visibleSteps, isTyping, completedSteps]);

    const handleStepComplete = React.useCallback((id: string) => {
        setCompletedSteps(prev => {
            if (prev.has(id)) return prev;

            // Advance next step after delay
            setTimeout(() => {
                setVisibleSteps(v => Math.min(v + 1, currentScript.length));
            }, 800);

            const next = new Set(prev);
            next.add(id);
            return next;
        });
    }, [currentScript.length]);

    const handleAction = (label: string) => {
        if (label === 'Why this order?') {
            const whyOrderStep: ChatStep = {
                id: 'why-order',
                agentSpecialty: 'System',
                agentName: 'Orchestration Pilot',
                message: "I ranked these by customer impact, how much it blocks downstream work, and time-to-fix.\n\n**Mismatch** can turn into disputes and delayed billing\n\n**Approvals backlog** slows deals today\n\n**CPQ conflict** creates rework and mixed outcomes",
                actions: [
                    { label: 'Fix contract ↔ billing mismatch', icon: Zap, primary: true },
                    { label: 'Unstick approvals' },
                    { label: 'Resolve CPQ rule conflict' }
                ]
            };
            setExtraSteps([whyOrderStep]);
        }
    };

    return (
        <div className="w-[400px] h-full flex flex-col bg-slate-50/80 border-l border-slate-200/60 relative overflow-hidden font-sans">
            {/* Header */}
            <div className={cn(
                "px-6 py-5 transition-all duration-300 border-b",
                scrolled ? "bg-white border-slate-200 shadow-sm z-10" : "bg-transparent border-transparent"
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Intelligence Layer</h3>
                            <div className="flex items-center gap-2.5">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                                <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                                    Pilot Guide
                                    <Sparkles className="h-3 w-3 text-google-blue" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-slate-200/50 rounded-lg p-1 border border-slate-200/50">
                        {['Feed', 'Logs'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all",
                                    activeTab === tab
                                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                                        : "text-slate-500 hover:text-slate-800 font-semibold"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 pt-6 pb-40 no-scrollbar scroll-smooth space-y-8"
                onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 10)}
            >
                <AnimatePresence mode="popLayout">
                    {activeTab === 'Feed' ? (
                        <motion.div key="feed" className="space-y-8">
                            {([...currentScript.slice(0, visibleSteps), ...extraSteps]).map((step, idx) => {
                                const isLatest = idx === (visibleSteps + extraSteps.length) - 1;

                                return (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3.5"
                                    >
                                        <div className="flex flex-col items-center">
                                            <AgentAvatar specialty={step.agentSpecialty} />
                                            {idx < visibleSteps - 1 && (
                                                <div className="w-[1.5px] flex-1 bg-slate-200/60 my-2 rounded-full" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 pb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.agentName}</span>
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest px-2 py-0.5 border border-slate-200 rounded-full">{step.agentSpecialty}</span>
                                            </div>

                                            {/* Reasoning Block */}
                                            {step.reasoning && (
                                                <ReasoningBlock steps={step.reasoning} active={!completedSteps.has(step.id)} />
                                            )}

                                            {/* Thinking State */}
                                            {isLatest && !completedSteps.has(step.id) && step.thinking && (
                                                <div className="flex items-center gap-2.5 text-[10px] text-blue-600 font-bold mb-3 animate-pulse px-1">
                                                    <Loader2 className="h-3 w-3 animate-spin stroke-[3px]" />
                                                    {step.thinking}
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <div className={cn(
                                                "p-4 rounded-2xl text-[13px] leading-relaxed border shadow-[0_1px_3px_rgba(0,0,0,0.02)] bg-white border-slate-100 text-slate-700 font-medium"
                                            )}>
                                                <TypewriterText
                                                    text={step.message}
                                                    onComplete={() => handleStepComplete(step.id)}
                                                />
                                            </div>

                                            {/* Actions - suggested replies style */}
                                            {completedSteps.has(step.id) && step.actions && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex flex-wrap gap-2 mt-4"
                                                >
                                                    {step.actions.map((action, ai) => (
                                                        <button
                                                            key={ai}
                                                            onClick={() => handleAction(action.label)}
                                                            className={cn(
                                                                "px-3 py-2 rounded-xl text-[10px] font-bold tracking-tight flex items-center gap-2 transition-all hover:translate-y-[-1px] active:translate-y-[0px] shadow-sm border",
                                                                action.primary
                                                                    ? "bg-google-blue text-white border-google-blue/10 hover:shadow-blue-200/50"
                                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                            )}
                                                        >
                                                            {action.icon && <action.icon size={12} strokeWidth={2.5} />}
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="logs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4 font-mono"
                        >
                            {[
                                { t: '13:06:01', tag: 'SCAN', msg: 'Operational sync complete.' },
                                { t: '13:06:05', tag: 'DETECT', msg: 'Payment variance found in Asia-Pacific.' },
                                { t: '13:06:12', tag: 'MODEL', msg: 'Simulating mitigation strategies...' }
                            ].map((l, i) => (
                                <div key={i} className="text-[10px] flex gap-3 p-3 bg-slate-100/50 rounded-lg border border-slate-200/40">
                                    <span className="text-slate-400 font-bold">{l.t}</span>
                                    <span className="text-blue-600 font-black">[{l.tag}]</span>
                                    <span className="text-slate-600 font-semibold">{l.msg}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sticky Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pt-12 border-t border-slate-200/40">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/30 p-2 flex items-center gap-2 group transition-all focus-within:ring-4 focus-within:ring-google-blue/5 focus-within:border-google-blue/20">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0 group-focus-within:text-google-blue group-focus-within:bg-blue-50 transition-colors">
                        <Terminal size={14} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Inquire with Pilot..."
                        className="bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none flex-1 px-1"
                    />
                    <button className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-black shadow-lg shadow-slate-900/10 transition-all active:scale-95 group-focus-within:bg-google-blue">
                        <Send size={14} strokeWidth={2.5} />
                    </button>
                </div>
                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4 opacity-60">Pilot v2.4.2 • Enterprise Logic Engine</p>
            </div>
        </div>
    );
}
