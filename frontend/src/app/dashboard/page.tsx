import { currentUser } from '@clerk/nextjs/server';
import { Upload, TrendingUp, ClipboardCheck, Target, Award, BookOpen, Code, ArrowRight, ListChecks } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
    const user = await currentUser();

    const stats = [
        { label: 'Skills Analyzed', value: '0', icon: Target, color: 'text-primary bg-primary/10' },
        { label: 'Career Paths', value: '0', icon: TrendingUp, color: 'text-blue-400 bg-blue-400/10' },
        { label: 'Problems Solved', value: '0', icon: Code, color: 'text-green-400 bg-green-400/10' },
        { label: 'Certifications', value: '0', icon: Award, color: 'text-yellow-400 bg-yellow-400/10' },
    ];

    const quickActions = [
        {
            title: 'Upload Resume',
            description: 'Get AI-powered skill analysis and personalized recommendations',
            icon: Upload,
            href: '/dashboard/resume',
            color: 'from-primary/20 to-primary/5',
            borderColor: 'border-primary/30',
            iconColor: 'text-primary bg-primary/10',
        },
        {
            title: 'Browse Problems',
            description: 'Practice company-wise DSA problems to ace interviews',
            icon: Code,
            href: '/dashboard/problems',
            color: 'from-green-500/20 to-green-500/5',
            borderColor: 'border-green-500/30',
            iconColor: 'text-green-400 bg-green-400/10',
        },
        {
            title: 'Career Roadmaps',
            description: 'Explore personalized career paths based on your goals',
            icon: TrendingUp,
            href: '/dashboard/careerPaths',
            color: 'from-blue-500/20 to-blue-500/5',
            borderColor: 'border-blue-500/30',
            iconColor: 'text-blue-400 bg-blue-400/10',
        },
        {
            title: 'Interview Questions',
            description: 'See and contribute latest placement, DSA, and HR round questions for every company',
            icon: ListChecks,
            href: '/dashboard/interview-questions',
            color: 'from-yellow-500/20 to-yellow-500/5',
            borderColor: 'border-yellow-500/30',
            iconColor: 'text-yellow-400 bg-yellow-400/10',
        }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                {/* <h1 className="text-3xl font-bold mb-2"> */}
                    {/* Welcome back, <span className="text-primary">{user?.firstName || 'there'}</span>! */}
                {/* </h1> */}
                <p className="text-white/60 text-xl font-bold">
                    Track your progress and continue your career journey
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                    >
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-1">{stat.value}</p>
                        <p className="text-sm text-white/60">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {quickActions.map((action, idx) => (
                        <Link
                            key={idx}
                            href={action.href}
                            className={`group relative bg-gradient-to-br ${action.color} border ${action.borderColor} rounded-xl p-6 hover:scale-[1.02] transition-all`}
                        >
                            <div className={`w-14 h-14 ${action.iconColor} rounded-xl flex items-center justify-center mb-4`}>
                                <action.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                            <p className="text-white/70 mb-4">{action.description}</p>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-8">
                <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">New here? Get Started!</h3>
                        <p className="text-white/80 mb-6 text-lg">
                            Upload your resume to get personalized career recommendations, skill gap analysis,
                            and a curated learning roadmap powered by AI.
                        </p>
                        <Link
                            href="/dashboard/resume"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20"
                        >
                            Upload Your Resume
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
