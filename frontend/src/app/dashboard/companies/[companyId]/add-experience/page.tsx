'use client';

import { useState, use } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface Round {
    roundNumber: number;
    name: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    duration: string;
    description: string;
}

export default function AddExperiencePage({ params }: { params: Promise<{ companyId: string }> }) {
    const router = useRouter();
    const { user } = useUser();
    const resolvedParams = use(params);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        role: '',
        interviewType: 'ON_CAMPUS',
        interviewDate: '',
        outcome: '',
        rounds: [
            {
                roundNumber: 1,
                name: '',
                difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
                duration: '',
                description: '',
            }
        ] as Round[],
        salaryOffered: '',
        joiningBonus: '',
        otherBenefits: '',
        overallDifficulty: 'MEDIUM',
        overallRating: 4,
        reviewTitle: '',
        reviewText: '',
        applicationProcess: '',
        preparationTips: '',
        interviewerBehavior: '',
        isAnonymous: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.role.trim()) newErrors.role = 'Role is required';
            if (!formData.interviewDate) newErrors.interviewDate = 'Interview date is required';
            if (!formData.outcome) newErrors.outcome = 'Outcome is required';
        }

        if (step === 2) {
            if (formData.rounds.length === 0) {
                newErrors.rounds = 'At least one round is required';
            } else {
                formData.rounds.forEach((round, idx) => {
                    if (!round.name.trim()) {
                        newErrors[`round_${idx}_name`] = `Round ${idx + 1} name is required`;
                    }
                });
            }
        }

        if (step === 4) {
            if (!formData.reviewTitle.trim()) newErrors.reviewTitle = 'Review title is required';
            if (!formData.reviewText.trim() || formData.reviewText.length < 100) {
                newErrors.reviewText = 'Review must be at least 100 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);

        try {
            const userResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/clerk/${user?.id}`
            );

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const userData = await userResponse.json();
            const userId = userData.data.id;
            const collegeId = userData.data.collegeId;

            if (!collegeId) {
                alert('Please complete your profile with college information first.');
                router.push('/onboarding');
                return;
            }

            const payload = {
                userId,
                companyId: resolvedParams.companyId,
                collegeId,
                role: formData.role,
                interviewType: formData.interviewType,
                interviewDate: formData.interviewDate,
                outcome: formData.outcome,
                rounds: formData.rounds,
                salaryOffered: formData.salaryOffered ? parseFloat(formData.salaryOffered) : null,
                joiningBonus: formData.joiningBonus ? parseFloat(formData.joiningBonus) : null,
                otherBenefits: formData.otherBenefits || null,
                overallDifficulty: formData.overallDifficulty,
                overallRating: formData.overallRating,
                reviewTitle: formData.reviewTitle,
                reviewText: formData.reviewText,
                applicationProcess: formData.applicationProcess || null,
                preparationTips: formData.preparationTips || null,
                interviewerBehavior: formData.interviewerBehavior || null,
                isAnonymous: formData.isAnonymous,
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create experience');
            }

            const data = await response.json();
            console.log('Experience created:', data);

            router.push(`/dashboard/companies/${resolvedParams.companyId}`);
        } catch (error: any) {
            console.error('Error submitting experience:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepTitles = [
        'Basic Info',
        'Interview Rounds',
        'Compensation',
        'Review',
        'Privacy'
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Link
                    href={`/dashboard/companies/${resolvedParams.companyId}`}
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Company
                </Link>
                <h1 className="text-3xl font-bold">Share Your Interview Experience</h1>
                <p className="text-white/60 mt-2">Help your fellow students by sharing your experience</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4, 5].map((step, idx) => (
                        <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${step <= currentStep
                                            ? 'bg-primary text-white'
                                            : 'bg-white/5 text-white/40'
                                        }`}
                                >
                                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                                </div>
                                <span className={`text-xs font-medium ${step === currentStep ? 'text-primary' : 'text-white/60'
                                    }`}>
                                    {stepTitles[idx]}
                                </span>
                            </div>
                            {step < totalSteps && (
                                <div className={`h-0.5 flex-1 mx-2 ${step < currentStep ? 'bg-primary' : 'bg-white/10'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                {currentStep === 1 && <Step1BasicInfo formData={formData} setFormData={setFormData} errors={errors} />}
                {currentStep === 2 && <Step2Rounds formData={formData} setFormData={setFormData} errors={errors} />}
                {currentStep === 3 && <Step3Compensation formData={formData} setFormData={setFormData} errors={errors} />}
                {currentStep === 4 && <Step4Review formData={formData} setFormData={setFormData} errors={errors} />}
                {currentStep === 5 && <Step5Privacy formData={formData} setFormData={setFormData} />}
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                >
                    Previous
                </button>
                {currentStep < totalSteps ? (
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Experience'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

function Step1BasicInfo({ formData, setFormData, errors }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                <p className="text-white/60 text-sm">Tell us about your interview basics</p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Role Applied For <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g., Software Developer, Business Analyst"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                />
                {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Interview Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: 'ON_CAMPUS', label: 'On Campus' },
                        { value: 'OFF_CAMPUS', label: 'Off Campus' },
                        { value: 'REFERRAL', label: 'Referral' }
                    ].map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, interviewType: type.value })}
                            className={`px-4 py-3 rounded-lg font-medium transition-all ${formData.interviewType === type.value
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Interview Date <span className="text-red-400">*</span>
                </label>
                <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
                />
                {errors.interviewDate && <p className="mt-1 text-sm text-red-400">{errors.interviewDate}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Outcome <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: 'SELECTED', label: 'Selected', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                        { value: 'REJECTED', label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                        { value: 'WAITING', label: 'Waiting', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
                    ].map((outcome) => (
                        <button
                            key={outcome.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, outcome: outcome.value })}
                            className={`px-4 py-3 rounded-lg font-medium transition-all border ${formData.outcome === outcome.value
                                    ? outcome.color
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10'
                                }`}
                        >
                            {outcome.label}
                        </button>
                    ))}
                </div>
                {errors.outcome && <p className="mt-1 text-sm text-red-400">{errors.outcome}</p>}
            </div>
        </div>
    );
}

function Step2Rounds({ formData, setFormData, errors }: any) {
    const addRound = () => {
        setFormData({
            ...formData,
            rounds: [
                ...formData.rounds,
                {
                    roundNumber: formData.rounds.length + 1,
                    name: '',
                    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
                    duration: '',
                    description: '',
                }
            ]
        });
    };

    const removeRound = (index: number) => {
        const newRounds = formData.rounds.filter((_: any, i: number) => i !== index);
        const renumbered = newRounds.map((round: any, idx: number) => ({
            ...round,
            roundNumber: idx + 1
        }));
        setFormData({ ...formData, rounds: renumbered });
    };

    const updateRound = (index: number, field: string, value: any) => {
        const newRounds = [...formData.rounds];
        newRounds[index] = { ...newRounds[index], [field]: value };
        setFormData({ ...formData, rounds: newRounds });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Interview Rounds</h2>
                    <p className="text-white/60 text-sm">Describe each round of the interview process</p>
                </div>
                <button
                    type="button"
                    onClick={addRound}
                    className="px-4 py-2 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all flex items-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Round
                </button>
            </div>

            {errors.rounds && <p className="text-sm text-red-400">{errors.rounds}</p>}

            <div className="space-y-4">
                {formData.rounds.map((round: Round, index: number) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Round {round.roundNumber}</h3>
                            {formData.rounds.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeRound(index)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Round Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Aptitude Test, Technical Interview"
                                    value={round.name}
                                    onChange={(e) => updateRound(index, 'name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                {errors[`round_${index}_name`] && (
                                    <p className="mt-1 text-sm text-red-400">{errors[`round_${index}_name`]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Duration</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 60 minutes"
                                    value={round.duration}
                                    onChange={(e) => updateRound(index, 'duration', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['EASY', 'MEDIUM', 'HARD'].map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        type="button"
                                        onClick={() => updateRound(index, 'difficulty', difficulty)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${round.difficulty === difficulty
                                                ? 'bg-primary text-white'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {difficulty}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                rows={3}
                                placeholder="Describe what was asked, topics covered, etc..."
                                value={round.description}
                                onChange={(e) => updateRound(index, 'description', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Step3Compensation({ formData, setFormData, errors }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Compensation Details</h2>
                <p className="text-white/60 text-sm">Share salary and benefits information (optional)</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Salary Offered (LPA)</label>
                    <input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 3.6"
                        value={formData.salaryOffered}
                        onChange={(e) => setFormData({ ...formData, salaryOffered: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Joining Bonus (LPA)</label>
                    <input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 0.5"
                        value={formData.joiningBonus}
                        onChange={(e) => setFormData({ ...formData, joiningBonus: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Other Benefits</label>
                <textarea
                    rows={4}
                    placeholder="e.g., Health insurance, flexible work hours, learning opportunities..."
                    value={formData.otherBenefits}
                    onChange={(e) => setFormData({ ...formData, otherBenefits: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-white/80">
                    💡 <strong>Tip:</strong> Sharing compensation details helps other students negotiate better offers and make informed career decisions.
                </p>
            </div>
        </div>
    );
}

function Step4Review({ formData, setFormData, errors }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Overall Review</h2>
                <p className="text-white/60 text-sm">Share your overall experience and tips</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Overall Difficulty <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['EASY', 'MEDIUM', 'HARD'].map((difficulty) => (
                            <button
                                key={difficulty}
                                type="button"
                                onClick={() => setFormData({ ...formData, overallDifficulty: difficulty })}
                                className={`px-4 py-3 rounded-lg font-medium transition-all ${formData.overallDifficulty === difficulty
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {difficulty}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Overall Rating <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => setFormData({ ...formData, overallRating: rating })}
                                className="transition-all"
                            >
                                <Star
                                    className={`w-8 h-8 ${rating <= formData.overallRating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-white/20'
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="ml-2 text-white/60">{formData.overallRating}/5</span>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Review Title <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g., Smooth interview process with focus on DSA"
                    value={formData.reviewTitle}
                    onChange={(e) => setFormData({ ...formData, reviewTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                />
                {errors.reviewTitle && <p className="mt-1 text-sm text-red-400">{errors.reviewTitle}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Detailed Review <span className="text-red-400">*</span>
                </label>
                <textarea
                    rows={6}
                    placeholder="Share your detailed experience, what worked well, challenges faced, overall process..."
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
                <div className="mt-1 flex justify-between text-sm">
                    {errors.reviewText ? (
                        <p className="text-red-400">{errors.reviewText}</p>
                    ) : (
                        <span className="text-white/40">Minimum 100 characters</span>
                    )}
                    <span className={formData.reviewText.length >= 100 ? 'text-green-400' : 'text-white/40'}>
                        {formData.reviewText.length}/100
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Application Process</label>
                <textarea
                    rows={3}
                    placeholder="How did you apply? What was the selection criteria?"
                    value={formData.applicationProcess}
                    onChange={(e) => setFormData({ ...formData, applicationProcess: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Preparation Tips</label>
                <textarea
                    rows={4}
                    placeholder="What should others prepare? Resources you used, topics to focus on..."
                    value={formData.preparationTips}
                    onChange={(e) => setFormData({ ...formData, preparationTips: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Interviewer Behavior</label>
                <input
                    type="text"
                    placeholder="e.g., Friendly, Professional, Helpful"
                    value={formData.interviewerBehavior}
                    onChange={(e) => setFormData({ ...formData, interviewerBehavior: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                />
            </div>
        </div>
    );
}

function Step5Privacy({ formData, setFormData }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Privacy Settings</h2>
                <p className="text-white/60 text-sm">Choose how you want to share your experience</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
                <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                        className="w-5 h-5 mt-0.5 rounded bg-white/5 border-white/10 text-primary focus:ring-primary"
                    />
                    <div>
                        <label htmlFor="anonymous" className="font-medium text-white cursor-pointer">
                            Post this experience anonymously
                        </label>
                        <p className="text-sm text-white/60 mt-1">
                            Your name will not be shown with this experience. Only your college and graduation year will be visible.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-blue-400">Review Before Submitting</h3>
                <ul className="space-y-2 text-sm text-white/80">
                    <li>✓ All information provided is accurate</li>
                    <li>✓ Review is respectful and constructive</li>
                    <li>✓ No personal or confidential information shared</li>
                    <li>✓ Experience will help other students</li>
                </ul>
            </div>
        </div>
    );
}
