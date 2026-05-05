import React from 'react';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import ScheduleTable from '../components/ScheduleTable';
import QuickActions from '../components/QuickActions';
import RecentPayments from '../components/RecentPayments';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex w-full bg-background text-foreground font-sans overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="p-8 flex-1 flex flex-col gap-6 overflow-auto">
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-6">
                            <StatsCard title="Patients Seen" value="24" trend="+12%" trendUp={true} icon="users" />
                            <StatsCard title="Today's Revenue" value="$3,240" trend="+8%" trendUp={true} icon="dollar-sign" />
                            <StatsCard title="New Patients" value="5" trend="+2" trendUp={true} icon="user-plus" />
                            <StatsCard title="Appointments" value="32" trend="-1" trendUp={false} icon="calendar" />
                        </div>

                        {/* Content Row */}
                        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
                            <div className="col-span-2">
                                <ScheduleTable />
                            </div>
                            <div className="col-span-1 flex flex-col gap-6">
                                <QuickActions />
                                <RecentPayments />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}