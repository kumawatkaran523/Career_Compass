import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { Bell } from 'lucide-react';

export default async function DashboardHeader() {
    const user = await currentUser();

    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
            {/* Welcome Message */}
            <div>
                <h2 className="text-lg font-semibold">
                    Welcome back, <span className="text-primary">{user?.firstName || 'User'}</span>!
                </h2>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </button>

                {/* User Button */}
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "w-9 h-9"
                        }
                    }}
                />
            </div>
        </header>
    );
}
