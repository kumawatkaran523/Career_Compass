// app/dashboard/companies/[companyId]/components/SalaryTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { DollarSign, TrendingUp, Award, Users } from 'lucide-react';

interface SalaryTabProps {
    companyId: string;
}

interface SalaryData {
    collegeData?: {
        avgSalary: number;
        minSalary: number;
        maxSalary: number;
        totalOffers: number;
        roleBreakdown: {
            role: string;
            avgSalary: number;
            minSalary: number;
            maxSalary: number;
            count: number;
        }[];
    };
    globalData: {
        avgSalary: number;
        minSalary: number;
        maxSalary: number;
        totalOffers: number;
        roleBreakdown: {
            role: string;
            avgSalary: number;
            minSalary: number;
            maxSalary: number;
            count: number;
        }[];
    };
}

export default function SalaryTab({ companyId }: SalaryTabProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [salaryData, setSalaryData] = useState<SalaryData | null>(null);

    useEffect(() => {
        const fetchSalaryData = async () => {
            try {
                // Get user's collegeId
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

                const params = collegeId ? `?collegeId=${collegeId}` : '';

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies/${companyId}/salary-insights${params}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch salary data');
                }

                const data = await response.json();
                setSalaryData(data.data);
            } catch (error) {
                console.error('Error fetching salary data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalaryData();
    }, [companyId, user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!salaryData || salaryData.globalData.totalOffers === 0) {
        return (
            <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Salary Information</h3>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-white/60">No salary data available yet. Share your experience to help others!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* College Salary Data */}
            {salaryData.collegeData && (
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Salary at Your College</h3>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                        <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-white/60 text-xs mb-1">Average CTC</p>
                            <p className="text-2xl font-bold text-primary">₹{salaryData.collegeData.avgSalary}L</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-white/60 text-xs mb-1">Minimum CTC</p>
                            <p className="text-2xl font-bold text-green-400">₹{salaryData.collegeData.minSalary}L</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-white/60 text-xs mb-1">Maximum CTC</p>
                            <p className="text-2xl font-bold text-yellow-400">₹{salaryData.collegeData.maxSalary}L</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-white/60 text-xs mb-1">Total Offers</p>
                            <p className="text-2xl font-bold text-white">{salaryData.collegeData.totalOffers}</p>
                        </div>
                    </div>

                    {/* Role-wise Breakdown */}
                    {salaryData.collegeData.roleBreakdown.length > 0 && (
                        <div className="border-t border-primary/20 pt-4">
                            <h4 className="font-semibold mb-3 text-white/90">Role-wise Breakdown</h4>
                            <div className="space-y-3">
                                {salaryData.collegeData.roleBreakdown.map((item, index) => (
                                    <div key={index} className="bg-black/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-lg">{item.role}</span>
                                            <span className="text-primary font-bold text-lg">₹{item.avgSalary}L</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-white/60">
                                            <span>Range: ₹{item.minSalary}L - ₹{item.maxSalary}L</span>
                                            <span>{item.count} offer{item.count !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Global Salary Data */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-white/60" />
                    <h3 className="text-lg font-bold">Global Salary Insights</h3>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Average CTC</p>
                        <p className="text-2xl font-bold text-primary">₹{salaryData.globalData.avgSalary}L</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Minimum CTC</p>
                        <p className="text-2xl font-bold text-green-400">₹{salaryData.globalData.minSalary}L</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Maximum CTC</p>
                        <p className="text-2xl font-bold text-yellow-400">₹{salaryData.globalData.maxSalary}L</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-white/60 text-xs mb-1">Total Offers</p>
                        <p className="text-2xl font-bold text-white">{salaryData.globalData.totalOffers}</p>
                    </div>
                </div>

                {/* Role-wise Breakdown */}
                {salaryData.globalData.roleBreakdown.length > 0 && (
                    <div className="border-t border-white/10 pt-4">
                        <h4 className="font-semibold mb-3 text-white/90">Role-wise Breakdown</h4>
                        <div className="space-y-3">
                            {salaryData.globalData.roleBreakdown.map((item, index) => (
                                <div key={index} className="bg-black/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-lg">{item.role}</span>
                                        <span className="text-primary font-bold text-lg">₹{item.avgSalary}L</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-white/60">
                                        <span>Range: ₹{item.minSalary}L - ₹{item.maxSalary}L</span>
                                        <span>{item.count} offer{item.count !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
