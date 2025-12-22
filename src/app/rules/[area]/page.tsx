import { AreaRuleSetsClient } from '@/components/layout/AreaRuleSetsClient';

export function generateStaticParams() {
    return [
        { area: 'All' },
        { area: 'Catalog' },
        { area: 'CPQ' },
        { area: 'Contracts' },
        { area: 'Orders' },
        { area: 'Assets' },
        { area: 'Billing' },
    ];
}

interface PageProps {
    params: Promise<{ area: string }>;
}

export default async function Page({ params }: PageProps) {
    const { area } = await params;
    return <AreaRuleSetsClient area={area} />;
}
