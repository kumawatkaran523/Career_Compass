'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Building2, Code, ExternalLink, CheckCircle2, Circle, ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import problemsData from '../../../data/problems-all.json';

export default function ProblemsPage() {
    const [selectedCompany, setSelectedCompany] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'frequency' | 'acceptance' | 'difficulty'>('frequency');
    const [currentPage, setCurrentPage] = useState(1);
    const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const ITEMS_PER_PAGE = 12;

    const { problems, companies: allCompanies, metadata } = problemsData;

    // Load solved problems from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('solvedProblems');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSolvedProblems(new Set(parsed));
            } catch (error) {
                console.error('Failed to parse solved problems:', error);
            }
        }
    }, []);

    // Toggle solved status
    const toggleSolved = (problemId: number) => {
        setSolvedProblems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(problemId)) {
                newSet.delete(problemId);
            } else {
                newSet.add(problemId);
            }
            // Save to localStorage
            localStorage.setItem('solvedProblems', JSON.stringify([...newSet]));
            return newSet;
        });
    };

    const companyCounts = useMemo(() => {
        const counts: Record<string, number> = { All: problems.length };
        problems.forEach((problem: any) => {
            problem.companies.forEach((company: string) => {
                counts[company] = (counts[company] || 0) + 1;
            });
        });
        return counts;
    }, [problems]);

    const solvedCounts = useMemo(() => {
        const solved = problems.filter((p: any) => solvedProblems.has(p.id)).length;
        const unsolved = problems.length - solved;
        return { solved, unsolved };
    }, [problems, solvedProblems]);

    const filteredProblems = useMemo(() => {
        let filtered = problems.filter((problem: any) => {
            const matchesCompany = selectedCompany === 'All' || problem.companies.includes(selectedCompany);
            const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
            const matchesSearch = searchQuery === '' ||
                problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                problem.id.toString().includes(searchQuery);

            const isSolved = solvedProblems.has(problem.id);
            const matchesStatus = selectedStatus === 'All' ||
                (selectedStatus === 'Solved' && isSolved) ||
                (selectedStatus === 'Unsolved' && !isSolved);

            return matchesCompany && matchesDifficulty && matchesSearch && matchesStatus;
        });

        filtered.sort((a: any, b: any) => {
            if (sortBy === 'frequency') return b.frequency - a.frequency;
            if (sortBy === 'acceptance') {
                return parseFloat(b.acceptance) - parseFloat(a.acceptance);
            }
            const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
            return order[a.difficulty] - order[b.difficulty];
        });

        return filtered;
    }, [problems, selectedCompany, selectedDifficulty, selectedStatus, searchQuery, sortBy, solvedProblems]);

    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProblems = filteredProblems.slice(startIndex, endIndex);

    useMemo(() => {
        setCurrentPage(1);
    }, [selectedCompany, selectedDifficulty, selectedStatus, searchQuery, sortBy]);

    const stats = useMemo(() => {
        const solved = problems.filter((p: any) => solvedProblems.has(p.id)).length;
        const total = problems.length;
        const easy = problems.filter((p: any) => p.difficulty === 'Easy' && solvedProblems.has(p.id)).length;
        const medium = problems.filter((p: any) => p.difficulty === 'Medium' && solvedProblems.has(p.id)).length;
        const hard = problems.filter((p: any) => p.difficulty === 'Hard' && solvedProblems.has(p.id)).length;
        return { solved, total, easy, medium, hard, percentage: total > 0 ? Math.round((solved / total) * 100) : 0 };
    }, [problems, solvedProblems]);

    const getDifficultyColor = (difficulty: string) => {
        const colors = {
            Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
            Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
        };
        return colors[difficulty as keyof typeof colors] || 'text-white/60 bg-white/5';
    };

    const getFrequencyBadge = (frequency: number) => {
        if (frequency >= 2.0) return { label: 'Very High', color: 'text-primary bg-primary/10 border-primary/20' };
        if (frequency >= 1.5) return { label: 'High', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
        if (frequency >= 1.0) return { label: 'Medium', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
        return { label: 'Low', color: 'text-white/40 bg-white/5 border-white/10' };
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Code className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">
                            DSA <span className="text-primary">Problems</span>
                        </h1>
                        <p className="text-white/50 text-sm mt-1">
                            Practice {metadata.total_problems.toLocaleString()} company-wise problems
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Filters</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-medium text-white/50 mb-2">Search Problems</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Company Select */}
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-2">Company</label>
                        <div className="relative">
                            <select
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="All">All ({companyCounts['All']})</option>
                                {allCompanies.map((company: string) => (
                                    <option key={company} value={company}>
                                        {company} ({companyCounts[company]})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>

                    {/* Difficulty Select */}
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-2">Difficulty</label>
                        <div className="relative">
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="All">All Levels</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-2">Status</label>
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="All">All Status ({companyCounts['All']})</option>
                                <option value="Solved">Solved ({solvedCounts.solved})</option>
                                <option value="Unsolved">Unsolved ({solvedCounts.unsolved})</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>

                    {/* Sort Select */}
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-2">Sort By</label>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="frequency">Frequency ↓</option>
                                <option value="acceptance">Acceptance ↓</option>
                                <option value="difficulty">Difficulty ↑</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                {/* Sidebar Stats */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold text-primary">Your Progress</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-baseline mb-3">
                                    <span className="text-sm text-white/70 font-medium">Solved</span>
                                    <span className="text-xl font-bold text-primary">
                                        {stats.solved}<span className="text-sm text-white/50">/{stats.total}</span>
                                    </span>
                                </div>
                                <div className="h-2.5 bg-black/30 rounded-full overflow-hidden border border-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full transition-all duration-700"
                                        style={{ width: `${stats.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-white/50 mt-2">{stats.percentage}% Complete</p>
                            </div>

                            <div className="pt-4 border-t border-white/20 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-green-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        Easy
                                    </span>
                                    <span className="font-bold">{stats.easy}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-yellow-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                        Medium
                                    </span>
                                    <span className="font-bold">{stats.medium}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-red-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                        Hard
                                    </span>
                                    <span className="font-bold">{stats.hard}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold mb-1">
                            {selectedCompany === 'All' ? 'All Problems' : `${selectedCompany} Problems`}
                        </h2>
                        <p className="text-white/50 text-sm">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredProblems.length)} of {filteredProblems.length}
                        </p>
                    </div>

                    <div className="space-y-3">
                        {currentProblems.map((problem: any) => {
                            const freqBadge = getFrequencyBadge(problem.frequency);
                            const isSolved = solvedProblems.has(problem.id);

                            return (
                                <div
                                    key={problem.id}
                                    className={`bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-sm border rounded-xl p-5 hover:border-primary/40 transition-all group ${isSolved ? 'border-primary/20 bg-primary/5' : 'border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <button
                                            onClick={() => toggleSolved(problem.id)}
                                            className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
                                            title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                                        >
                                            {isSolved ? (
                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0 space-y-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-white/40 text-xs font-mono font-semibold px-2 py-0.5 bg-white/5 rounded">
                                                        #{problem.id}
                                                    </span>
                                                    <h3 className={`text-sm font-semibold transition-colors ${isSolved ? 'text-white/70 line-through' : 'group-hover:text-primary'
                                                        }`}>
                                                        {problem.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                                        {problem.difficulty}
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${freqBadge.color}`}>
                                                        {freqBadge.label}
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60">
                                                        {problem.acceptance}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs">
                                                <Building2 className="w-3.5 h-3.5 text-white/40" />
                                                <div className="flex flex-wrap gap-x-1.5">
                                                    {problem.companies.slice(0, 4).map((company: string, idx: number) => (
                                                        <span key={idx} className="text-white/50">
                                                            {company}{idx < Math.min(3, problem.companies.length - 1) ? ',' : ''}
                                                        </span>
                                                    ))}
                                                    {problem.companies.length > 4 && (
                                                        <span className="text-primary font-semibold">
                                                            +{problem.companies.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={problem.leetcodeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 hover:scale-105"
                                        >
                                            Solve
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredProblems.length === 0 && (
                            <div className="text-center py-16 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl">
                                <Code className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                <p className="text-white/60 font-semibold mb-1">No problems found</p>
                                <p className="text-white/40 text-sm">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredProblems.length > 0 && (
                        <div className="flex items-center justify-between bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/10 rounded-xl p-4">
                            <div className="text-xs text-white/60">
                                Page <span className="font-bold text-primary">{currentPage}</span> of {totalPages}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-white/20 bg-black/40 hover:bg-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="hidden md:flex items-center gap-1">
                                    {getPageNumbers().map((page, idx) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-white/40 text-sm">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page as number)}
                                                className={`min-w-[32px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentPage === page
                                                    ? 'bg-primary text-white'
                                                    : 'bg-black/40 border border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <div className="md:hidden px-3 py-1.5 bg-black/40 border border-white/20 rounded-lg text-sm font-semibold">
                                    {currentPage} / {totalPages}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-white/20 bg-black/40 hover:bg-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="text-xs text-white/60 hidden lg:block">
                                {ITEMS_PER_PAGE} per page
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Scrollbar CSS */}
            <style jsx global>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    transition: all 0.3s;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                /* Firefox */
                * {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.2);
                }
                
                /* Custom dropdown styling */
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.75rem center;
                    background-size: 1rem;
                    padding-right: 2.5rem;
                }
                
                select option {
                    background: #1a1a1a;
                    color: white;
                }
                
                select:focus option {
                    background: #2a2a2a;
                }
                
                /* Improved dropdown dark theme */
                .dark-select {
                    background-color: rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    color: white;
                }
                
                .dark-select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
                }
            `}</style>
        </div>
    );
}