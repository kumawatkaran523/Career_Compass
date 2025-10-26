import { LucideIcon } from 'lucide-react';

interface BadgeProps {
    icon?: LucideIcon;
    text: string;
    variant?: 'default' | 'primary';
}

export default function Badge({ icon: Icon, text, variant = 'default' }: BadgeProps) {
    const variants = {
        default: 'bg-white/5 border-white/10',
        primary: 'bg-primary/10 border-primary/20 text-primary',
    };

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full ${variants[variant]}`}>
            {Icon && <Icon className="w-4 h-4" />}
            <span className="text-sm font-medium">{text}</span>
        </div>
    );
}
