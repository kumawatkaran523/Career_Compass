// app/onboarding/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Rocket, GraduationCap, ArrowRight, Loader2, Plus, Search } from 'lucide-react';

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<any[]>([]);
    const [showAddCollege, setShowAddCollege] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        collegeId: '',
        collegeName: '',
        collegeLocation: '',
        graduationYear: '',
    });

    const graduationYears = ['2025', '2026', '2027', '2028', '2029', '2030'];

    // Fetch colleges from backend (dynamically added by users)
    useEffect(() => {
        fetchColleges();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            router.push('/login');
            return;
        }

        checkIfAlreadyCompleted();
    }, [isLoaded, user]);
    
    const fetchColleges = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colleges`);
            if (response.ok) {
                const data = await response.json();
                setColleges(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
        }
    };

    const checkIfAlreadyCompleted = async () => {
        try {
            console.log('🔍 Checking if onboarding already completed...');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/clerk/${user?.id}`
            );

            if (response.ok) {
                const userData = await response.json();
                console.log('👤 User data:', userData.data);

                // If user already has college, redirect to dashboard
                if (userData.data?.collegeId) {
                    console.log('✅ Already completed onboarding, redirecting to dashboard...');
                    router.push('/dashboard');
                    return;
                }

                console.log('⚠️ No college found, showing onboarding form');
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!showAddCollege && !formData.collegeId) {
            alert('Please select a college');
            return;
        }

        if (showAddCollege && (!formData.collegeName || !formData.collegeLocation)) {
            alert('Please enter college name and location');
            return;
        }

        if (!formData.graduationYear) {
            alert('Please select graduation year');
            return;
        }

        setLoading(true);

        try {
            let collegeIdToUse = formData.collegeId;

            // If adding new college, create it first
            if (showAddCollege) {
                const collegeResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colleges`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: formData.collegeName,
                            location: formData.collegeLocation,
                        }),
                    }
                );

                if (collegeResponse.ok) {
                    const newCollege = await collegeResponse.json();
                    collegeIdToUse = newCollege.data.id;
                } else {
                    alert('Failed to add college. Please try again.');
                    setLoading(false);
                    return;
                }
            }

            // Sync user data with college info
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sync`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clerkId: user?.id,
                        email: user?.primaryEmailAddress?.emailAddress,
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        imageUrl: user?.imageUrl,
                        collegeId: collegeIdToUse,
                        graduationYear: parseInt(formData.graduationYear),
                    }),
                }
            );

            if (response.ok) {
                router.push('/dashboard');
            } else {
                alert('Failed to save profile. Please try again.');
            }
        } catch (error) {
            console.error('Onboarding error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredColleges = colleges.filter(
        (college) =>
            college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            college.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 justify-center mb-4">
                        <Rocket className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-bold">
                            Career<span className="text-primary">Compass</span>
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}! 👋</h1>
                    <p className="text-white/70">Complete your profile to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            Select Your College *
                        </label>

                        <div className="flex items-center gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setShowAddCollege(false)}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showAddCollege
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                Select from List
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddCollege(true)}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${showAddCollege
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                Add New College
                            </button>
                        </div>

                        {!showAddCollege ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search colleges..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                </div>

                                <select
                                    required={!showAddCollege}
                                    value={formData.collegeId}
                                    onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
                                >
                                    <option value="" className="bg-black">
                                        {colleges.length > 0 ? 'Select your college' : 'No colleges found - Add yours!'}
                                    </option>
                                    {filteredColleges.map((college) => (
                                        <option key={college.id} value={college.id} className="bg-black">
                                            {college.name} {college.location && `- ${college.location}`}
                                        </option>
                                    ))}
                                </select>

                                <p className="text-xs text-white/40">
                                    Can't find your college? Click "Add New College" above
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="College Name (e.g., XYZ University)"
                                    required={showAddCollege}
                                    value={formData.collegeName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, collegeName: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Location (e.g., Mumbai, India)"
                                    required={showAddCollege}
                                    value={formData.collegeLocation}
                                    onChange={(e) =>
                                        setFormData({ ...formData, collegeLocation: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <p className="text-xs text-white/40">
                                    Your college will be added to our database for other students
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Expected Graduation Year *</label>
                        <select
                            required
                            value={formData.graduationYear}
                            onChange={(e) =>
                                setFormData({ ...formData, graduationYear: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
                        >
                            <option value="" className="bg-black">
                                Select graduation year
                            </option>
                            {graduationYears.map((year) => (
                                <option key={year} value={year} className="bg-black">
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                Complete Setup
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
