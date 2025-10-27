import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/login');
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
