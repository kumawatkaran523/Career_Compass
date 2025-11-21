// app/dashboard/companies/[companyId]/add-experience/page.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddExperiencePage({ params }: { params: { companyId: string } }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        // Step 1
        role: '',
        interviewType: 'ON_CAMPUS',
        interviewDate: '',
        outcome: '',

        // Step 2
        rounds: [] as any[],

        // Step 3
        salaryOffered: '',
        joiningBonus: '',
        otherBenefits: '',

        // Step 4
        overallDifficulty: 'MEDIUM',
        overallRating: 4,
        reviewTitle: '',
        reviewText: '',
        preparationTips: '',
        interviewerBehavior: '',

        // Step 5
        isAnonymous: false,
    });

    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        // TODO: Submit to API
        console.log('Submitting:', formData);
        router.push(`/dashboard/companies/${params.companyId}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Link
                    href={`/dashboard/companies/${params.companyId}`}
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Company
                </Link>
                <h1 className="text-3xl font-bold">Share Your Interview Experience</h1>
                <p className="text-white/60 mt-2">Help your fellow students by sharing your experience</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                        <div className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${step <= currentStep
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-white/40'
                                    }`}
                            >
                                {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                            </div>
                        </div>
                        {step < totalSteps && (
                            <div className={`h-0.5 flex-1 mx-2 ${step < currentStep ? 'bg-primary' : 'bg-white/10'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                {currentStep === 1 && <Step1BasicInfo formData={formData} setFormData={setFormData} />}
                {currentStep === 2 && <Step2Rounds formData={formData} setFormData={setFormData} />}
                {currentStep === 3 && <Step3Compensation formData={formData} setFormData={setFormData} />}
                {currentStep === 4 && <Step4Review formData={formData} setFormData={setFormData} />}
                {currentStep === 5 && <Step5Privacy formData={formData} setFormData={setFormData} />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {currentStep < totalSteps ? (
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all"
                    >
                        Submit Experience
                    </button>
                )}
            </div>
        </div>
    );
}

// Step 1: Basic Info
function Step1BasicInfo({ formData, setFormData }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

            <div>
                <label className="block text-sm font-medium mb-2">Role Applied</label>
                <input
                    type="text"
                    placeholder="e.g., Software Developer, Analyst"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Interview Type</label>
                <select
                    value={formData.interviewType}
                    onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                >
                    <option value="ON_CAMPUS">On Campus</option>
                    <option value="OFF_CAMPUS">Off Campus</option>
                    <option value="REFERRAL">Referral</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Interview Date</label>
                <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Outcome</label>
                <div className="grid grid-cols-3 gap-4">
                    {['SELECTED', 'REJECTED', 'WAITING'].map((outcome) => (
                        <button
                            key={outcome}
                            onClick={() => setFormData({ ...formData, outcome })}
                            className={`px-4 py-3 rounded-lg font-medium transition-all ${formData.outcome === outcome
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {outcome}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Step 2: Rounds (simplified - you can expand this)
function Step2Rounds({ formData, setFormData }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Interview Rounds</h2>
            <p className="text-white/60">Add details about each interview round (implementation needed)</p>
            {/* Add dynamic round addition logic here */}
        </div>
    );
}

// Step 3: Compensation
function Step3Compensation({ formData, setFormData }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Compensation Details</h2>

            <div>
                <label className="block text-sm font-medium mb-2">Salary Offered (LPA)</label>
                <input
                    type="number"
                    placeholder="e.g., 3.6"
                    value={formData.salaryOffered}
                    onChange={(e) => setFormData({ ...formData, salaryOffered: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                />
            </div>
        </div>
    );
}

// Step 4: Review
function Step4Review({ formData, setFormData }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Overall Review</h2>

            <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <input
                    type="text"
                    placeholder="e.g., Smooth interview process"
                    value={formData.reviewTitle}
                    onChange={(e) => setFormData({ ...formData, reviewTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Detailed Review</label>
                <textarea
                    rows={6}
                    placeholder="Share your detailed experience..."
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 resize-none"
                />
            </div>
        </div>
    );
}

// Step 5: Privacy
function Step5Privacy({ formData, setFormData }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary focus:ring-primary"
                />
                <label htmlFor="anonymous" className="text-white/80">
                    Post this experience anonymously
                </label>
            </div>
        </div>
    );
}
