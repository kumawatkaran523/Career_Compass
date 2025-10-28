'use client';

import { useState, useMemo } from 'react';
import { Search, Building2, Code, ExternalLink, CheckCircle2, Circle, ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import problemsData from '../../../data/problems-all.json';

export default function ProblemsPage() {
    const [selectedCompany, setSelectedCompany] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'frequency' | 'acceptance' | 'difficulty'>('frequency');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const { problems, companies: allCompanies, metadata } = problemsData;

    const companyCounts = useMemo(() => {
        const counts: Record<string, number> = { All: problems.length };
        problems.forEach((problem: any) => {
            problem.companies.forEach((company: string) => {
                counts[company] = (counts[company] || 0) + 1;
            });
        });
        return counts;
    }, [problems]);

    const filteredProblems = useMemo(() => {
        let filtered = problems.filter((problem: any) => {
            const matchesCompany = selectedCompany === 'All' || problem.companies.includes(selectedCompany);
            const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
            const matchesSearch = searchQuery === '' ||
                problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                problem.id.toString().includes(searchQuery);

            return matchesCompany && matchesDifficulty && matchesSearch;
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
    }, [problems, selectedCompany, selectedDifficulty, searchQuery, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProblems = filteredProblems.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [selectedCompany, selectedDifficulty, searchQuery, sortBy]);

    const stats = useMemo(() => {
        const solved = problems.filter((p: any) => p.solved).length;
        const total = problems.length;
        const easy = problems.filter((p: any) => p.difficulty === 'Easy' && p.solved).length;
        const medium = problems.filter((p: any) => p.difficulty === 'Medium' && p.solved).length;
        const hard = problems.filter((p: any) => p.difficulty === 'Hard' && p.solved).length;
        return { solved, total, easy, medium, hard, percentage: Math.round((solved / total) * 100) };
    }, [problems]);

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

    // Pagination component
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
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Code className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            DSA <span className="text-primary">Problems</span>
                        </h1>
                        <p className="text-white/60 text-sm mt-1">
                            Practice {metadata.total_problems.toLocaleString()} company-wise problems • Updated {metadata.last_updated}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
                <div className="flex items-center gap-2 mb-5">
                    <Filter className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Filters</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-medium text-white/60 mb-2">Search Problems</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Company Select */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-2">Company</label>
                        <div className="relative">
                            <select
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="All" className="bg-black text-white">
                                    All ({companyCounts['All']})
                                </option>
                                {allCompanies.map((company: string) => (
                                    <option key={company} value={company} className="bg-black text-white">
                                        {company} ({companyCounts[company]})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>

                    {/* Difficulty Select */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-2">Difficulty</label>
                        <div className="relative">
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="All" className="bg-black text-white">All Levels</option>
                                <option value="Easy" className="bg-black text-white">Easy</option>
                                <option value="Medium" className="bg-black text-white">Medium</option>
                                <option value="Hard" className="bg-black text-white">Hard</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>

                    {/* Sort Select */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-2">Sort By</label>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="frequency" className="bg-black text-white">Frequency ↓</option>
                                <option value="acceptance" className="bg-black text-white">Acceptance ↓</option>
                                <option value="difficulty" className="bg-black text-white">Difficulty ↑</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-[300px_1fr] gap-8">
                {/* Sidebar Stats */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-7 sticky top-24 shadow-xl shadow-primary/5">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center ring-2 ring-primary/20">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-primary">Your Progress</h3>
                        </div>

                        <div className="space-y-7">
                            <div>
                                <div className="flex justify-between items-baseline mb-4">
                                    <span className="text-sm text-white/80 font-medium">Problems Solved</span>
                                    <span className="text-2xl font-bold text-primary">{stats.solved}<span className="text-base text-white/60">/{stats.total}</span></span>
                                </div>
                                <div className="h-3 bg-black/30 rounded-full overflow-hidden ring-1 ring-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full transition-all duration-700 shadow-lg shadow-primary/50"
                                        style={{ width: `${stats.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-white/60 mt-3 font-medium">{stats.percentage}% Complete</p>
                            </div>

                            <div className="pt-6 border-t border-white/20 space-y-4">
                                <div className="flex justify-between items-center text-sm group">
                                    <span className="text-green-400 flex items-center gap-2.5 font-medium">
                                        <span className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></span>
                                        Easy
                                    </span>
                                    <span className="font-bold text-lg group-hover:text-green-400 transition-colors">{stats.easy}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm group">
                                    <span className="text-yellow-400 flex items-center gap-2.5 font-medium">
                                        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></span>
                                        Medium
                                    </span>
                                    <span className="font-bold text-lg group-hover:text-yellow-400 transition-colors">{stats.medium}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm group">
                                    <span className="text-red-400 flex items-center gap-2.5 font-medium">
                                        <span className="w-2.5 h-2.5 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></span>
                                        Hard
                                    </span>
                                    <span className="font-bold text-lg group-hover:text-red-400 transition-colors">{stats.hard}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                {selectedCompany === 'All' ? 'All Problems' : `${selectedCompany} Problems`}
                            </h2>
                            <p className="text-white/50 text-sm mt-1.5">
                                Showing <span className="font-semibold text-primary">{startIndex + 1}-{Math.min(endIndex, filteredProblems.length)}</span> of {filteredProblems.length} problems
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {currentProblems.map((problem: any) => {
                            const freqBadge = getFrequencyBadge(problem.frequency);

                            return (
                                <div
                                    key={problem.id}
                                    className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/40 hover:from-white/[0.09] hover:to-white/[0.04] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-5">
                                        <button className="mt-1 flex-shrink-0 hover:scale-110 transition-transform">
                                            {problem.solved ? (
                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0 space-y-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-white/40 text-xs font-mono font-semibold flex-shrink-0 px-2 py-0.5 bg-white/5 rounded">
                                                        #{problem.id}
                                                    </span>
                                                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors leading-snug">
                                                        {problem.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                                        {problem.difficulty}
                                                    </span>
                                                    <span className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${freqBadge.color}`}>
                                                        {freqBadge.label}
                                                    </span>
                                                    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/70">
                                                        {problem.acceptance}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Building2 className="w-4 h-4 text-white/40 flex-shrink-0" />
                                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                                    {problem.companies.slice(0, 5).map((company: string, idx: number) => (
                                                        <span key={idx} className="text-sm text-white/60 font-medium">
                                                            {company}{idx < Math.min(4, problem.companies.length - 1) ? ',' : ''}
                                                        </span>
                                                    ))}
                                                    {problem.companies.length > 5 && (
                                                        <span className="text-sm text-primary font-semibold">
                                                            +{problem.companies.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={problem.leetcodeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 hover:border-primary rounded-xl text-sm font-semibold transition-all flex items-center gap-2 flex-shrink-0 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                                        >
                                            Solve
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredProblems.length === 0 && (
                            <div className="text-center py-20 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <Code className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/70 text-lg font-semibold mb-2">No problems found</p>
                                <p className="text-white/40 text-sm">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination - Compact Version */}
                    {filteredProblems.length > 0 && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            {/* Page Info */}
                            <div className="text-xs text-white/70 font-medium">
                                Page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
                            </div>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1.5">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg border border-white/20 bg-black/50 text-white/80 hover:bg-primary hover:border-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black/50 disabled:hover:border-white/20 disabled:hover:text-white/80 transition-all font-medium text-xs flex items-center gap-1.5"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                {/* Page Numbers */}
                                <div className="hidden md:flex items-center gap-1.5">
                                    {getPageNumbers().map((page, idx) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-white/40 font-medium text-xs">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page as number)}
                                                className={`min-w-[36px] px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                                                    currentPage === page
                                                        ? 'bg-primary text-white border border-primary shadow-lg shadow-primary/30'
                                                        : 'bg-black/50 border border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 hover:text-white'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                {/* Mobile Page Indicator */}
                                <div className="md:hidden px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-xs font-semibold text-white">
                                    {currentPage} / {totalPages}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg border border-white/20 bg-black/50 text-white/80 hover:bg-primary hover:border-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black/50 disabled:hover:border-white/20 disabled:hover:text-white/80 transition-all font-medium text-xs flex items-center gap-1.5"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Items per page info */}
                            <div className="text-xs text-white/60 hidden lg:block font-medium">
                                {ITEMS_PER_PAGE} per page
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
