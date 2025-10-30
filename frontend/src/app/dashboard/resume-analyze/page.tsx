'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, Brain, Target, Zap, History, Clock, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface SavedAnalysis {
    id: string;
    candidateName: string | null;
    candidateEmail: string | null;
    atsScore: number;
    analyzedAt: string;
    careerRecommendations: any;
}

export default function AnalyzePage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
    const [loadingAnalyses, setLoadingAnalyses] = useState(false);

    // Fetch saved analyses
    useEffect(() => {
        const fetchSavedAnalyses = async () => {
            if (!isLoaded || !user) return;

            const dbUserId = localStorage.getItem('dbUserId');
            if (!dbUserId) return;

            setLoadingAnalyses(true);
            try {
                const response = await fetch(`http://localhost:5000/api/analysis/user/${dbUserId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSavedAnalyses(data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch analyses:', error);
            } finally {
                setLoadingAnalyses(false);
            }
        };

        fetchSavedAnalyses();
    }, [user, isLoaded]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setError(null);
            } else {
                setError('Please upload a PDF file');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a PDF file');
            }
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:8000/analyze-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();
            localStorage.setItem('resumeAnalysis', JSON.stringify(result));
            router.push('/dashboard/resume-analyze/results');

        } catch (err) {
            setError('Failed to analyze resume. Please try again.');
            console.error('Analysis error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleViewAnalysis = async (analysisId: string) => {
        try {
            const dbUserId = localStorage.getItem('dbUserId');

            if (!dbUserId) {
                alert('User not authenticated');
                return;
            }

            // ✅ Changed to POST with /view endpoint
            const response = await fetch(
                `http://localhost:5000/api/analysis/${analysisId}/view`,
                {
                    method: 'POST', // ✅ Changed from GET to POST
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: dbUserId }), // ✅ Send in body
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load analysis');
            }

            const data = await response.json();

            // Reconstruct analysis format
            const reconstructed = {
                status: 'success',
                processing_time: 0,
                extracted_info: {
                    name: data.data.candidateName,
                    email: data.data.candidateEmail,
                    phone: data.data.candidatePhone,
                    organizations: data.data.organizations,
                    locations: data.data.locations,
                },
                skills: data.data.skills,
                analysis: {
                    career_recommendations: data.data.careerRecommendations,
                    ats_score: data.data.atsScore,
                    ats_feedback: data.data.atsFeedback,
                    missing_skills: data.data.missingSkills,
                    quick_wins: data.data.quickWins,
                    salary_prediction: {
                        min: data.data.salaryMin,
                        max: data.data.salaryMax,
                        currency: data.data.salaryCurrency,
                    },
                    summary: data.data.summary,
                },
            };

            localStorage.setItem('resumeAnalysis', JSON.stringify(reconstructed));
            router.push('/dashboard/resume-analyze/results');

        } catch (error) {
            console.error('Failed to load analysis:', error);
            alert('Failed to load analysis');
        }
    };
    

    const handleDeleteAnalysis = async (analysisId: string) => {
        if (!confirm('Delete this analysis?')) return;

        try {
            const dbUserId = localStorage.getItem('dbUserId');
            const response = await fetch(`http://localhost:5000/api/analysis/${analysisId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: dbUserId }),
            });

            if (response.ok) {
                setSavedAnalyses(prev => prev.filter(a => a.id !== analysisId));
            } else {
                alert('Failed to delete analysis');
            }
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete analysis');
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor(diff / 60000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 30) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/20">
                        <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            AI Resume <span className="text-primary">Analyzer</span>
                        </h1>
                        <p className="text-white/60 text-sm mt-1">
                            Get instant career insights powered by ML and Gemini AI
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                {!uploading && (
                    <div className="space-y-8">
                        {/* Upload Card */}
                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-10">
                            <h3 className="text-2xl font-bold mb-8 text-center">Upload Your Resume</h3>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Drag & Drop Zone */}
                            <div
                                className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all mb-6 ${dragActive
                                        ? 'border-primary bg-primary/10'
                                        : file
                                            ? 'border-primary/50 bg-primary/5'
                                            : 'border-white/20 hover:border-white/30 bg-black/30'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".pdf"
                                    onChange={handleChange}
                                    className="hidden"
                                />

                                {!file ? (
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 ring-2 ring-primary/30">
                                            <Upload className="w-10 h-10 text-primary" />
                                        </div>
                                        <p className="text-2xl font-bold mb-2">Drop your resume here</p>
                                        <p className="text-white/60 mb-4">or click to browse files</p>
                                        <p className="text-sm text-white/40">Supports PDF files up to 10MB</p>
                                    </label>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-primary/30 rounded-2xl flex items-center justify-center mb-6 ring-2 ring-primary/50">
                                            <FileText className="w-10 h-10 text-primary" />
                                        </div>
                                        <p className="text-xl font-bold mb-2">{file.name}</p>
                                        <p className="text-sm text-white/60 mb-4">{(file.size / 1024).toFixed(2)} KB</p>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={!file}
                                className="w-full px-8 py-5 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                            >
                                <Sparkles className="w-6 h-6" />
                                Analyze Resume
                            </button>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
                                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/20">
                                    <Brain className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">AI-Powered Analysis</h3>
                                <p className="text-sm text-white/60">Using spaCy NER, Sentence-BERT, and Gemini 2.5</p>
                            </div>

                            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
                                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/20">
                                    <Target className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Career Insights</h3>
                                <p className="text-sm text-white/60">Personalized paths, skill gaps, salary predictions</p>
                            </div>

                            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
                                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/20">
                                    <Zap className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Instant Results</h3>
                                <p className="text-sm text-white/60">Get comprehensive analysis in 10-15 seconds</p>
                            </div>
                        </div>

                        {/* Saved Analyses */}
                        {user && savedAnalyses.length > 0 && (
                            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <History className="w-6 h-6 text-primary" />
                                        <h3 className="text-2xl font-bold">My Saved Analyses</h3>
                                    </div>
                                    <span className="text-sm text-white/60">{savedAnalyses.length} saved</span>
                                </div>

                                <div className="grid gap-4">
                                    {savedAnalyses.map((analysis) => (
                                        <div
                                            key={analysis.id}
                                            className="group bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-primary/40 transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-bold text-lg">{analysis.candidateName || 'Unnamed Resume'}</h4>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${analysis.atsScore >= 80
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                                : analysis.atsScore >= 60
                                                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            }`}>
                                                            ATS: {analysis.atsScore}/100
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-white/60 mb-2">{analysis.candidateEmail || 'No email'}</p>
                                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatTimestamp(analysis.analyzedAt)}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewAnalysis(analysis.id)}
                                                        className="p-2 hover:bg-primary/20 rounded-lg transition-all group-hover:opacity-100 opacity-70"
                                                        title="View analysis"
                                                    >
                                                        <Eye className="w-5 h-5 text-primary" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAnalysis(analysis.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {uploading && (
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-16 text-center">
                        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 relative ring-2 ring-primary/20">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping"></div>
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-3">Analyzing Your Resume</h3>
                        <p className="text-white/70 text-lg mb-6">
                            Our AI is extracting skills, analyzing experience, and generating career insights...
                        </p>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-600 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm text-white/60 mt-4">Processing with 4 ML models...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
