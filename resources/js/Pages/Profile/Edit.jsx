import React from 'react';
import { Head } from '@inertiajs/react';
import { User, Lock, AlertTriangle, LogOut } from 'lucide-react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import SignOutSection from './Partials/SignOutSection';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <ClinicLayout>
            <Head title="Settings" />

            <div className="mx-auto w-full max-w-[1100px] px-5 py-10 lg:px-16">
                {/* ── Page header ───────────────────────────────────── */}
                <div className="pb-8">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">
                        Your Account
                    </p>
                    <h1 className="mt-3 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">
                        Settings
                    </h1>
                    <p className="mt-3 text-[16px] text-slate-500">
                        Manage your profile and account information.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile information */}
                    <SectionCard
                        icon={User}
                        tone="blue"
                        title="Profile information"
                        description="Update your name and account email address."
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </SectionCard>

                    {/* Update password */}
                    <SectionCard
                        icon={Lock}
                        tone="blue"
                        title="Update password"
                        description="Ensure your account is using a long, random password to stay secure."
                    >
                        <UpdatePasswordForm />
                    </SectionCard>

                    {/* Delete account */}
                    <SectionCard
                        icon={AlertTriangle}
                        tone="red"
                        title="Delete account"
                        description="Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, download any data or information you wish to retain."
                        hideHeaderBorder
                    >
                        <DeleteUserForm />
                    </SectionCard>

                    {/* Sign out */}
                    <SectionCard
                        icon={LogOut}
                        tone="red"
                        title="Sign out of this device"
                        description="You'll need your account credentials to access the clinic workspace again."
                        hideHeaderBorder
                    >
                        <SignOutSection />
                    </SectionCard>
                </div>
            </div>
        </ClinicLayout>
    );
}

const TONES = {
    blue: 'bg-[#eaf0fb] text-clinic-blue',
    red: 'bg-[#fde8e8] text-[#d94a4a]',
};

function SectionCard({ icon: Icon, tone = 'blue', title, description, children, hideHeaderBorder = false }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
            {/* Header */}
            <header
                className={`flex items-start gap-4 px-7 py-6 ${
                    hideHeaderBorder ? '' : 'border-b border-clinic-line'
                }`}
            >
                <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}
                >
                    <Icon className="h-6 w-6" />
                </span>
                <div>
                    <h2 className="text-[18px] font-semibold text-clinic-ink">{title}</h2>
                    <p className="mt-1 text-[14px] text-slate-500">{description}</p>
                </div>
            </header>

            {/* Body */}
            <div className="px-7 py-6">{children}</div>
        </section>
    );
}