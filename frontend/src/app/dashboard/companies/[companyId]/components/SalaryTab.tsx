import { CollegeInsights } from '../types';

interface SalaryTabProps {
    collegeInsights: CollegeInsights;
}

export default function SalaryTab({ collegeInsights }: SalaryTabProps) {
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
