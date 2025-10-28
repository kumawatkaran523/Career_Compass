'use client';

import { useState } from 'react';
import { Sparkles, Clock, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CareerPathPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        technology: '',
        duration: '',
        difficulty: 'Intermediate',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const technologies = ['AWS', 'MERN Stack', 'AI/ML', 'Docker', 'Azure', 'React.js', 'Python', 'DevOps', 'Kubernetes', 'Next.js'];
    const durations = ['1 Week', '2 Weeks', '1 Month', '3 Months', '6 Months'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    const handleGenerate = async () => {
        if (!formData.technology || !formData.duration) {
            setError('Please select Technology and Duration');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            console.log('Calling backend API...');
            console.log('Request data:', formData);

            // Call backend API
            const response = await fetch('http://localhost:5000/api/roadmap/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate roadmap');
            }

            const result = await response.json();
            console.log('Success! Roadmap generated:', result);

            // Extract the roadmap data from success response
            const roadmapData = result.data || result;

            // Store in localStorage
            localStorage.setItem('generatedRoadmap', JSON.stringify(roadmapData));
            localStorage.setItem('roadmapData', JSON.stringify(formData));

            console.log('Saved to localStorage');
            console.log('Navigating to roadmap view...');

            // Navigate to roadmap view
            router.push('/dashboard/careerPaths/roadmapView');

        } catch (error: any) {
            console.error('Generation error:', error);
            setError(error.message || 'Failed to generate roadmap. Please try again.');
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
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
                {/* Generation Form */}
                {!isGenerating && (
                    <div className="space-y-8">
                        {/* Hero Card */}
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

                        {/* Form Card */}
                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-10">
                            <h3 className="text-2xl font-bold mb-8 text-center">Configure Your Roadmap</h3>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-8 max-w-2xl mx-auto">
                                {/* Technology */}
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

                                {/* Duration */}
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

                                {/* Difficulty */}
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

                                {/* Generate Button */}
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
                    </div>
                )}

                {/* Loading State */}
                {isGenerating && (
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-16 text-center">
                        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping"></div>
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-3">Generating Your AI Roadmap</h3>
                        <p className="text-white/70 text-lg mb-6">Our AI is analyzing your requirements and creating a personalized learning path...</p>
                        
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        
                        <div className="max-w-md mx-auto">
                            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm text-white/60 mt-4">This usually takes 5-10 seconds...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
