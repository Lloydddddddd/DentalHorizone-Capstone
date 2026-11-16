import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight, Home, Settings, Users, X, CreditCard } from 'lucide-react';

function ToothIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 3.5c-1.6-1.3-5.5-1.8-7 1.2-1.2 2.4-.2 5.1.7 7.2.7 1.7.8 3.6 1.2 5.4.3 1.2 1.1 2 2 2 1.2 0 1.7-1.5 2.1-3 .2-.8.5-1.3 1-1.3s.8.5 1 1.3c.4 1.5.9 3 2.1 3 .9 0 1.7-.8 2-2 .4-1.8.5-3.7 1.2-5.4.9-2.1 1.9-4.8.7-7.2-1.5-3-5.4-2.5-7-1.2z" />
        </svg>
    );
}

const NAV = [
    {
        label: 'Overview',
        href: '/dashboard',
        icon: Home,
        isActive: (url) => url.startsWith('/dashboard'),
    },
    {
        label: 'Patients',
        href: '/patients',
        icon: Users,
        isActive: (url) => url.startsWith('/patients'),
    },
    {
        label: 'Dental services',
        href: '/services',
        icon: ToothIcon,
        isActive: (url) => url.startsWith('/services'),
    },
    {
        label: 'Appointments',
        href: '/appointments',
        icon: CalendarDays,
        badge: true,
        isActive: (url) => url.startsWith('/appointments'),
    },
    {
        label: 'Billing',
        href: '/billing',
        icon: CreditCard,
        isActive: (url) => url.startsWith('/billing'),
    },
];

export default function ClinicSidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }) {
    const { url, props } = usePage();
    const activeUrl = url.toLowerCase();
    const pending = Number(props.pendingAppointments ?? 0);
    const hideWhenCollapsed = collapsed ? 'lg:hidden' : '';
    const settingsActive = activeUrl.startsWith('/profile');

    return (
        <>
            {mobileOpen && (
                <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-clinic-navy text-white transition-all duration-200 lg:static lg:translate-x-0 ${
                    collapsed ? 'lg:w-[6rem]' : 'lg:w-72'
                } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Brand */}
                <div className="relative flex items-center justify-center border-b border-white/10 px-6 py-6">
                    
                    {/* Centered Text Logo */}
                    <Link href="/dashboard" className="flex flex-col items-center justify-center text-center">
                        <span className={`text-[12px] font-semibold uppercase tracking-[0.25em] text-white/55 ${hideWhenCollapsed}`}>
                            Dental
                        </span>
                        <span className={`mt-1 block text-[22px] font-bold tracking-tight ${hideWhenCollapsed}`}>
                            Horiz<span className="text-clinic-accent">o</span>ne
                        </span>
                        
                        {collapsed && (
                            <span className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-white text-clinic-navy text-sm font-bold">
                                DH
                            </span>
                        )}
                    </Link>

                    {/* Toggle Buttons */}
                    <button
                        type="button"
                        onClick={onToggleCollapsed}
                        className={`absolute right-4 hidden rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white ${collapsed ? '' : 'lg:block'}`}
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="absolute right-4 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-1 flex-col gap-[5px] overflow-y-auto px-3 pb-4 pt-7">
                    <p className={`px-3 pb-[10px] text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40 ${hideWhenCollapsed}`}>
                        Workspace
                    </p>

                    {collapsed && (
                        <button
                            type="button"
                            onClick={onToggleCollapsed}
                            className="mb-2 hidden items-center justify-center rounded-xl py-2 text-white/60 hover:bg-white/10 hover:text-white lg:flex"
                            aria-label="Expand sidebar"
                        >
                            <ChevronRight size={18} />
                        </button>
                    )}

                    {NAV.map((item) => {
                        const Icon = item.icon;
                        const active = item.isActive(activeUrl);

                        return (
                            <div key={item.label}>
                                <Link
                                    href={item.href}
                                    title={collapsed ? item.label : undefined}
                                    className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[16px] leading-6 transition-colors ${
                                        collapsed ? 'lg:justify-center lg:px-0' : ''
                                    } ${
                                        active
                                            ? 'bg-white font-semibold text-clinic-navy shadow-sm'
                                            : 'font-medium text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon className={`h-6 w-6 shrink-0 ${active ? 'text-clinic-accent' : ''}`} />
                                    <span className={`truncate ${hideWhenCollapsed}`}>{item.label}</span>

                                    {item.badge && pending > 0 && (
                                        <>
                                            <span className={`ml-auto rounded-lg bg-clinic-accent px-2.5 py-0.5 text-[13px] font-bold text-white ${hideWhenCollapsed}`}>
                                                {pending > 99 ? '99+' : pending}
                                            </span>
                                            {collapsed && (
                                                <span className="absolute right-3 top-2.5 hidden h-2.5 w-2.5 rounded-full bg-clinic-accent ring-2 ring-clinic-navy lg:block" />
                                            )}
                                        </>
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="space-y-4 px-3 pb-4">
                    <Link
                        href="/profile"
                        title={collapsed ? 'Settings' : undefined}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[16px] leading-6 transition-colors ${
                            collapsed ? 'lg:justify-center lg:px-0' : ''
                        } ${
                            settingsActive
                                ? 'bg-white font-semibold text-clinic-navy'
                                : 'font-medium text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Settings className={`h-6 w-6 shrink-0 ${settingsActive ? 'text-clinic-accent' : ''}`} />
                        <span className={hideWhenCollapsed}>Settings</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}