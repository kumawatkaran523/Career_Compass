'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Target, Sparkles, ChevronDown, ChevronUp, ExternalLink, BookOpen, Video, FileText, Award, Code, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoadmapViewPage() {
    const router = useRouter();
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]);
    const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [dbUserId, setDbUserId] = useState<string | null>(null);
    const [roadmapId, setRoadmapId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            console.log('Loading roadmap from localStorage...');
            
            const generatedRoadmap = localStorage.getItem('generatedRoadmap');
            const userId = localStorage.getItem('dbUserId');
            
            if (generatedRoadmap) {
                try {
                    const parsed = JSON.parse(generatedRoadmap);
                    console.log('Roadmap loaded:', parsed);
                    setRoadmapData(parsed);
                    setDbUserId(userId);
                    
                    if (parsed.roadmapId) {
                        setRoadmapId(parsed.roadmapId);
                        
                        if (userId) {
                            await loadProgressFromDatabase(userId, parsed.roadmapId);
                        }
                    }
                } catch (error) {
                    console.error('Failed to parse roadmap:', error);
                    alert('Failed to load roadmap. Redirecting back...');
                    router.push('/dashboard/careerPaths');
                }
            } else {
                console.error('No roadmap found in localStorage');
                alert('No roadmap found. Please generate one first.');
                router.push('/dashboard/careerPaths');
            }
            
            const savedProgress = localStorage.getItem('completedItems');
            if (savedProgress) {
                try {
                    setCompletedItems(new Set(JSON.parse(savedProgress)));
                } catch (error) {
                    console.error('Failed to load progress:', error);
                }
            }

            setLoading(false);
        };

        loadData();
    }, [router]);

    const loadProgressFromDatabase = async (userId: string, roadmapId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/progress/${userId}/${roadmapId}`
            );

            if (response.ok) {
                const result = await response.json();
                const progressArray = result.data.progress;
                
                const completedTopicIds = progressArray
                    .filter((p: any) => p.completed)
                    .map((p: any) => p.topicId);

                setCompletedItems(new Set(completedTopicIds));
                localStorage.setItem('completedItems', JSON.stringify(completedTopicIds));
                
                console.log('Progress loaded from database:', completedTopicIds.length, 'topics completed');
            }
        } catch (error) {
            console.error('Failed to load progress from database:', error);
        }
    };

    const toggleWeek = (weekNumber: number) => {
        setExpandedWeeks(prev =>
            prev.includes(weekNumber)
                ? prev.filter(w => w !== weekNumber)
                : [...prev, weekNumber]
        );
    };

    const toggleComplete = async (topicId: string) => {
        const newCompleted = new Set(completedItems);
        const isCompleting = !newCompleted.has(topicId);
        
        if (isCompleting) {
            newCompleted.add(topicId);
        } else {
            newCompleted.delete(topicId);
        }
        
        setCompletedItems(newCompleted);
        localStorage.setItem('completedItems', JSON.stringify([...newCompleted]));

        if (dbUserId && roadmapId) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: dbUserId,
                        roadmapId: roadmapId,
                        topicId: topicId,
                        completed: isCompleting,
                    }),
                });

                if (response.ok) {
                    console.log('Progress synced to database:', topicId, isCompleting);
                } else {
                    console.error('Failed to sync progress to database');
                }
            } catch (error) {
                console.error('Error syncing progress:', error);
            }
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return Video;
            case 'reading': return BookOpen;
            case 'practice': return Code;
            case 'project': return Target;
            default: return FileText;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'reading': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'practice': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'project': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            default: return 'text-white/60 bg-white/5 border-white/10';
        }
    };

    if (loading || !roadmapData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Loading your roadmap...</p>
                </div>
            </div>
        );
    }

    const totalTopics = roadmapData.weeks.reduce((acc: number, week: any) => acc + week.topics.length, 0);
    const completedTopics = [...completedItems].length;
    const progressPercentage = Math.round((completedTopics / totalTopics) * 100);

    return (
        <div className="min-h-screen pb-12">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/dashboard/careerPaths')}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Career Paths
                </button>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/20">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Your <span className="text-primary">{roadmapData.technology}</span> Roadmap
                        </h1>
                        <p className="text-white/60 text-sm mt-1">
                            {roadmapData.duration} • {roadmapData.difficulty} Level • {roadmapData.estimatedHours} hours
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Overall Progress</h3>
                                <p className="text-white/70 text-sm">Keep going! You're making great progress</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-primary">{progressPercentage}%</div>
                                <div className="text-sm text-white/60 mt-1">{completedTopics}/{totalTopics} topics</div>
                            </div>
                        </div>
                        <div className="h-4 bg-black/30 rounded-full overflow-hidden ring-1 ring-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full transition-all duration-700 shadow-lg shadow-primary/50"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {roadmapData.weeks.map((week: any, idx: number) => {
                            const isExpanded = expandedWeeks.includes(idx);
                            const weekCompletedTopics = week.topics.filter((t: any) => completedItems.has(t.id)).length;
                            const weekProgress = Math.round((weekCompletedTopics / week.topics.length) * 100);

                            return (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all"
                                >
                                    <button
                                        onClick={() => toggleWeek(idx)}
                                        className="w-full p-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                                    >
                                        <div className="flex items-center gap-5 text-left">
                                            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="text-xl font-bold text-primary">W{week.weekNumber}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{week.title}</h3>
                                                <p className="text-white/60 text-sm mb-2">{week.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-white/50">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {week.estimatedHours}h
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Target className="w-3.5 h-3.5" />
                                                        {weekCompletedTopics}/{week.topics.length} completed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-primary">{weekProgress}%</div>
                                                <div className="w-24 h-2 bg-black/30 rounded-full overflow-hidden mt-1">
                                                    <div
                                                        className="h-full bg-primary rounded-full transition-all"
                                                        style={{ width: `${weekProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-white/40" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-white/40" />
                                            )}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="px-6 pb-6 space-y-3">
                                            {week.topics.map((topic: any) => {
                                                const isCompleted = completedItems.has(topic.id);
                                                const TypeIcon = getTypeIcon(topic.type);

                                                return (
                                                    <div
                                                        key={topic.id}
                                                        className={`p-5 rounded-xl border transition-all ${
                                                            isCompleted
                                                                ? 'bg-primary/10 border-primary/30'
                                                                : 'bg-black/30 border-white/10 hover:border-white/20'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <button
                                                                onClick={() => toggleComplete(topic.id)}
                                                                className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
                                                            >
                                                                {isCompleted ? (
                                                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                                                ) : (
                                                                    <Circle className="w-6 h-6 text-white/20" />
                                                                )}
                                                            </button>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h4 className={`font-semibold ${isCompleted ? 'line-through text-white/60' : ''}`}>
                                                                        {topic.title}
                                                                    </h4>
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${getTypeColor(topic.type)}`}>
                                                                        <TypeIcon className="w-3.5 h-3.5" />
                                                                        {topic.type}
                                                                    </span>
                                                                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/70">
                                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                                        {topic.duration}
                                                                    </span>
                                                                </div>

                                                                {topic.resources && topic.resources.length > 0 && (
                                                                    <div className="space-y-1.5">
                                                                        <p className="text-xs text-white/50 font-medium">Resources:</p>
                                                                        {topic.resources.map((resource: string, ridx: number) => (
                                                                            <a
                                                                                key={ridx}
                                                                                href="#"
                                                                                className="flex items-center gap-2 text-xs text-primary hover:underline"
                                                                            >
                                                                                <ExternalLink className="w-3 h-3" />
                                                                                {resource}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6 sticky top-24">
                        <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            Learning Stats
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-black/30 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-1">{roadmapData.totalWeeks}</div>
                                <div className="text-sm text-white/60">Total Weeks</div>
                            </div>
                            <div className="p-4 bg-black/30 rounded-xl">
                                <div className="text-3xl font-bold text-green-400 mb-1">{completedTopics}</div>
                                <div className="text-sm text-white/60">Topics Completed</div>
                            </div>
                            <div className="p-4 bg-black/30 rounded-xl">
                                <div className="text-3xl font-bold text-yellow-400 mb-1">{totalTopics - completedTopics}</div>
                                <div className="text-sm text-white/60">Topics Remaining</div>
                            </div>
                            <div className="p-4 bg-black/30 rounded-xl">
                                <div className="text-3xl font-bold text-blue-400 mb-1">{roadmapData.estimatedHours}h</div>
                                <div className="text-sm text-white/60">Total Hours</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h4 className="text-sm font-semibold mb-3 text-white/80">Weekly Breakdown</h4>
                            <div className="space-y-2">
                                {roadmapData.weeks.map((week: any, idx: number) => {
                                    const weekCompletedTopics = week.topics.filter((t: any) => completedItems.has(t.id)).length;
                                    const weekProgress = Math.round((weekCompletedTopics / week.topics.length) * 100);

                                    return (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="text-white/60">Week {week.weekNumber}</span>
                                            <span className={`font-semibold ${weekProgress === 100 ? 'text-primary' : 'text-white/80'}`}>
                                                {weekProgress}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
