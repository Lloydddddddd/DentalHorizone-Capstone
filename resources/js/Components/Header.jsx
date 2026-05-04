import React from 'react';
import { Bell } from 'lucide-react';

export default function Header({ title = 'Dashboard', subtitle = 'Good morning, Sarah' }) {
    return (
        <header className="h-20 px-8 bg-surface border-b border-border flex items-center justify-between shrink-0">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold font-headings text-foreground">{title}</h1>
                <span className="text-sm text-muted">{subtitle}</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification bell */}
                <div className="relative">
                    <Bell size={20} className="text-muted" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface" />
                </div>

                <div className="h-8 w-px bg-border mx-2" />

                {/* User info */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-sm font-medium text-foreground">Sarah Jenkins</div>
                        <div className="text-xs text-muted">Front Desk</div>
                    </div>
                    <img
                        src="https://storage.googleapis.com/banani-avatars/avatar/female/25-35/European/1"
                        alt="Sarah Jenkins"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
