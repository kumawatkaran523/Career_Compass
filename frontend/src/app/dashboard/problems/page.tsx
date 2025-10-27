'use client';

import { useState, useMemo } from 'react';
import { Search, Building2, Code, ExternalLink, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import problemsData from '../../../data/problems-all.json';

export default function ProblemsPage() {
    const [selectedCompany, setSelectedCompany] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'frequency' | 'acceptance' | 'difficulty'>('frequency');

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

    const getSortLabel = (value: string) => {
        const labels = {
            frequency: 'Sort by Frequency',
            acceptance: 'Sort by Acceptance',
            difficulty: 'Sort by Difficulty',
        };
        return labels[value as keyof typeof labels];
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Code className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">
                        DSA <span className="text-primary">Problems</span>
                    </h1>
                </div>
                <p className="text-white/60">
                    Practice {metadata.total_problems.toLocaleString()} company-wise problems • Updated {metadata.last_updated}
                </p>
            </div>

            {/* Filters - FIXED STYLING */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Company Select - FIXED */}
                    <div className="relative">
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                            style={{
                                colorScheme: 'dark'
                            }}
                        >
                            <option value="All" className="bg-black text-white">
                                All Companies ({companyCounts['All']})
                            </option>
                            {allCompanies.map((company: string) => (
                                <option key={company} value={company} className="bg-black text-white">
                                    {company} ({companyCounts[company]})
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>

                    {/* Difficulty Select - FIXED */}
                    <div className="relative">
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                            style={{
                                colorScheme: 'dark'
                            }}
                        >
                            <option value="All" className="bg-black text-white">All Levels</option>
                            <option value="Easy" className="bg-black text-white">Easy</option>
                            <option value="Medium" className="bg-black text-white">Medium</option>
                            <option value="Hard" className="bg-black text-white">Hard</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>

                    {/* Sort Select - FIXED (no duplicate label!) */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                            style={{
                                colorScheme: 'dark'
                            }}
                        >
                            <option value="frequency" className="bg-black text-white">Frequency ↓</option>
                            <option value="acceptance" className="bg-black text-white">Acceptance ↓</option>
                            <option value="difficulty" className="bg-black text-white">Difficulty ↑</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar Stats */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-primary">Your Progress</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-white/80">Problems Solved</span>
                                    <span className="font-bold text-primary">{stats.solved}/{stats.total}</span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-white/60 mt-2">{stats.percentage}% Complete</p>
                            </div>

                            <div className="pt-6 border-t border-white/20 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        Easy
                                    </span>
                                    <span className="font-semibold">{stats.easy}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-yellow-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                        Medium
                                    </span>
                                    <span className="font-semibold">{stats.medium}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-red-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                        Hard
                                    </span>
                                    <span className="font-semibold">{stats.hard}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">
                                {selectedCompany === 'All' ? 'All Problems' : `${selectedCompany} Problems`}
                            </h2>
                            <p className="text-white/50 text-sm mt-1">
                                Showing {filteredProblems.length} of {problems.length} problems
                            </p>
                        </div>
                    </div>

                    {filteredProblems.map((problem: any) => {
                        const freqBadge = getFrequencyBadge(problem.frequency);

                        return (
                            <div
                                key={problem.id}
                                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/30 hover:bg-white/[0.07] transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <button className="mt-1 flex-shrink-0">
                                        {problem.solved ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                                        )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-white/40 text-sm font-mono flex-shrink-0">#{problem.id}</span>
                                            <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                                                {problem.title}
                                            </h3>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${freqBadge.color}`}>
                                                {freqBadge.label}
                                            </span>
                                            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-white/70">
                                                {problem.acceptance}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <Building2 className="w-4 h-4 text-white/40 flex-shrink-0" />
                                            {problem.companies.slice(0, 4).map((company: string, idx: number) => (
                                                <span key={idx} className="text-sm text-white/60">
                                                    {company}{idx < Math.min(3, problem.companies.length - 1) ? ',' : ''}
                                                </span>
                                            ))}
                                            {problem.companies.length > 4 && (
                                                <span className="text-sm text-white/60">+{problem.companies.length - 4}</span>
                                            )}
                                        </div>
                                    </div>

                                    <a
                                        href={problem.leetcodeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-primary rounded-lg text-sm font-medium transition-all flex items-center gap-2 flex-shrink-0"
                                    >
                                        Solve
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}

                    {filteredProblems.length === 0 && (
                        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-xl">
                            <Code className="w-16 h-16 text-white/20 mx-auto mb-4" />
                            <p className="text-white/60 text-lg font-medium mb-2">No problems found</p>
                            <p className="text-white/40 text-sm">Try adjusting your filters or search query</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    }