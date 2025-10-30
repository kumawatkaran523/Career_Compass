'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Sparkles, TrendingUp, AlertCircle, CheckCircle,
    Lightbulb, DollarSign, Save, ArrowLeft, Download,
    Target, Zap, Brain, Award
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface CareerRecommendation {
    role: string;
    match_score: number;
    reasoning: string;
}

interface SalaryPrediction {
    min: number;
    max: number;
    currency: string;
}

interface Analysis {
    career_recommendations: CareerRecommendation[];
    ats_score: number;
    ats_feedback: string;
    missing_skills: string[];
    quick_wins: string[];
    salary_prediction: SalaryPrediction;
    summary: string;
}

interface AnalysisResult {
    status: string;
    processing_time: number;
    extracted_info: {
        name: string;
        email: string;
        phone: string;
        organizations: string[];
        locations: string[];
    };
    skills: Array<{
        skill: string;
        confidence: number;
        context: string;
    }>;
    analysis: Analysis;
}

export default function ResultsPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem('resumeAnalysis') || localStorage.getItem('resumeAnalysis');
        if (stored) {
            try {
                setResult(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse:', error);
            }
        }
        setLoading(false);
    }, []);

    const handleSave = async () => {
        if (!result) {
            alert('No analysis data to save');
            return;
        }

        if (!isLoaded || !user) {
            alert('Please sign in to save analysis');
            router.push('/sign-in');
            return;
        }

        setSaving(true);

        try {
            // Get dbUserId from localStorage or fetch from backend
            let dbUserId = localStorage.getItem('dbUserId');

            if (!dbUserId) {
                console.log('🔍 Fetching dbUserId from backend...');
                const userResponse = await fetch(`http://localhost:5000/api/users/clerk/${user.id}`);

                if (!userResponse.ok) {
                    throw new Error('User not found. Please refresh and try again.');
                }

                const userData = await userResponse.json();
                dbUserId = userData.data.id;
                localStorage.setItem('dbUserId', dbUserId!);
                console.log('✅ Got dbUserId:', dbUserId);
            }

            console.log('💾 Saving analysis with userId:', dbUserId);

            const response = await fetch('http://localhost:5000/api/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: dbUserId,
                    ...result,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save analysis');
            }

            const savedData = await response.json();
            console.log('✅ Analysis saved successfully:', savedData);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);

        } catch (error: any) {
            console.error('❌ Save failed:', error);
            alert(`Failed to save analysis: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Analysis Found</h2>
                    <p className="text-white/60 mb-6">Please upload a resume to analyze.</p>
                    <button
                        onClick={() => router.push('/dashboard/resume-analyze')}
                        className="px-6 py-3 bg-primary rounded-xl hover:bg-primary-600 transition-colors"
                    >
                        Upload Resume
                    </button>
                </div>
            </div>
        );
    }

    const { analysis, extracted_info, skills, processing_time } = result;

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push('/dashboard/resume-analyze')}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Upload
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">
                            Analysis <span className="text-primary">Complete</span>
                        </h1>
                        <p className="text-white/60">
                            Processed in {processing_time.toFixed(2)}s using 4 AI models
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving || saved || !user}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                        >
                            {saved ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Saved!
                                </>
                            ) : saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : !user ? (
                                <>
                                    <Save className="w-5 h-5" />
                                    Sign in to Save
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Analysis
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Candidate Info */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">Candidate Profile</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Name</p>
                            <p className="font-semibold">{extracted_info.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white/60 mb-1">Email</p>
                            <p className="font-semibold text-sm">{extracted_info.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white/60 mb-1">Phone</p>
                            <p className="font-semibold">{extracted_info.phone || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white/60 mb-1">Organizations</p>
                            <p className="font-semibold text-sm">{extracted_info.organizations?.slice(0, 1).join(', ') || 'None'}</p>
                        </div>
                    </div>
                </div>

                {/* Strategic Summary */}
                <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Brain className="w-8 h-8 text-primary" />
                            <h2 className="text-2xl font-bold">Strategic Analysis</h2>
                        </div>

                        <div className="space-y-6 text-white/90 leading-relaxed">
                            {(() => {
                                const summary = analysis.summary;
                                const paragraphs = summary.split('\n\n').filter(p => p.trim());

                                return paragraphs.map((paragraph, paraIdx) => {
                                    const lines = paragraph.split('\n').filter(l => l.trim());

                                    return (
                                        <div key={paraIdx} className="space-y-3">
                                            {lines.map((line, lineIdx) => {
                                                let trimmed = line.trim().replace(/\*\*/g, '');

                                                if (trimmed.match(/^[A-Z][^:]+:$/) && trimmed.length < 80) {
                                                    return (
                                                        <h3 key={lineIdx} className="text-lg font-bold text-primary mt-4 first:mt-0">
                                                            {trimmed}
                                                        </h3>
                                                    );
                                                }

                                                if (trimmed.match(/^\d+\.\s+/)) {
                                                    const match = trimmed.match(/^(\d+)\.\s+(.+?):\s*(.+)/);
                                                    if (match) {
                                                        const [, num, title, desc] = match;
                                                        return (
                                                            <div key={lineIdx} className="flex gap-3 items-start">
                                                                <span className="text-primary font-bold flex-shrink-0">{num}.</span>
                                                                <div>
                                                                    <span className="font-bold text-primary">{title}:</span>
                                                                    <span className="text-white/80"> {desc}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                }

                                                if (trimmed.match(/^\*\s+/)) {
                                                    const content = trimmed.replace(/^\*\s+/, '');

                                                    if (content.includes(':')) {
                                                        const colonIndex = content.indexOf(':');
                                                        const title = content.substring(0, colonIndex);
                                                        const desc = content.substring(colonIndex + 1).trim();

                                                        return (
                                                            <div key={lineIdx} className="flex gap-3 items-start pl-4">
                                                                <span className="text-primary text-lg leading-none mt-0.5 flex-shrink-0">•</span>
                                                                <div className="flex-1">
                                                                    <span className="font-bold text-primary">{title}:</span>
                                                                    <span className="text-white/80"> {desc}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div key={lineIdx} className="flex gap-3 items-start pl-4">
                                                            <span className="text-primary text-lg leading-none mt-0.5 flex-shrink-0">•</span>
                                                            <span className="text-white/80 flex-1">{content}</span>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <p key={lineIdx} className="text-sm text-white/80 leading-relaxed">
                                                        {trimmed}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>

                {/* Career Recommendations */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-7 h-7 text-primary" />
                        <h2 className="text-2xl font-bold">Career Paths for You</h2>
                    </div>

                    <div className="grid gap-4">
                        {analysis.career_recommendations.map((rec, idx) => (
                            <div
                                key={idx}
                                className="bg-black/30 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{rec.role}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full ${i < Math.floor(rec.match_score / 20)
                                                            ? 'bg-primary'
                                                            : 'bg-white/20'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-white/60">
                                                {rec.match_score}% Match
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${idx === 0
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'bg-white/10 text-white/70 border border-white/10'
                                        }`}>
                                        {idx === 0 ? 'Best Fit' : idx === 1 ? 'Alternative' : 'Growth Path'}
                                    </span>
                                </div>
                                <p className="text-white/70 leading-relaxed text-sm">{rec.reasoning}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Salary Prediction */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="w-7 h-7 text-green-400" />
                        <h2 className="text-2xl font-bold">Salary Prediction</h2>
                    </div>
                    <div className="flex items-end gap-4">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Estimated Range (India 2025)</p>
                            <p className="text-4xl font-bold">
                                ₹{(analysis.salary_prediction.min / 100000).toFixed(1)}L - ₹{(analysis.salary_prediction.max / 100000).toFixed(1)}L
                            </p>
                            <p className="text-sm text-white/60 mt-1">Per annum</p>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* ATS Score */}
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-7 h-7 text-primary" />
                            <h2 className="text-2xl font-bold">ATS Score</h2>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-5xl font-bold">{analysis.ats_score}</span>
                                <span className="text-white/60">/100</span>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all ${analysis.ats_score >= 80 ? 'bg-green-500' :
                                        analysis.ats_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${analysis.ats_score}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-xl p-5 border border-white/10 space-y-4">
                            {(() => {
                                const feedback = analysis.ats_feedback;
                                const sections = feedback.split('\n\n').filter(s => s.trim());

                                return sections.map((section, idx) => {
                                    const lines = section.split('\n').filter(l => l.trim());

                                    if (lines[0].includes('What works:') || lines[0].includes('What to fix:')) {
                                        const title = lines[0].replace(/\*\*/g, '');
                                        const items = lines.slice(1).filter(l => l.trim().startsWith('-'));

                                        return (
                                            <div key={idx}>
                                                <h4 className="text-primary font-bold text-sm mb-3">{title}</h4>
                                                <ul className="space-y-2">
                                                    {items.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                                                            <span className="text-primary text-sm leading-none mt-1">⊚</span>
                                                            <span className="flex-1">{item.replace(/^-\s*/, '').replace(/\*\*/g, '')}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    }

                                    return (
                                        <p key={idx} className="text-white/70 text-sm leading-relaxed">
                                            {section.replace(/\*\*/g, '')}
                                        </p>
                                    );
                                });
                            })()}
                        </div>
                    </div>

                    {/* Quick Wins */}
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-7 h-7 text-yellow-400" />
                            <h2 className="text-2xl font-bold">Quick Wins</h2>
                        </div>

                        <div className="space-y-3">
                            {analysis.quick_wins.map((win, idx) => {
                                const cleanWin = win.replace(/\*\*/g, '');
                                const parts = cleanWin.split(':');
                                const title = parts[0];
                                const description = parts.slice(1).join(':').trim();

                                return (
                                    <div key={idx} className="flex gap-3 items-start bg-black/30 p-4 rounded-xl border border-white/10">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-bold border border-yellow-500/30">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-yellow-400 font-bold text-sm mb-1">{title}</h4>
                                            {description && (
                                                <p className="text-white/70 text-xs leading-relaxed">{description}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-7 h-7 text-orange-400" />
                        <h2 className="text-2xl font-bold">Skills to Add</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        {analysis.missing_skills.map((skill, idx) => {
                            const cleanSkill = skill.replace(/\*\*/g, '');
                            const parts = cleanSkill.split(':');
                            const title = parts[0];
                            const description = parts.slice(1).join(':').trim();

                            return (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/30 rounded-xl"
                                >
                                    <Lightbulb className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-orange-400 font-bold text-sm mb-1">{title}</h4>
                                        {description && (
                                            <p className="text-white/70 text-xs leading-relaxed">{description}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detected Skills */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-4">Detected Skills ({skills.length})</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 20).map((skill, idx) => (
                            <div
                                key={idx}
                                className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full"
                            >
                                <span className="text-sm font-semibold text-primary">
                                    {skill.skill}
                                </span>
                                <span className="text-xs text-white/60 ml-2">
                                    {(skill.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
