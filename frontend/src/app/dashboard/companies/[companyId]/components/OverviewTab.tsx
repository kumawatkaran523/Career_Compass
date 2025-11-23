// app/dashboard/companies/[companyId]/components/OverviewTab.tsx
import { GraduationCap, Star, TrendingUp, Calendar, Briefcase, Clock } from 'lucide-react';
import { Company, CollegeInsights, GlobalInsights, VisitHistory } from '../types';

interface OverviewTabProps {
    collegeInsights: CollegeInsights;
    globalInsights: GlobalInsights;
    company: Company;
    visitHistory: VisitHistory[];
}

export default function OverviewTab({ collegeInsights, globalInsights, company, visitHistory }: OverviewTabProps) {
    const visitedYears = visitHistory.filter((v) => v.visited).map((v) => v.year);

    return (
        <div className="space-y-6 max-w-6xl">
            {/* College Insights */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Insights from Your College</h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Difficulty</p>
                        <p className="text-xl font-bold text-yellow-400">{collegeInsights.avgDifficulty}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Success Rate</p>
                        <p className="text-xl font-bold text-green-400">{collegeInsights.successRate}%</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Avg Rating</p>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <p className="text-xl font-bold text-yellow-400">{collegeInsights.avgRating}</p>
                        </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Avg Salary</p>
                        <p className="text-xl font-bold text-primary">₹{collegeInsights.avgSalary}L</p>
                    </div>
                </div>

                {/* Details - Compact 2-column layout */}
                <div className="space-y-4 border-t border-primary/20 pt-5">
                    {/* Last Visit + Common Roles (Same Row) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Last Visit */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white/60 text-xs mb-0.5">Last Visit</p>
                                <p className="text-white font-medium text-sm">
                                    {new Date(collegeInsights.lastVisit).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Common Roles */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white/60 text-xs mb-1">Common Roles</p>
                                <p className="text-white font-medium text-sm">
                                    {collegeInsights.commonRoles.join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Years Visited (Full Width) */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white/60 text-xs mb-1.5">Years Visited</p>
                            <div className="flex flex-wrap gap-1.5">
                                {visitedYears.map((year) => (
                                    <span
                                        key={year}
                                        className="px-2.5 py-1 bg-primary/20 text-primary rounded text-xs font-medium"
                                    >
                                        {year}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Insights */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-white/60" />
                    <h2 className="text-lg font-bold">Global Insights</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Experiences</p>
                        <p className="text-xl font-bold text-white">{globalInsights.totalExperiences}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Difficulty</p>
                        <p className="text-xl font-bold text-yellow-400">{globalInsights.avgDifficulty}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Rating</p>
                        <p className="text-xl font-bold text-yellow-400">{globalInsights.avgRating}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Avg Salary</p>
                        <p className="text-xl font-bold text-primary">₹{globalInsights.avgSalary}L</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
