// app/dashboard/layout.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

async function checkUserOnboarding(userId: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/clerk/${userId}`,
            { cache: 'no-store' }
        );

        if (response.ok) {
            const data = await response.json();
            return data.data;
        }
        return null;
    } catch (error) {
        console.error('Error checking user profile:', error);
        return null;
    }
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/login');
    }

    // Check if user has completed onboarding
    const userProfile = await checkUserOnboarding(userId);

    if (!userProfile?.collegeId) {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header - Sticky */}
                <DashboardHeader />

                {/* Page Content - Scrollable with consistent padding */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
