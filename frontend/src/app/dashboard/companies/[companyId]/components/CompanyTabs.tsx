interface CompanyTabsProps {
    activeTab: 'overview' | 'experiences' | 'questions' | 'salary';
    onTabChange: (tab: 'overview' | 'experiences' | 'questions' | 'salary') => void;
}

export default function CompanyTabs({ activeTab, onTabChange }: CompanyTabsProps) {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'experiences', label: 'Experiences' },
        { id: 'questions', label: 'Questions' },
        { id: 'salary', label: 'Salary Insights' },
    ] as const;

    return (
        <div className="border-b border-white/10">
            <nav className="flex gap-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`pb-4 px-2 font-medium transition-all relative ${
                            activeTab === tab.id
                                ? 'text-primary'
                                : 'text-white/60 hover:text-white'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}
