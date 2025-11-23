// app/dashboard/companies/[companyId]/components/SalaryTab.tsx
import { DollarSign, TrendingUp } from 'lucide-react';
import { CollegeInsights } from '../types';

interface SalaryTabProps {
    collegeInsights: CollegeInsights;
}

export default function SalaryTab({ collegeInsights }: SalaryTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
                {/* Salary Overview */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Salary Overview</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-black/20 rounded-lg p-4 text-center">
                            <p className="text-white/60 text-xs mb-2">Average CTC</p>
                            <p className="text-2xl font-bold text-primary">₹{collegeInsights.avgSalary} LPA</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-4 text-center">
                            <p className="text-white/60 text-xs mb-2">Minimum CTC</p>
                            <p className="text-2xl font-bold text-green-400">₹3.2 LPA</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-4 text-center">
                            <p className="text-white/60 text-xs mb-2">Maximum CTC</p>
                            <p className="text-2xl font-bold text-yellow-400">₹6.5 LPA</p>
                        </div>
                    </div>
                </div>

                {/* Role-wise Breakdown */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h4 className="font-bold">Role-wise Breakdown</h4>
                    </div>
                    <div className="space-y-3">
                        {[
                            { role: 'Software Developer', avg: 4.2, range: '3.5-6.5', count: 8 },
                            { role: 'Business Analyst', avg: 3.8, range: '3.2-5', count: 5 },
                            { role: 'Consultant', avg: 4.0, range: '3.5-5.5', count: 4 },
                        ].map((item) => (
                            <div key={item.role} className="bg-black/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-lg">{item.role}</span>
                                    <span className="text-primary font-bold text-lg">₹{item.avg} LPA</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-white/60">
                                    <span>Range: ₹{item.range} LPA</span>
                                    <span>{item.count} placements</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
        </div>
    );
}
