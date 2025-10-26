import { UserButton } from '@clerk/nextjs';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Dashboard Header */}
            <header className="border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-primary" />
                        <span className="text-xl font-bold">
                            Career<span className="text-primary">Compass</span>
                        </span>
                    </Link>

                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to Your <span className="text-primary">Dashboard</span>
                </h1>
                <p className="text-white/70 text-lg">
                    Your personalized career journey starts here. Upload your resume to get started!
                </p>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
                        <p className="text-white/70 mb-4">Get AI-powered skill analysis</p>
                        <button className="px-4 py-2 bg-primary hover:bg-primary-600 rounded-lg transition-colors">
                            Upload Now
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Browse Roadmaps</h3>
                        <p className="text-white/70 mb-4">Explore career paths</p>
                        <button className="px-4 py-2 border border-white/20 hover:bg-white/5 rounded-lg transition-colors">
                            Explore
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Take Assessment</h3>
                        <p className="text-white/70 mb-4">Test your skills</p>
                        <button className="px-4 py-2 border border-white/20 hover:bg-white/5 rounded-lg transition-colors">
                            Start Quiz
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
