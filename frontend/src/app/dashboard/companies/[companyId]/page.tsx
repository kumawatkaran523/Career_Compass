// app/dashboard/companies/[companyId]/page.tsx
'use client';

import { useState } from 'react';
import { Building2, MapPin, Users, Globe, Star, TrendingUp, ArrowRight, GraduationCap, Calendar, CheckCircle, XCircle, Clock, ThumbsUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const mockCompanyData = {
    company: {
        id: 'tcs',
        name: 'Tata Consultancy Services',
        logo: 'https://logo.clearbit.com/tcs.com',
        industry: 'IT Services',
        website: 'https://www.tcs.com',
        description: 'TCS is an IT services, consulting, and business solutions organization that has been partnering with many of the world\'s largest businesses in their transformation journeys for over 50 years.',
        headquarters: 'Mumbai, India',
        employeeCount: '500,000+',
    },
    collegeInsights: {
        totalExperiences: 12,
        avgDifficulty: 'MEDIUM',
        avgRating: 4.1,
        avgSalary: 3.8,
        successRate: 35.7,
        lastVisit: '2024-08-15',
        commonRoles: ['SDE', 'Business Analyst'],
        difficultyDistribution: { EASY: 2, MEDIUM: 7, HARD: 3 },
        outcomeDistribution: { SELECTED: 5, REJECTED: 6, WAITING: 1 },
    },
    globalInsights: {
        totalExperiences: 234,
        avgDifficulty: 'MEDIUM',
        avgRating: 4.3,
        avgSalary: 4.2,
    },
    visitHistory: [
        {
            year: 2025,
            visited: true,
            status: 'upcoming',
            visitDate: '2025-12-15',
            roles: ['SDE', 'Analyst'],
            studentsPlaced: null,
            ctcRange: '3.5-7 LPA'
        },
        {
            year: 2024,
            visited: true,
            status: 'completed',
            visitDate: '2024-08-15',
            roles: ['SDE', 'Business Analyst'],
            studentsPlaced: 12,
            ctcRange: '3.6-6.5 LPA'
        },
        {
            year: 2023,
            visited: true,
            status: 'completed',
            visitDate: '2023-09-10',
            roles: ['SDE', 'Consultant'],
            studentsPlaced: 15,
            ctcRange: '3.5-6 LPA'
        },
        {
            year: 2022,
            visited: false,
            status: 'skipped',
            reason: 'Not visited'
        },
        {
            year: 2021,
            visited: true,
            status: 'completed',
            visitDate: '2021-08-20',
            roles: ['Developer'],
            studentsPlaced: 10,
            ctcRange: '3.2-5.5 LPA'
        },
        {
            year: 2020,
            visited: false,
            status: 'skipped',
            reason: 'COVID-19 Pandemic'
        },
        {
            year: 2019,
            visited: true,
            status: 'completed',
            visitDate: '2019-07-15',
            roles: ['SDE'],
            studentsPlaced: 8,
            ctcRange: '3.0-5 LPA'
        },
        {
            year: 2018,
            visited: true,
            status: 'completed',
            visitDate: '2018-08-10',
            roles: ['Developer'],
            studentsPlaced: 6,
            ctcRange: '2.8-4.5 LPA'
        },
        {
            year: 2017,
            visited: true,
            status: 'completed',
            visitDate: '2017-09-05',
            roles: ['SDE'],
            studentsPlaced: 7,
            ctcRange: '2.5-4 LPA'
        },
    ],
};

export default function CompanyDetailPage({ params }: { params: { companyId: string } }) {
    const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'questions' | 'history' | 'salary'>('overview');
    const { company, collegeInsights, globalInsights, visitHistory } = mockCompanyData;

    return (
        <div className="space-y-8">
            {/* Company Header */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-contain p-2"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                        <p className="text-white/60 mb-4">{company.industry}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-white/70">
                                <MapPin className="w-4 h-4" />
                                {company.headquarters}
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Users className="w-4 h-4" />
                                {company.employeeCount}
                            </div>
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline"
                            >
                                <Globe className="w-4 h-4" />
                                Visit Website
                            </a>
                        </div>
                    </div>

                    <Link
                        href={`/dashboard/companies/${company.id}/add-experience`}
                        className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        Share Experience
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10">
                <nav className="flex gap-8">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'experiences', label: 'Experiences' },
                        { id: 'questions', label: 'Questions' },
                        { id: 'history', label: 'Visit History' },
                        { id: 'salary', label: 'Salary Insights' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 px-2 font-medium transition-all relative ${activeTab === tab.id
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

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <OverviewTab collegeInsights={collegeInsights} globalInsights={globalInsights} company={company} />
            )}
            {activeTab === 'experiences' && <ExperiencesTab companyId={company.id} />}
            {activeTab === 'questions' && <QuestionsTab companyId={company.id} />}
            {activeTab === 'history' && <VisitHistoryTab visitHistory={visitHistory} companyName={company.name} />}
            {activeTab === 'salary' && <SalaryTab collegeInsights={collegeInsights} />}
        </div>
    );
}

// Overview Tab
function OverviewTab({ collegeInsights, globalInsights, company }: any) {
    return (
        <div className="space-y-8">
            {/* College Insights */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Insights from Your College</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Avg Difficulty"
                        value={collegeInsights.avgDifficulty}
                        color="text-yellow-400"
                    />
                    <StatCard
                        label="Success Rate"
                        value={`${collegeInsights.successRate}%`}
                        color="text-green-400"
                    />
                    <StatCard
                        label="Avg Rating"
                        value={collegeInsights.avgRating}
                        icon={<Star className="w-5 h-5" />}
                        color="text-yellow-400"
                    />
                    <StatCard
                        label="Avg Salary"
                        value={`₹${collegeInsights.avgSalary} LPA`}
                        color="text-primary"
                    />
                </div>

                <div className="mt-6 pt-6 border-t border-primary/20">
                    <p className="text-white/70 mb-2">
                        <strong className="text-white">Last Visit:</strong> {new Date(collegeInsights.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-white/70">
                        <strong className="text-white">Common Roles:</strong>{' '}
                        {collegeInsights.commonRoles.join(', ')}
                    </p>
                </div>
            </div>

            {/* Global Insights */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Global Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Experiences"
                        value={globalInsights.totalExperiences}
                        color="text-white"
                    />
                    <StatCard
                        label="Avg Difficulty"
                        value={globalInsights.avgDifficulty}
                        color="text-yellow-400"
                    />
                    <StatCard
                        label="Avg Rating"
                        value={globalInsights.avgRating}
                        color="text-yellow-400"
                    />
                    <StatCard
                        label="Avg Salary"
                        value={`₹${globalInsights.avgSalary} LPA`}
                        color="text-primary"
                    />
                </div>
            </div>

            {/* Company Description */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
                <p className="text-white/70 leading-relaxed">{company.description}</p>
            </div>

            {/* Recent Experiences Preview */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Recent Experiences from Your College</h2>
                    <button className="text-primary hover:underline text-sm">View All</button>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <p className="text-white/60 text-sm">Loading experiences...</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Experiences Tab
function ExperiencesTab({ companyId }: { companyId: string }) {
    const [filterScope, setFilterScope] = useState<'college' | 'global'>('college');

    const mockExperiences = [
        {
            id: '1',
            role: 'SDE',
            outcome: 'SELECTED',
            interviewDate: '2024-08-10',
            overallDifficulty: 'MEDIUM',
            overallRating: 4.5,
            reviewTitle: 'Smooth interview process with focus on DSA',
            reviewSnippet: 'The interview process was well-structured with three rounds. First round was an online coding test followed by technical and HR rounds...',
            salaryOffered: 3.6,
            user: { name: 'Anunay Tiwari', branch: 'CSE', graduationYear: 2022 },
            college: { name: 'JK Lakshmipat University' },
            upvotes: 15,
            isCollege: true,
        },
        {
            id: '2',
            role: 'Business Analyst',
            outcome: 'SELECTED',
            interviewDate: '2024-08-12',
            overallDifficulty: 'EASY',
            overallRating: 4.0,
            reviewTitle: 'Good experience, HR round was important',
            reviewSnippet: 'Overall good experience. They focused more on communication skills and problem-solving approach rather than just technical knowledge...',
            salaryOffered: 3.5,
            user: { name: 'Rahul Yadav', branch: 'CSE', graduationYear: 2022 },
            college: { name: 'JK Lakshmipat University' },
            upvotes: 12,
            isCollege: true,
        },
        {
            id: '3',
            role: 'SDE',
            outcome: 'REJECTED',
            interviewDate: '2024-08-11',
            overallDifficulty: 'HARD',
            overallRating: 3.5,
            reviewTitle: 'Challenging technical round',
            reviewSnippet: 'The technical round was quite challenging with complex DSA questions. Make sure to practice hard problems...',
            salaryOffered: null,
            user: { name: 'Anonymous', branch: 'ECE', graduationYear: 2023 },
            college: { name: 'JK Lakshmipat University' },
            upvotes: 8,
            isCollege: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setFilterScope('college')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${filterScope === 'college'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    Your College ({mockExperiences.filter(e => e.isCollege).length})
                </button>
                <button
                    onClick={() => setFilterScope('global')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${filterScope === 'global'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    All Colleges (234)
                </button>
            </div>

            {/* Experience Cards */}
            <div className="space-y-4">
                {mockExperiences.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                ))}
            </div>

            {/* Load More */}
            <div className="text-center">
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all">
                    Load More Experiences
                </button>
            </div>
        </div>
    );
}

// Questions Tab
function QuestionsTab({ companyId }: { companyId: string }) {
    const mockQuestions = [
        {
            id: '1',
            questionText: 'Implement LRU Cache with O(1) time complexity',
            questionType: 'CODING',
            difficulty: 'HARD',
            round: 'Round 2 - Technical',
            topic: 'Data Structures',
            askedCount: 8,
            upvotes: 25,
            isCollege: true,
        },
        {
            id: '2',
            questionText: 'Find the longest substring without repeating characters',
            questionType: 'CODING',
            difficulty: 'MEDIUM',
            round: 'Round 1 - Online Test',
            topic: 'Strings',
            askedCount: 12,
            upvotes: 32,
            isCollege: true,
        },
        {
            id: '3',
            questionText: 'Explain the difference between TCP and UDP',
            questionType: 'TECHNICAL',
            difficulty: 'EASY',
            round: 'Round 2 - Technical',
            topic: 'Computer Networks',
            askedCount: 15,
            upvotes: 18,
            isCollege: true,
        },
        {
            id: '4',
            questionText: 'Design a URL shortening service like bit.ly',
            questionType: 'SYSTEM_DESIGN',
            difficulty: 'HARD',
            round: 'Round 2 - Technical',
            topic: 'System Design',
            askedCount: 5,
            upvotes: 28,
            isCollege: true,
        },
        {
            id: '5',
            questionText: 'Tell me about a time you faced a conflict in a team',
            questionType: 'BEHAVIORAL',
            difficulty: 'MEDIUM',
            round: 'Round 3 - HR',
            topic: 'Behavioral',
            askedCount: 20,
            upvotes: 15,
            isCollege: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Filter Options */}
            <div className="flex items-center gap-4 flex-wrap">
                <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50">
                    <option value="all">All Types</option>
                    <option value="CODING">Coding</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                    <option value="SYSTEM_DESIGN">System Design</option>
                </select>

                <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50">
                    <option value="all">All Difficulties</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>

                <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50">
                    <option value="all">All Rounds</option>
                    <option value="1">Round 1</option>
                    <option value="2">Round 2</option>
                    <option value="3">Round 3</option>
                </select>
            </div>

            {/* College Questions */}
            <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Questions from Your College
                </h3>
                <div className="space-y-3">
                    {mockQuestions.map((q) => (
                        <QuestionCard key={q.id} question={q} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Visit History Tab
function VisitHistoryTab({ visitHistory, companyName }: { visitHistory: any[]; companyName: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Placement Visit History at Your College</h2>
                </div>
                <p className="text-white/60">
                    Year-wise timeline showing when {companyName} visited your college for campus placements
                </p>
            </div>

            {/* Timeline */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {visitHistory.map((visit) => {
                            const isUpcoming = visit.status === 'upcoming';
                            const isCurrent = visit.year === currentYear;
                            const isVisited = visit.visited;

                            return (
                                <div
                                    key={visit.year}
                                    className={`
                                        relative px-6 py-3 rounded-lg font-semibold text-lg transition-all cursor-pointer
                                        ${isVisited
                                            ? isUpcoming
                                                ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50'
                                                : 'bg-primary/20 text-primary border-2 border-primary/50'
                                            : 'bg-white/5 text-white/40 border-2 border-white/10'
                                        }
                                        ${isCurrent ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black' : ''}
                                        hover:scale-105 hover:shadow-lg
                                    `}
                                >
                                    {visit.year}
                                    {isVisited && (
                                        <div className="absolute -top-2 -right-2">
                                            {isUpcoming ? (
                                                <Clock className="w-5 h-5 text-blue-400 bg-black rounded-full p-0.5" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-primary bg-black rounded-full" />
                                            )}
                                        </div>
                                    )}
                                    {!isVisited && (
                                        <div className="absolute -top-2 -right-2">
                                            <XCircle className="w-5 h-5 text-white/40 bg-black rounded-full" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 text-sm border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary/20 border-2 border-primary/50 rounded"></div>
                            <span className="text-white/70">Visited & Placed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500/20 border-2 border-blue-500/50 rounded"></div>
                            <span className="text-white/70">Upcoming Visit</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white/5 border-2 border-white/10 rounded"></div>
                            <span className="text-white/70">Not Visited</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-400 rounded ring-2 ring-yellow-400"></div>
                            <span className="text-white/70">Current Year</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Visit Cards */}
            <div>
                <h3 className="text-xl font-bold mb-4">Detailed Visit Information</h3>
                <div className="space-y-4">
                    {visitHistory.filter(v => v.visited).map((visit) => (
                        <VisitCard key={visit.year} visit={visit} />
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <p className="text-white/60 text-sm mb-2">Total Visits</p>
                    <p className="text-3xl font-bold text-primary">
                        {visitHistory.filter(v => v.visited && v.status === 'completed').length}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                        out of {visitHistory.length} years
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <p className="text-white/60 text-sm mb-2">Total Students Placed</p>
                    <p className="text-3xl font-bold text-primary">
                        {visitHistory
                            .filter(v => v.studentsPlaced)
                            .reduce((sum, v) => sum + v.studentsPlaced, 0)}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                        across all visits
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <p className="text-white/60 text-sm mb-2">Avg Placements/Year</p>
                    <p className="text-3xl font-bold text-primary">
                        {(visitHistory
                            .filter(v => v.studentsPlaced)
                            .reduce((sum, v) => sum + v.studentsPlaced, 0) /
                            visitHistory.filter(v => v.studentsPlaced).length
                        ).toFixed(1)}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                        students per visit
                    </p>
                </div>
            </div>
        </div>
    );
}

// Salary Tab
function SalaryTab({ collegeInsights }: any) {
    return (
        <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">College-Specific Salary Data</h3>
                <p className="text-white/60 mb-6">Detailed salary insights and trends for placements at your college</p>

                {/* Salary Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-black/20 rounded-lg p-4">
                        <p className="text-white/60 text-sm mb-2">Average CTC</p>
                        <p className="text-3xl font-bold text-primary">₹{collegeInsights.avgSalary} LPA</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                        <p className="text-white/60 text-sm mb-2">Minimum CTC</p>
                        <p className="text-3xl font-bold text-green-400">₹3.2 LPA</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                        <p className="text-white/60 text-sm mb-2">Maximum CTC</p>
                        <p className="text-3xl font-bold text-yellow-400">₹6.5 LPA</p>
                    </div>
                </div>

                {/* Role-wise breakdown */}
                <div>
                    <h4 className="font-bold mb-4">Role-wise Salary Distribution</h4>
                    <div className="space-y-3">
                        {[
                            { role: 'Software Developer', avg: 4.2, range: '3.5-6.5' },
                            { role: 'Business Analyst', avg: 3.8, range: '3.2-5' },
                            { role: 'Consultant', avg: 4.0, range: '3.5-5.5' },
                        ].map((item) => (
                            <div key={item.role} className="bg-black/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{item.role}</span>
                                    <span className="text-primary font-bold">₹{item.avg} LPA</span>
                                </div>
                                <p className="text-sm text-white/60">Range: ₹{item.range} LPA</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-black/20 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-1">{label}</p>
            <div className={`text-2xl font-bold ${color} flex items-center gap-2`}>
                {icon}
                {value}
            </div>
        </div>
    );
}

function ExperienceCard({ experience }: any) {
    return (
        <Link
            href={`/dashboard/experiences/${experience.id}`}
            className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{experience.reviewTitle}</h3>
                        {experience.isCollege && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                                Your College
                            </span>
                        )}
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                        {experience.user.name} • {experience.user.branch} • Batch {experience.user.graduationYear}
                    </p>
                    <p className="text-white/80 text-sm line-clamp-2">{experience.reviewSnippet}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium flex-shrink-0 ${experience.outcome === 'SELECTED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                >
                    {experience.outcome}
                </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/70 border-t border-white/10 pt-4">
                <div>Role: <span className="text-white font-medium">{experience.role}</span></div>
                <div>Difficulty: <span className="text-yellow-400">{experience.overallDifficulty}</span></div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {experience.overallRating}
                </div>
                {experience.salaryOffered && (
                    <div>Salary: <span className="text-primary">₹{experience.salaryOffered} LPA</span></div>
                )}
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {experience.upvotes}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function QuestionCard({ question }: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-medium mb-2">{question.questionText}</h4>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                        <span className={`px-2 py-0.5 rounded text-xs ${question.difficulty === 'HARD' ? 'bg-red-500/20 text-red-400' :
                                question.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-green-500/20 text-green-400'
                            }`}>
                            {question.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 rounded text-xs">{question.questionType}</span>
                        <span>{question.round}</span>
                        <span>{question.topic}</span>
                        <span>Asked {question.askedCount}x at your college</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-white/60 text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    {question.upvotes}
                </div>
            </div>
        </div>
    );
}

function VisitCard({ visit }: { visit: any }) {
    const isUpcoming = visit.status === 'upcoming';

    return (
        <div className={`bg-white/5 border rounded-xl p-6 ${isUpcoming ? 'border-blue-500/50' : 'border-white/10'
            }`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUpcoming ? 'bg-blue-500/20' : 'bg-primary/20'
                        }`}>
                        <span className="text-2xl font-bold">
                            {visit.year.toString().slice(2)}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold">{visit.year}</h4>
                        <p className="text-white/60 text-sm">
                            Visit Date: {new Date(visit.visitDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isUpcoming
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                    {isUpcoming ? 'Upcoming' : 'Completed'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-white/60 text-sm mb-1">Roles Offered</p>
                    <div className="flex flex-wrap gap-2">
                        {visit.roles.map((role: string) => (
                            <span key={role} className="px-2 py-1 bg-white/5 rounded text-sm">
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-white/60 text-sm mb-1">CTC Range</p>
                    <p className="font-medium text-primary">{visit.ctcRange}</p>
                </div>
                {visit.studentsPlaced && (
                    <div>
                        <p className="text-white/60 text-sm mb-1">Students Placed</p>
                        <p className="font-medium text-primary">{visit.studentsPlaced} students</p>
                    </div>
                )}
            </div>

            {!isUpcoming && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <Link
                        href={`/dashboard/companies/tcs/experiences?year=${visit.year}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        View {visit.year} Experiences
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
