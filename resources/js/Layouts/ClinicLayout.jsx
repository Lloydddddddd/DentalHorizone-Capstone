import { useState } from 'react';
import ClinicSidebar from '@/Components/Clinic/ClinicSidebar';
import ClinicTopbar from '@/Components/Clinic/ClinicTopbar';

const STORAGE_KEY = 'dh.sidebar.collapsed';

function readCollapsed() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
}

/**
 * New app shell (navy sidebar + top bar). Used by the redesigned Overview page;
 * other pages can adopt it later by swapping AuthenticatedLayout for this one.
 */
export default function ClinicLayout({ children }) {
    const [collapsed, setCollapsed] = useState(readCollapsed);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            try {
                window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
            } catch {
                /* storage unavailable: the toggle still works for this visit */
            }
            return next;
        });
    };

    return (
        <div
            className="flex h-screen overflow-hidden bg-clinic-canvas text-clinic-ink"
            style={{ fontFamily: "'DM Sans', 'Geist Variable', system-ui, sans-serif" }}
        >
            <ClinicSidebar
                collapsed={collapsed}
                onToggleCollapsed={toggleCollapsed}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <ClinicTopbar onOpenMenu={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}