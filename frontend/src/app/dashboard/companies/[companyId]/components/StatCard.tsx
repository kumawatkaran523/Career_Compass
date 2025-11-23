import { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    color?: string;
}

export default function StatCard({ label, value, icon, color = 'text-white' }: StatCardProps) {
    return (
        <div className="bg-black/20 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-1">{label}</p>
            <div className={`text-2xl font-bold ${color} flex items-center gap-2`}>
                {icon}
                {value}
            </div>
        </div>
    );
}
