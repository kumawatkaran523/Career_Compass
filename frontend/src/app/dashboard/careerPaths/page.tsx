'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clock, ChevronDown, History, Trash2, ExternalLink } from 'lucide-react';
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
                const response = await fetch('http://localhost:5000/api/users/sync', {
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
                    console.log('User synced:', result.data.id);
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

                const response = await fetch('http://localhost:5000/api/roadmap/generate', {
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
                const response = await fetch(`http://localhost:5000/api/roadmap/${roadmapId}`, {
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
        <div className="min-h-screen pb-12">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/20">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            AI Career <span className="text-primary">Roadmap Generator</span>
                        </h1>
                        <p className="text-white/60 text-sm mt-1">
                            Create personalized learning paths powered by AI
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                {!isGenerating && (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-3">Build Your Learning Journey</h2>
                                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                                    Our AI creates a structured roadmap with topics, resources, and milestones 
                                    tailored to your goals and timeline.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-10">
                            <h3 className="text-2xl font-bold mb-8 text-center">Configure Your Roadmap</h3>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-8 max-w-2xl mx-auto">
                                <div>
                                    <label className="block text-base font-semibold text-white mb-3">
                                        1. Select Technology
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.technology}
                                            onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                                            className="w-full bg-black/50 border border-white/20 rounded-xl px-5 py-4 pr-12 text-base text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all hover:border-white/30"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="" className="bg-black text-white">Choose a technology...</option>
                                            {technologies.map((tech) => (
                                                <option key={tech} value={tech} className="bg-black text-white">{tech}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-white mb-3">
                                        2. Choose Duration
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-black/50 border border-white/20 rounded-xl px-5 py-4 pr-12 text-base text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all hover:border-white/30"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="" className="bg-black text-white">Select timeline...</option>
                                            {durations.map((duration) => (
                                                <option key={duration} value={duration} className="bg-black text-white">{duration}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-white mb-3">
                                        3. Set Difficulty Level
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {difficulties.map((diff) => (
                                            <button
                                                key={diff}
                                                onClick={() => setFormData({ ...formData, difficulty: diff })}
                                                className={`px-6 py-4 rounded-xl font-semibold text-base transition-all ${
                                                    formData.difficulty === diff
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                        : 'bg-black/50 border border-white/20 text-white/70 hover:border-white/30 hover:bg-black/60'
                                                }`}
                                            >
                                                {diff}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!formData.technology || !formData.duration}
                                    className="w-full mt-8 px-8 py-5 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                                >
                                    <Sparkles className="w-6 h-6" />
                                    Generate My Roadmap
                                </button>
                            </div>
                        </div>

                        {roadmaps.length > 0 && (
                            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <History className="w-6 h-6 text-primary" />
                                        <h3 className="text-2xl font-bold">My Roadmaps</h3>
                                    </div>
                                    <span className="text-sm text-white/60">
                                        {roadmaps.length} roadmap{roadmaps.length !== 1 ? 's' : ''} saved
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {roadmaps.map((roadmap) => (
                                        <div
                                            key={roadmap.id}
                                            onClick={() => handleLoadRoadmap(roadmap)}
                                            className="relative group bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-primary/40 hover:from-white/[0.08] hover:to-white/[0.04] transition-all cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                                                        {roadmap.technology}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm text-white/60 flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {roadmap.duration}
                                                        </span>
                                                        <span className="text-white/30">•</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${getDifficultyColor(roadmap.difficulty)}`}>
                                                            {roadmap.difficulty}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-white/40">
                                                        Created {formatTimestamp(roadmap.createdAt)}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={(e) => handleDeleteRoadmap(roadmap.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                                                    title="Delete roadmap"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-primary">
                                                <span>View Roadmap</span>
                                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isGenerating && (
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-16 text-center">
                        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping"></div>
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-3">
                            {usingCache ? 'Loading Cached Roadmap' : 'Generating Your AI Roadmap'}
                        </h3>
                        <p className="text-white/70 text-lg mb-6">
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
                        
                        <div className="max-w-md mx-auto">
                            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm text-white/60 mt-4">
                                {usingCache ? 'Almost there...' : 'This usually takes 5-10 seconds...'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
