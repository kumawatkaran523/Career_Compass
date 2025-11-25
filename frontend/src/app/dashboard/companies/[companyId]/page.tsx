// app/dashboard/companies/[companyId]/page.tsx
'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CompanyHeader from './components/CompanyHeader';
import CompanyTabs from './components/CompanyTabs';
import OverviewTab from './components/OverviewTab';
import ExperiencesTab from './components/ExperiencesTab';
import QuestionsTab from './components/QuestionsTab';
import SalaryTab from './components/SalaryTab';

interface Company {
    id: string;
    name: string;
    logo: string | null;
    website: string | null;
    industry: string;
    description: string | null;
    headquarters: string | null;
    employeeCount: string | null;
}

type TabType = 'overview' | 'experiences' | 'questions' | 'salary';

export default function CompanyDetailPage({ params }: { params: Promise<{ companyId: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resolvedParams = use(params);

    // Get tab from URL or default to 'overview'
    const tabFromUrl = (searchParams.get('tab') as TabType) || 'overview';
    const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies/${resolvedParams.companyId}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch company');
                }

                const data = await response.json();
                setCompany(data.data);
            } catch (error) {
                console.error('Error fetching company:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [resolvedParams.companyId]);

    // Update URL when tab changes
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        router.push(`/dashboard/companies/${resolvedParams.companyId}?tab=${tab}`, { scroll: false });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Company not found</h2>
                    <p className="text-white/60">The company you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <CompanyHeader
                company={company}
                companyId={resolvedParams.companyId}
            />

            <CompanyTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {activeTab === 'overview' && (
                <OverviewTab companyId={resolvedParams.companyId} />
            )}
            {activeTab === 'experiences' && (
                <ExperiencesTab companyId={resolvedParams.companyId} />
            )}
            {activeTab === 'questions' && (
                <QuestionsTab companyId={resolvedParams.companyId} />
            )}
            {activeTab === 'salary' && (
                <SalaryTab companyId={resolvedParams.companyId} />
            )}
        </div>
    );
}
