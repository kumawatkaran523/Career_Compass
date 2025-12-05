'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clock, ChevronDown, History, Trash2, ExternalLink, Target, Zap, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { roadmapCache } from '@/app/lib/cache';
import { useUserRoadmaps } from '@/app/hooks/useUserRoadmaps';

export default function CareerPathPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [dbUserId, setDbUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        technology: '',
        duration: '',
        difficulty: 'Intermediate',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [usingCache, setUsingCache] = useState(false);

    const { roadmaps, loading: loadingRoadmaps, refetch } = useUserRoadmaps(dbUserId);

    const technologies = ['AWS', 'MERN Stack', 'AI/ML', 'Docker', 'Azure', 'React.js', 'Python', 'DevOps', 'Kubernetes', 'Next.js'];
    const durations = ['1 Week', '2 Weeks', '1 Month', '3 Months', '6 Months'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !user) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clerkId: user.id,
                        email: user.emailAddresses[0]?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageUrl: user.imageUrl,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setDbUserId(result.data.id);
                    localStorage.setItem('dbUserId', result.data.id);
                }
            } catch (error) {
                console.error('Error syncing user:', error);
            }
        };

        syncUser();
    }, [user, isLoaded]);

    const handleGenerate = async () => {
        if (!formData.technology || !formData.duration) {
            setError('Please select Technology and Duration');
            return;
        }

        setIsGenerating(true);
        setError('');
        setUsingCache(false);

        try {
            const cachedRoadmap = roadmapCache.getCachedRoadmap(
                formData.technology,
                formData.duration,
                formData.difficulty
            );

            let roadmapData;

            if (cachedRoadmap) {
                console.log('Using cached roadmap');
                setUsingCache(true);
                roadmapData = cachedRoadmap;
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.log('Generating new roadmap...');

                const requestBody: any = {
                    ...formData,
                };

                if (dbUserId) {
                    requestBody.userId = dbUserId;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate roadmap');
                }

                const result = await response.json();
                roadmapData = result.data || result;

                roadmapCache.setCachedRoadmap(
                    formData.technology,
                    formData.duration,
                    formData.difficulty,
                    roadmapData
                );
            }

            localStorage.setItem('generatedRoadmap', JSON.stringify(roadmapData));
            localStorage.setItem('roadmapData', JSON.stringify(formData));

            refetch();
            router.push('/dashboard/careerPaths/roadmapView');

        } catch (error: any) {
            console.error('Generation error:', error);
            setError(error.message || 'Failed to generate roadmap. Please try again.');
            setIsGenerating(false);
        }
    };

    const handleLoadRoadmap = (roadmap: any) => {
        localStorage.setItem('generatedRoadmap', JSON.stringify({
            ...roadmap.content,
            roadmapId: roadmap.id,
        }));
        localStorage.setItem('roadmapData', JSON.stringify({
            technology: roadmap.technology,
            duration: roadmap.duration,
            difficulty: roadmap.difficulty,
        }));
        router.push('/dashboard/careerPaths/roadmapView');
    };

    const handleDeleteRoadmap = async (roadmapId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirm('Delete this roadmap?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/${roadmapId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: dbUserId }),
                });

                if (response.ok) {
                    refetch();
                } else {
                    alert('Failed to delete roadmap');
                }
            } catch (error) {
                console.error('Error deleting roadmap:', error);
                alert('Failed to delete roadmap');
            }
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    return (
        <div className="min-h-screen pb-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/20">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                AI Career <span className="text-primary">Roadmap</span>
                            </h1>
                            <p className="text-white/50 text-sm mt-1">
                                Create personalized learning paths powered by AI
                            </p>
                        </div>
                    </div>
                    {user && (
                        <div className="hidden md:flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">Ready to Learn</p>
                                <p className="text-white/60 text-xs">{user.firstName || 'User'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Left Column: Roadmap Generator */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Banner */}
                    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Build Your Learning Journey</h2>
                            </div>
                            <p className="text-white/70 text-sm">
                                Our AI creates a structured roadmap with topics, resources, and milestones
                                tailored to your goals and timeline.
                            </p>
                        </div>
                    </div>

                    {/* Configuration Card */}
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-6 text-center">Configure Your Roadmap</h3>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-3">
                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-8 max-w-2xl mx-auto">
                            {/* Technology Selection */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">1</span>
                                    </div>
                                    <label className="block text-base font-semibold text-white">
                                        Select Technology
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
                                        value={formData.technology}
                                        onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                                        className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3.5 pr-12 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all hover:border-white/30"
                                        style={{ colorScheme: 'dark' }}
                                    >
                                        <option value="" className="bg-gray-900 text-white">Choose a technology...</option>
                                        {technologies.map((tech) => (
                                            <option key={tech} value={tech} className="bg-gray-900 text-white">{tech}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                </div>
                            </div>

                            {/* Duration Selection */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">2</span>
                                    </div>
                                    <label className="block text-base font-semibold text-white">
                                        Choose Duration
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3.5 pr-12 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all hover:border-white/30"
                                        style={{ colorScheme: 'dark' }}
                                    >
                                        <option value="" className="bg-gray-900 text-white">Select timeline...</option>
                                        {durations.map((duration) => (
                                            <option key={duration} value={duration} className="bg-gray-900 text-white">{duration}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                </div>
                            </div>

                            {/* Difficulty Selection */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">3</span>
                                    </div>
                                    <label className="block text-base font-semibold text-white">
                                        Set Difficulty Level
                                    </label>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {difficulties.map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => setFormData({ ...formData, difficulty: diff })}
                                            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${formData.difficulty === diff
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105'
                                                : 'bg-black/30 border border-white/20 text-white/70 hover:border-white/30 hover:bg-black/40'
                                                }`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={!formData.technology || !formData.duration || isGenerating}
                                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary rounded-xl font-bold text-base transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                            >
                                <Sparkles className="w-5 h-5" />
                                {isGenerating ? 'Generating...' : 'Generate My Roadmap'}
                            </button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-xl p-5 text-center hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 ring-2 ring-primary/20 group-hover:ring-primary/40">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">Structured Learning</h3>
                            <p className="text-xs text-white/60">Step-by-step curriculum with clear milestones</p>
                        </div>

                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-xl p-5 text-center hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 ring-2 ring-primary/20 group-hover:ring-primary/40">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">Fast Generation</h3>
                            <p className="text-xs text-white/60">Instant AI-powered roadmap creation</p>
                        </div>

                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-xl p-5 text-center hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 ring-2 ring-primary/20 group-hover:ring-primary/40">
                                <CheckCircle className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">Save & Track</h3>
                            <p className="text-xs text-white/60">Monitor progress across all your roadmaps</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Saved Roadmaps */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-primary" />
                                <h3 className="text-xl font-bold">Saved Roadmaps</h3>
                            </div>
                            {roadmaps.length > 0 && (
                                <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded-md">
                                    {roadmaps.length}
                                </span>
                            )}
                        </div>

                        {loadingRoadmaps ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-white/60 text-sm">Loading roadmaps...</p>
                            </div>
                        ) : roadmaps.length > 0 ? (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {roadmaps.map((roadmap) => (
                                    <div
                                        key={roadmap.id}
                                        onClick={() => handleLoadRoadmap(roadmap)}
                                        className="group bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-primary/40 hover:bg-white/[0.08] transition-all cursor-pointer active:scale-[0.99]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-bold text-sm truncate">
                                                        {roadmap.technology}
                                                    </h4>
                                                    <span className={`px-2 py-0.5 rounded border text-xs font-semibold flex-shrink-0 ${getDifficultyColor(roadmap.difficulty)}`}>
                                                        {roadmap.difficulty}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{roadmap.duration}</span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="text-white/40">
                                                        {formatTimestamp(roadmap.createdAt)}
                                                    </div>

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => handleDeleteRoadmap(roadmap.id, e)}
                                                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                                            title="Delete roadmap"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-white/40" />
                                </div>
                                <p className="text-white/60 mb-2">No saved roadmaps</p>
                                <p className="text-white/40 text-sm">Generate your first roadmap to see it here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {isGenerating && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-12 text-center max-w-md w-full mx-4">
                        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 relative ring-2 ring-primary/20">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping"></div>
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-3">
                            {usingCache ? 'Loading Roadmap' : 'Crafting Your Path'}
                        </h3>
                        <p className="text-white/70 mb-6">
                            {usingCache
                                ? 'Found existing roadmap - loading instantly...'
                                : 'Our AI is analyzing your requirements and creating a personalized learning path...'
                            }
                        </p>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>

                        <div className="space-y-2">
                            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-600 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm text-white/60">
                                {usingCache ? 'Almost there...' : 'This usually takes 5-10 seconds...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS for better dropdowns and scrollbars */}
            <style jsx global>{`
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.75rem center;
                    background-size: 1rem;
                    padding-right: 2.5rem;
                }
                
                select option {
                    background: #1a1a1a;
                    color: white;
                    padding: 8px;
                }
                
                select:focus option {
                    background: #2a2a2a;
                }
                
                /* Custom scrollbar */
                .scrollbar-custom::-webkit-scrollbar {
                    width: 6px;
                }
                
                .scrollbar-custom::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                
                .scrollbar-custom::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                
                .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}