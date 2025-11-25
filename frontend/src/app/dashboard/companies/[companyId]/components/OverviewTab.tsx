// app/dashboard/companies/[companyId]/components/OverviewTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { GraduationCap, Star, TrendingUp, Calendar, Briefcase, Clock, Award } from 'lucide-react';

interface OverviewTabProps {
    companyId: string;
}

interface CollegeInsights {
    totalExperiences: number;
    avgDifficulty: string;
    avgRating: number;
    successRate: number;
    avgSalary: number;
    commonRoles: string[];
    lastVisit: string;
    yearsVisited: number[];
}

interface GlobalInsights {
    totalExperiences: number;
    avgDifficulty: string;
    avgRating: number;
    avgSalary: number;
    topColleges: string[];
    commonRoles: string[];
}

export default function OverviewTab({ companyId }: OverviewTabProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [collegeInsights, setCollegeInsights] = useState<CollegeInsights | null>(null);
    const [globalInsights, setGlobalInsights] = useState<GlobalInsights | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // First, get the user's collegeId from database
                let collegeId: string | undefined;

                if (user?.id) {
                    try {
                        const userResponse = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/clerk/${user.id}`
                        );

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            collegeId = userData.data?.collegeId;
                        }
                    } catch (error) {
                        console.error('Error fetching user college:', error);
                    }
                }

                // Then fetch insights with collegeId
                const params = collegeId ? `?collegeId=${collegeId}` : '';

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies/${companyId}/insights${params}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch insights');
                }

                const data = await response.json();

                if (data.data.hasData) {
                    setCollegeInsights(data.data.collegeInsights);
                    setGlobalInsights(data.data.globalInsights);
                }
            } catch (error) {
                console.error('Error fetching insights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [companyId, user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl">
            {/* College Insights */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Insights from Your College</h2>
                </div>

                {collegeInsights ? (
                    <>
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
                                <p className="text-xl font-bold text-primary">
                                    {collegeInsights.avgSalary > 0 ? `₹${collegeInsights.avgSalary}L` : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 border-t border-primary/20 pt-5">
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
                                            {collegeInsights.commonRoles.join(', ') || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Years Visited */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white/60 text-xs mb-1.5">Years Visited</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {collegeInsights.yearsVisited.map((year) => (
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

                            {/* Total Experiences */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white/60 text-xs mb-0.5">Total Experiences</p>
                                    <p className="text-white font-medium text-sm">
                                        {collegeInsights.totalExperiences} student{collegeInsights.totalExperiences !== 1 ? 's' : ''} shared their experience
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-white/60">No data available yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {/* Global Insights */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-white/60" />
                    <h2 className="text-lg font-bold">Global Insights</h2>
                </div>

                {globalInsights ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
                                <p className="text-xl font-bold text-primary">
                                    {globalInsights.avgSalary > 0 ? `₹${globalInsights.avgSalary}L` : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Top Colleges */}
                        {globalInsights.topColleges.length > 0 && (
                            <div className="border-t border-white/10 pt-4">
                                <p className="text-white/60 text-xs mb-2">Top Colleges</p>
                                <div className="flex flex-wrap gap-2">
                                    {globalInsights.topColleges.map((college, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-white"
                                        >
                                            {college}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-white/60">No global data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
