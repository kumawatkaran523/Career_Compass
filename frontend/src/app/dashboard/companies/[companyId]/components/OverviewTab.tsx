import { GraduationCap, Star } from 'lucide-react';
import StatCard from './StatCard';
import { Company, CollegeInsights, GlobalInsights, VisitHistory } from '../types';

interface OverviewTabProps {
    collegeInsights: CollegeInsights;
    globalInsights: GlobalInsights;
    company: Company;
    visitHistory: VisitHistory[];
}

export default function OverviewTab({ collegeInsights, globalInsights, company, visitHistory }: OverviewTabProps) {
    const visitedYears = visitHistory
        .filter((v) => v.visited)
        .map((v) => v.year);

    return (
        <div className="space-y-8">
            {/* Company Description */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
                <p className="text-white/70 leading-relaxed">{company.description}</p>
            </div>

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

                <div className="mt-6 pt-6 border-t border-primary/20 space-y-3">
                    <p className="text-white/70">
                        <strong className="text-white">Last Visit:</strong> {new Date(collegeInsights.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-white/70">
                        <strong className="text-white">Common Roles:</strong>{' '}
                        {collegeInsights.commonRoles.join(', ')}
                    </p>
                    <div>
                        <p className="text-white font-medium mb-2">Years Visited:</p>
                        <div className="flex flex-wrap gap-2">
                            {visitedYears.map((year) => (
                                <span
                                    key={year}
                                    className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium"
                                >
                                    {year}
                                </span>
                            ))}
                        </div>
                    </div>
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
        </div>
    );
}
