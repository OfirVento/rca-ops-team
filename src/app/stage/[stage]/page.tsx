import { StageDashboardClient } from '@/components/layout/StageDashboardClient';
import { LifecycleStage } from '@/context/EngineContext';

export function generateStaticParams() {
    return [
        { stage: 'Catalog' },
        { stage: 'CPQ' },
        { stage: 'Contracts' },
        { stage: 'Orders' },
        { stage: 'Assets' },
        { stage: 'Billing' },
    ];
}

interface PageProps {
    params: Promise<{ stage: string }>;
}

export default async function Page({ params }: PageProps) {
    const { stage } = await params;
    return <StageDashboardClient stageName={stage as LifecycleStage} />;
}
