"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    HelpCircle,
    Search,
    GitBranch,
    Layers,
    Database,
    FileText,
    CheckCircle2,
    AlertTriangle,
    ArrowDown,
    Zap,
    ShieldCheck,
    CreditCard,
    PackageCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LifecycleStage } from '@/context/EngineContext';

interface LogicDiagramProps {
    selectedArea: LifecycleStage | 'All';
}

// Area-specific node configurations
const areaConfigs: Record<string, { title: string; nodes: { id: string; label: string; icon: any; type: 'primary' | 'secondary' | 'tertiary' }[]; sidePanels: { side: 'left' | 'right'; title: string; items: string[] }[] }> = {
    All: {
        title: 'Revenue Logic Flow',
        nodes: [
            { id: 'input', label: 'Transaction Input', icon: HelpCircle, type: 'primary' },
            { id: 'validation', label: 'Validation Engine', icon: ShieldCheck, type: 'secondary' },
            { id: 'routing', label: 'Logic Routing', icon: GitBranch, type: 'primary' },
            { id: 'processing', label: 'Rule Processing', icon: Layers, type: 'secondary' },
            { id: 'approval', label: 'Approval Gate', icon: CheckCircle2, type: 'tertiary' },
            { id: 'output', label: 'Action Output', icon: Zap, type: 'primary' },
        ],
        sidePanels: [
            { side: 'left', title: 'Validation Types', items: ['Schema Check', 'Business Rules', 'Compliance', 'Threshold Limits'] },
            { side: 'right', title: 'Output Actions', items: ['Auto-Approve', 'Escalate', 'Hold', 'Reject'] },
        ]
    },
    Catalog: {
        title: 'Catalog Logic Flow',
        nodes: [
            { id: 'product', label: 'Product Request', icon: HelpCircle, type: 'primary' },
            { id: 'lookup', label: 'SKU Lookup', icon: Search, type: 'secondary' },
            { id: 'pricing', label: 'Price Engine', icon: Layers, type: 'primary' },
            { id: 'availability', label: 'Availability Check', icon: Database, type: 'secondary' },
            { id: 'bundle', label: 'Bundle Rules', icon: GitBranch, type: 'tertiary' },
            { id: 'output', label: 'Quote Ready', icon: CheckCircle2, type: 'primary' },
        ],
        sidePanels: [
            { side: 'left', title: 'Price Rules', items: ['List Price', 'Volume Discount', 'Partner Tier', 'Promo Codes'] },
            { side: 'right', title: 'Bundle Types', items: ['Required Add-ons', 'Optional Upgrades', 'Cross-sell', 'Upsell'] },
        ]
    },
    CPQ: {
        title: 'CPQ Logic Flow',
        nodes: [
            { id: 'quote', label: 'Quote Request', icon: HelpCircle, type: 'primary' },
            { id: 'config', label: 'Configuration', icon: Layers, type: 'secondary' },
            { id: 'pricing', label: 'Pricing Engine', icon: Database, type: 'primary' },
            { id: 'discount', label: 'Discount Approval', icon: GitBranch, type: 'secondary' },
            { id: 'margin', label: 'Margin Check', icon: AlertTriangle, type: 'tertiary' },
            { id: 'output', label: 'Quote Generated', icon: FileText, type: 'primary' },
        ],
        sidePanels: [
            { side: 'left', title: 'Discount Thresholds', items: ['0-15%: Auto', '15-25%: Manager', '25-35%: Director', '35%+: VP'] },
            { side: 'right', title: 'Margin Guards', items: ['Min 40% GM', 'Deal Desk Alert', 'Finance Review', 'Exception Log'] },
        ]
    },
    Contracts: {
        title: 'Contracts Logic Flow',
        nodes: [
            { id: 'request', label: 'Contract Request', icon: HelpCircle, type: 'primary' },
            { id: 'template', label: 'Template Selection', icon: FileText, type: 'secondary' },
            { id: 'terms', label: 'Terms Engine', icon: ShieldCheck, type: 'primary' },
            { id: 'legal', label: 'Legal Review', icon: GitBranch, type: 'secondary' },
            { id: 'signature', label: 'Signature Flow', icon: CheckCircle2, type: 'tertiary' },
            { id: 'output', label: 'Contract Active', icon: Zap, type: 'primary' },
        ],
        sidePanels: [
            { side: 'left', title: 'Term Rules', items: ['Payment Net30', 'Auto-Renewal', 'SLA Terms', 'Liability Cap'] },
            { side: 'right', title: 'Signature Types', items: ['DocuSign', 'Manual Sign', 'Verbal Auth', 'PO Reference'] },
        ]
    },
    Orders: {
        title: 'Orders Logic Flow',
        nodes: [
            { id: 'order', label: 'Order Received', icon: HelpCircle, type: 'primary' },
            { id: 'validation', label: 'Order Validation', icon: ShieldCheck, type: 'secondary' },
            { id: 'fulfillment', label: 'Fulfillment Rules', icon: PackageCheck, type: 'primary' },
            { id: 'inventory', label: 'Inventory Check', icon: Database, type: 'secondary' },
            { id: 'shipping', label: 'Shipping Logic', icon: GitBranch, type: 'tertiary' },
            { id: 'output', label: 'Order Complete', icon: CheckCircle2, type: 'primary' },
        ],
        sidePanels: [
            { side: 'left', title: 'Validation Rules', items: ['Credit Check', 'Stock Verify', 'Address Valid', 'Tax Calc'] },
            { side: 'right', title: 'Fulfillment', items: ['Direct Ship', 'Warehouse', 'Drop Ship', 'Backorder'] },
        ]
    },
    Assets: {
        title: 'Assets Logic Flow',
        nodes: [
            { id: 'asset', label: 'Asset Event', icon: HelpCircle, type: 'primary' },
            { id: 'lookup', label: 'Asset Lookup', icon: Search, type: 'secondary' },
            { id: 'lifecycle', label: 'Lifecycle Rules', icon: GitBranch, type: 'primary' },
            { id: 'usage', label: 'Usage Tracking', icon: Database, type: 'secondary' },
            { id: 'renewal', label: 'Renewal Engine', icon: Layers, type: 'tertiary' },
            { id: 'output', label: 'Asset Updated', icon: CheckCircle2, type: 'primary' },
        ],
        sidePanels: [
            { side: 'left', title: 'Lifecycle Events', items: ['Provisioning', 'Activation', 'Modification', 'Termination'] },
            { side: 'right', title: 'Renewal Rules', items: ['Auto-Renew', 'Uplift %', 'Notice Period', 'Downgrade'] },
        ]
    },
    Billing: {
        title: 'Billing Logic Flow',
        nodes: [
            { id: 'trigger', label: 'Billing Trigger', icon: HelpCircle, type: 'primary' },
            { id: 'usage', label: 'Usage Aggregation', icon: Database, type: 'secondary' },
            { id: 'rating', label: 'Rating Engine', icon: Layers, type: 'primary' },
            { id: 'invoice', label: 'Invoice Generation', icon: FileText, type: 'secondary' },
            { id: 'collection', label: 'Collection Rules', icon: CreditCard, type: 'tertiary' },
            { id: 'output', label: 'Payment Posted', icon: CheckCircle2, type: 'primary' },
        ],
        sidePanels: [
            { side: 'left', title: 'Rating Types', items: ['Flat Rate', 'Per Unit', 'Tiered', 'Overage'] },
            { side: 'right', title: 'Collection', items: ['Auto-Charge', 'Invoice', 'Dunning', 'Write-off'] },
        ]
    },
};

export function LogicDiagram({ selectedArea }: LogicDiagramProps) {
    const config = areaConfigs[selectedArea] || areaConfigs.All;

    return (
        <div className="bg-slate-950 rounded-[2.5rem] p-10 min-h-[600px] relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, #4285F4 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }} />
            </div>

            {/* Title */}
            <div className="text-center mb-12 relative z-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">{config.title}</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Logic Pipeline Visualization</p>
            </div>

            <div className="relative z-10 flex justify-center items-start gap-16">
                {/* Left Side Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-64 shrink-0"
                >
                    {config.sidePanels.filter(p => p.side === 'left').map((panel, idx) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-[11px] font-black text-google-blue uppercase tracking-widest mb-4">{panel.title}</h3>
                            <div className="space-y-3">
                                {panel.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[11px] font-semibold text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-google-blue" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                            {/* Connector line */}
                            <div className="absolute right-0 top-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-slate-600 -translate-y-1/2 opacity-50" style={{ right: '-48px' }} />
                        </div>
                    ))}
                </motion.div>

                {/* Central Flow */}
                <div className="flex flex-col items-center gap-2">
                    {config.nodes.map((node, idx) => {
                        const Icon = node.icon;
                        return (
                            <React.Fragment key={node.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={cn(
                                        "relative group cursor-pointer",
                                        node.type === 'primary' ? "z-20" : "z-10"
                                    )}
                                >
                                    {/* Node Circle */}
                                    <div className={cn(
                                        "rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110",
                                        node.type === 'primary'
                                            ? "h-20 w-20 bg-gradient-to-br from-google-blue/20 to-google-blue/5 border-google-blue shadow-[0_0_30px_rgba(66,133,244,0.3)]"
                                            : node.type === 'secondary'
                                                ? "h-16 w-16 bg-slate-900 border-slate-600 group-hover:border-google-blue/50"
                                                : "h-14 w-14 bg-slate-800 border-slate-700 group-hover:border-google-blue/50"
                                    )}>
                                        <Icon className={cn(
                                            "transition-colors",
                                            node.type === 'primary'
                                                ? "h-8 w-8 text-google-blue"
                                                : "h-6 w-6 text-slate-400 group-hover:text-google-blue"
                                        )} />

                                        {/* Active indicator */}
                                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                                    </div>

                                    {/* Label */}
                                    <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 whitespace-nowrap">
                                        <p className={cn(
                                            "font-black uppercase tracking-tight",
                                            node.type === 'primary'
                                                ? "text-sm text-white"
                                                : "text-xs text-slate-400"
                                        )}>{node.label}</p>
                                    </div>
                                </motion.div>

                                {/* Connector Line */}
                                {idx < config.nodes.length - 1 && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 32 }}
                                        transition={{ delay: idx * 0.1 + 0.05 }}
                                        className="w-0.5 bg-gradient-to-b from-google-blue/60 to-google-blue/20 relative"
                                    >
                                        {/* Flow indicator */}
                                        <motion.div
                                            animate={{ y: [0, 24, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                                            className="absolute w-2 h-2 bg-google-blue rounded-full -left-[3px] shadow-[0_0_10px_rgba(66,133,244,0.8)]"
                                        />
                                    </motion.div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Right Side Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-64 shrink-0"
                >
                    {config.sidePanels.filter(p => p.side === 'right').map((panel, idx) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm relative">
                            <h3 className="text-[11px] font-black text-google-blue uppercase tracking-widest mb-4">{panel.title}</h3>
                            <div className="space-y-3">
                                {panel.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[11px] font-semibold text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-12 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-google-blue shadow-[0_0_10px_rgba(66,133,244,0.5)]" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-600 border border-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Processing Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
                </div>
            </div>
        </div>
    );
}
