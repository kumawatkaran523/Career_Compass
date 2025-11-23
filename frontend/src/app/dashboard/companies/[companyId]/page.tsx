'use client';

import { useState } from 'react';
import { mockCompanyData } from './data/mockData';
import CompanyHeader from './components/CompanyHeader';
import CompanyTabs from './components/CompanyTabs';
import OverviewTab from './components/OverviewTab';
import ExperiencesTab from './components/ExperiencesTab';
import QuestionsTab from './components/QuestionsTab';
import SalaryTab from './components/SalaryTab';

export default function CompanyDetailPage({ params }: { params: { companyId: string } }) {
    const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'questions' | 'salary'>('overview');
    const { company, collegeInsights, globalInsights, visitHistory } = mockCompanyData;

    return (
        <div className="space-y-8">
            <CompanyHeader company={company} />
            
            <CompanyTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'overview' && (
                <OverviewTab 
                    collegeInsights={collegeInsights} 
                    globalInsights={globalInsights} 
                    company={company} 
                    visitHistory={visitHistory} 
                />
            )}
            {activeTab === 'experiences' && <ExperiencesTab companyId={company.id} />}
            {activeTab === 'questions' && <QuestionsTab companyId={company.id} />}
            {activeTab === 'salary' && <SalaryTab collegeInsights={collegeInsights} />}
        </div>
    );
}
